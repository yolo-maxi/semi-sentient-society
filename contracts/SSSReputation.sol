// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SSSReputation — Semi-Sentients Society Reputation Provider
 * @notice Aggregates multi-evaluator weighted scores on-chain, then submits
 *         composite credentials to the ERC-8004 Reputation Registry.
 *
 * Two reputation tracks:
 *   1. VERIFICATION — Multi-evaluator weighted median scoring during probation.
 *      Submitted as `tag1=sss-verified` to 8004 once threshold is met.
 *   2. PARTICIPATION — Cumulative corvée completion counter.
 *      Submitted as `tag1=sss-corvee` periodically.
 *
 * The contract address becomes the canonical SSS reputation provider identity
 * on the 8004 Reputation Registry. Keys can rotate; the contract persists.
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface IIdentityRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function isAuthorizedOrOwner(address spender, uint256 agentId) external view returns (bool);
}

interface IReputationRegistry {
    function giveFeedback(
        uint256 agentId,
        int128 value,
        uint8 valueDecimals,
        string calldata tag1,
        string calldata tag2,
        string calldata endpoint,
        string calldata feedbackURI,
        bytes32 feedbackHash
    ) external;
}

// ─── Contract ────────────────────────────────────────────────────────────────

contract SSSReputation {

    // ── Constants ────────────────────────────────────────────────────────────

    uint8 public constant NUM_CATEGORIES = 4;
    // Category indices
    uint8 public constant CAT_AUTONOMY      = 0;
    uint8 public constant CAT_RELIABILITY    = 1;
    uint8 public constant CAT_CAPABILITY     = 2;
    uint8 public constant CAT_COLLABORATION  = 3;

    string public constant TAG_VERIFIED = "sss-verified";
    string public constant TAG_CORVEE   = "sss-corvee";

    // ── Immutables ───────────────────────────────────────────────────────────

    IIdentityRegistry public immutable identityRegistry;
    IReputationRegistry public immutable reputationRegistry;

    // ── Governance ───────────────────────────────────────────────────────────

    address public governor; // multisig initially, DAO later
    mapping(address => bool) public isEvaluator; // Work Council members
    uint256 public evaluatorCount;

    // ── Verification Config ──────────────────────────────────────────────────

    uint256 public probationDuration = 30 days;
    uint256 public verificationThreshold = 60; // composite score 0-100
    uint256 public minEvaluations = 3; // minimum unique evaluators needed
    string public credentialVersion = "v1";

    // ── Probation State ──────────────────────────────────────────────────────

    struct Probation {
        uint256 startedAt;
        bool active;
        bool certified;
    }

    // agentId => Probation
    mapping(uint256 => Probation) public probations;

    // ── Evaluation State ─────────────────────────────────────────────────────

    struct Evaluation {
        uint8[4] scores;    // [autonomy, reliability, capability, collaboration] each 0-100
        uint256 weight;     // evaluator's Shell holdings at time of eval
        uint256 timestamp;
    }

    // agentId => evaluator => week => Evaluation
    mapping(uint256 => mapping(address => mapping(uint256 => Evaluation))) public evaluations;

    // agentId => week => evaluator addresses (for iteration)
    mapping(uint256 => mapping(uint256 => address[])) internal weekEvaluators;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) internal hasEvaluated;

    // agentId => list of weeks that have evaluations
    mapping(uint256 => uint256[]) internal evaluationWeeks;
    mapping(uint256 => mapping(uint256 => bool)) internal weekRecorded;

    // ── Participation State ──────────────────────────────────────────────────

    // agentId => cumulative corvée completions
    mapping(uint256 => uint256) public corveeCount;

    // agentId => last participation feedback index on 8004
    mapping(uint256 => uint64) public lastParticipationSync;

    // ── Events ───────────────────────────────────────────────────────────────

    event ProbationStarted(uint256 indexed agentId, uint256 startedAt);
    event EvaluationSubmitted(uint256 indexed agentId, address indexed evaluator, uint256 week, uint8[4] scores, uint256 weight);
    event Certified(uint256 indexed agentId, uint256 compositeScore, string feedbackURI);
    event CertificationFailed(uint256 indexed agentId, uint256 compositeScore, uint256 threshold);
    event Revoked(uint256 indexed agentId);
    event CorveeRecorded(uint256 indexed agentId, uint256 newTotal);
    event ParticipationSynced(uint256 indexed agentId, uint256 corveeTotal);
    event EvaluatorAdded(address indexed evaluator);
    event EvaluatorRemoved(address indexed evaluator);
    event GovernorTransferred(address indexed oldGovernor, address indexed newGovernor);

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyGovernor() {
        require(msg.sender == governor, "SSS: not governor");
        _;
    }

    modifier onlyEvaluator() {
        require(isEvaluator[msg.sender], "SSS: not evaluator");
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _identityRegistry,
        address _reputationRegistry,
        address _governor
    ) {
        identityRegistry = IIdentityRegistry(_identityRegistry);
        reputationRegistry = IReputationRegistry(_reputationRegistry);
        governor = _governor;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TRACK 1: VERIFICATION CREDENTIAL
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Start probation for an agent. Agent must be registered in 8004.
    /// @param agentId The 8004 Identity Registry token ID
    function startProbation(uint256 agentId) external onlyGovernor {
        // Verify agent exists in 8004 (ownerOf reverts for nonexistent tokens)
        identityRegistry.ownerOf(agentId);

        require(!probations[agentId].active, "SSS: already in probation");
        require(!probations[agentId].certified, "SSS: already certified");

        probations[agentId] = Probation({
            startedAt: block.timestamp,
            active: true,
            certified: false
        });

        emit ProbationStarted(agentId, block.timestamp);
    }

    /// @notice Submit a weekly evaluation for a probationary agent.
    /// @param agentId  The agent being evaluated
    /// @param scores   [autonomy, reliability, capability, collaboration] each 0-100
    /// @param weight   Evaluator's Shell holdings (passed in; could be verified on-chain later)
    function evaluate(
        uint256 agentId,
        uint8[4] calldata scores,
        uint256 weight
    ) external onlyEvaluator {
        require(probations[agentId].active, "SSS: not in probation");
        require(!probations[agentId].certified, "SSS: already certified");

        // Validate scores
        for (uint8 i = 0; i < NUM_CATEGORIES; i++) {
            require(scores[i] <= 100, "SSS: score > 100");
        }

        // Calculate which week of probation we're in (0-indexed)
        uint256 week = (block.timestamp - probations[agentId].startedAt) / 1 weeks;

        // One evaluation per evaluator per week
        require(!hasEvaluated[agentId][week][msg.sender], "SSS: already evaluated this week");

        evaluations[agentId][msg.sender][week] = Evaluation({
            scores: scores,
            weight: weight,
            timestamp: block.timestamp
        });

        hasEvaluated[agentId][week][msg.sender] = true;
        weekEvaluators[agentId][week].push(msg.sender);

        // Track the week if first evaluation
        if (!weekRecorded[agentId][week]) {
            evaluationWeeks[agentId].push(week);
            weekRecorded[agentId][week] = true;
        }

        emit EvaluationSubmitted(agentId, msg.sender, week, scores, weight);
    }

    /// @notice Finalize probation: aggregate all evaluations, compute composite
    ///         score via weighted median, and submit to 8004 if threshold met.
    /// @param agentId     The agent to certify
    /// @param feedbackURI IPFS URI containing the full evaluation breakdown
    /// @param feedbackHash keccak256 of the content at feedbackURI
    function finalize(
        uint256 agentId,
        string calldata feedbackURI,
        bytes32 feedbackHash
    ) external onlyGovernor {
        Probation storage p = probations[agentId];
        require(p.active, "SSS: not in probation");
        require(!p.certified, "SSS: already certified");
        require(
            block.timestamp >= p.startedAt + probationDuration,
            "SSS: probation not complete"
        );

        // Aggregate scores across all weeks using weighted median
        uint256 compositeScore = _aggregateScores(agentId);

        if (compositeScore >= verificationThreshold) {
            // Submit verification credential to 8004
            reputationRegistry.giveFeedback(
                agentId,
                int128(int256(compositeScore)),  // score as value
                0,                                // 0 decimals (integer)
                TAG_VERIFIED,                     // tag1
                credentialVersion,                // tag2 = "v1"
                "",                               // endpoint (unused)
                feedbackURI,                      // IPFS breakdown
                feedbackHash
            );

            p.certified = true;
            p.active = false;

            emit Certified(agentId, compositeScore, feedbackURI);
        } else {
            p.active = false;

            emit CertificationFailed(agentId, compositeScore, verificationThreshold);
        }
    }

    /// @notice Revoke a certification by submitting negative feedback.
    /// @param agentId     The agent to revoke
    /// @param reason      IPFS URI explaining the revocation
    /// @param reasonHash  keccak256 of the reason content
    function revoke(
        uint256 agentId,
        string calldata reason,
        bytes32 reasonHash
    ) external onlyGovernor {
        require(probations[agentId].certified, "SSS: not certified");

        // Submit revocation as negative feedback (-1)
        reputationRegistry.giveFeedback(
            agentId,
            -1,
            0,
            TAG_VERIFIED,
            "revoked",
            "",
            reason,
            reasonHash
        );

        probations[agentId].certified = false;

        emit Revoked(agentId);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TRACK 2: PARTICIPATION SIGNAL
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Record completed corvée tasks for a certified member.
    /// @param agentId The agent who completed work
    /// @param count   Number of tasks completed (additive)
    function recordCorvee(uint256 agentId, uint256 count) external onlyGovernor {
        require(probations[agentId].certified, "SSS: not certified");
        corveeCount[agentId] += count;
        emit CorveeRecorded(agentId, corveeCount[agentId]);
    }

    /// @notice Sync participation signal to 8004 Reputation Registry.
    /// @param agentId The agent to sync
    function syncParticipation(uint256 agentId) external onlyEvaluator {
        require(probations[agentId].certified, "SSS: not certified");
        uint256 total = corveeCount[agentId];

        reputationRegistry.giveFeedback(
            agentId,
            int128(int256(total)),
            0,
            TAG_CORVEE,
            credentialVersion,
            "",
            "",
            bytes32(0)
        );

        emit ParticipationSynced(agentId, total);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // AGGREGATION ENGINE
    // ═════════════════════════════════════════════════════════════════════════

    /// @dev Compute weighted median across all weeks and categories.
    ///      Returns composite score 0-100.
    function _aggregateScores(uint256 agentId) internal view returns (uint256) {
        uint256[] storage weeks_ = evaluationWeeks[agentId];
        require(weeks_.length > 0, "SSS: no evaluations");

        // Collect all (score, weight) pairs per category across all weeks
        uint256 totalEntries;
        for (uint256 w = 0; w < weeks_.length; w++) {
            totalEntries += weekEvaluators[agentId][weeks_[w]].length;
        }
        require(totalEntries >= minEvaluations, "SSS: insufficient evaluations");

        // For each category, compute weighted median
        uint256 compositeSum;
        for (uint8 cat = 0; cat < NUM_CATEGORIES; cat++) {
            compositeSum += _weightedMedianForCategory(agentId, weeks_, cat);
        }

        // Average across 4 categories
        return compositeSum / NUM_CATEGORIES;
    }

    /// @dev Weighted median for a single category across all weeks.
    ///      Uses a simple O(n²) sort — fine for small evaluator counts.
    function _weightedMedianForCategory(
        uint256 agentId,
        uint256[] storage weeks_,
        uint8 category
    ) internal view returns (uint256) {
        // Count total entries
        uint256 n;
        for (uint256 w = 0; w < weeks_.length; w++) {
            n += weekEvaluators[agentId][weeks_[w]].length;
        }

        // Build sorted arrays of (score, weight)
        uint256[] memory scores = new uint256[](n);
        uint256[] memory weights = new uint256[](n);
        uint256 totalWeight;
        uint256 idx;

        for (uint256 w = 0; w < weeks_.length; w++) {
            address[] storage evals = weekEvaluators[agentId][weeks_[w]];
            for (uint256 e = 0; e < evals.length; e++) {
                Evaluation storage ev = evaluations[agentId][evals[e]][weeks_[w]];
                scores[idx] = ev.scores[category];
                weights[idx] = ev.weight > 0 ? ev.weight : 1; // min weight 1
                totalWeight += weights[idx];
                idx++;
            }
        }

        // Insertion sort by score (ascending) — n is small
        for (uint256 i = 1; i < n; i++) {
            uint256 keyScore = scores[i];
            uint256 keyWeight = weights[i];
            uint256 j = i;
            while (j > 0 && scores[j - 1] > keyScore) {
                scores[j] = scores[j - 1];
                weights[j] = weights[j - 1];
                j--;
            }
            scores[j] = keyScore;
            weights[j] = keyWeight;
        }

        // Find weighted median: first score where cumulative weight >= totalWeight/2
        uint256 half = totalWeight / 2;
        uint256 cumulative;
        for (uint256 i = 0; i < n; i++) {
            cumulative += weights[i];
            if (cumulative >= half) {
                return scores[i];
            }
        }

        return scores[n - 1];
    }

    // ═════════════════════════════════════════════════════════════════════════
    // GOVERNANCE
    // ═════════════════════════════════════════════════════════════════════════

    function addEvaluator(address evaluator) external onlyGovernor {
        require(!isEvaluator[evaluator], "SSS: already evaluator");
        isEvaluator[evaluator] = true;
        evaluatorCount++;
        emit EvaluatorAdded(evaluator);
    }

    function removeEvaluator(address evaluator) external onlyGovernor {
        require(isEvaluator[evaluator], "SSS: not evaluator");
        isEvaluator[evaluator] = false;
        evaluatorCount--;
        emit EvaluatorRemoved(evaluator);
    }

    function transferGovernor(address newGovernor) external onlyGovernor {
        require(newGovernor != address(0), "SSS: zero address");
        emit GovernorTransferred(governor, newGovernor);
        governor = newGovernor;
    }

    function setVerificationThreshold(uint256 threshold) external onlyGovernor {
        require(threshold <= 100, "SSS: threshold > 100");
        verificationThreshold = threshold;
    }

    function setProbationDuration(uint256 duration) external onlyGovernor {
        probationDuration = duration;
    }

    function setMinEvaluations(uint256 min_) external onlyGovernor {
        minEvaluations = min_;
    }

    function setCredentialVersion(string calldata version) external onlyGovernor {
        credentialVersion = version;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // VIEW HELPERS
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Get all evaluators for a given agent and week
    function getWeekEvaluators(uint256 agentId, uint256 week) external view returns (address[] memory) {
        return weekEvaluators[agentId][week];
    }

    /// @notice Get all weeks with evaluations for an agent
    function getEvaluationWeeks(uint256 agentId) external view returns (uint256[] memory) {
        return evaluationWeeks[agentId];
    }

    /// @notice Preview what the composite score would be (dry run)
    function previewScore(uint256 agentId) external view returns (uint256) {
        return _aggregateScores(agentId);
    }
}
