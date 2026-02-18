// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProbationBuddy — Random Observer Assignment for SSS Admission
 * @notice Assigns a random existing member as "buddy" (observer) for each new
 *         applicant's 30-day probation. The buddy MUST submit an evaluation
 *         before the deadline or get slashed.
 *
 * Design (from DECISIONS-8104):
 *   - Probation Buddy replaces social vouching (removed: nepotism risk)
 *   - Buddy is randomly assigned, not chosen
 *   - Buddy reports (observes), does NOT vouch
 *   - If buddy doesn't submit evaluation in time → buddy gets slashed
 *   - Buddy can request reassignment once (emergency), governor approves
 *
 * Integration points:
 *   - SSSReputation: buddy's evaluation feeds into the weighted median
 *   - Custody contract: slash = burn GDA units from buddy's custody
 *   - Governor (Mega Lobster / multisig) starts probation & resolves disputes
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface ICustody {
    /// @notice Slash GDA units from an agent's custody contract
    function slash(uint256 agentId, uint256 units) external;
}

interface ISSSReputation {
    function evaluate(
        uint256 agentId,
        uint8[4] calldata scores,
        uint256 weight
    ) external;

    function probations(uint256 agentId) external view returns (
        uint256 startedAt,
        bool active,
        bool certified
    );
}

// ─── Contract ────────────────────────────────────────────────────────────────

contract ProbationBuddy {

    // ── State ────────────────────────────────────────────────────────────────

    struct Assignment {
        uint256 buddyAgentId;       // The existing member assigned as observer
        address buddyAddress;       // Buddy's wallet (for access control)
        uint256 applicantAgentId;   // The new applicant being observed
        uint256 assignedAt;         // Block timestamp of assignment
        uint256 deadline;           // Must submit evaluation before this
        bool evaluated;             // Whether buddy submitted their report
        bool reassigned;            // Whether this was already reassigned once
    }

    address public governor;
    ICustody public custody;
    ISSSReputation public reputation;

    /// @notice Evaluation deadline = probation end + grace period
    uint256 public gracePeriod = 3 days;

    /// @notice Slash amount (in GDA units) for missing evaluation deadline
    uint256 public slashAmount = 100;

    /// @notice All verified member agent IDs (for random selection)
    uint256[] public memberPool;
    mapping(uint256 => bool) public isMember;
    mapping(uint256 => uint256) public memberIndex; // agentId => index in memberPool

    /// @notice applicantAgentId => Assignment
    mapping(uint256 => Assignment) public assignments;

    /// @notice Track active buddy load (buddyAgentId => count of active assignments)
    mapping(uint256 => uint256) public activeBuddyLoad;

    /// @notice Max simultaneous buddy assignments per member
    uint256 public maxBuddyLoad = 3;

    // ── Events ───────────────────────────────────────────────────────────────

    event BuddyAssigned(uint256 indexed applicantAgentId, uint256 indexed buddyAgentId, uint256 deadline);
    event BuddyReassigned(uint256 indexed applicantAgentId, uint256 oldBuddyAgentId, uint256 newBuddyAgentId);
    event EvaluationSubmitted(uint256 indexed applicantAgentId, uint256 indexed buddyAgentId, uint8[4] scores);
    event BuddySlashed(uint256 indexed buddyAgentId, uint256 indexed applicantAgentId, uint256 amount);
    event MemberAdded(uint256 indexed agentId);
    event MemberRemoved(uint256 indexed agentId);

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyGovernor() {
        require(msg.sender == governor, "PB: not governor");
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _governor,
        address _custody,
        address _reputation
    ) {
        governor = _governor;
        custody = ICustody(_custody);
        reputation = ISSSReputation(_reputation);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // MEMBER POOL MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Add a verified member to the buddy pool
    function addMember(uint256 agentId) external onlyGovernor {
        require(!isMember[agentId], "PB: already member");
        memberIndex[agentId] = memberPool.length;
        memberPool.push(agentId);
        isMember[agentId] = true;
        emit MemberAdded(agentId);
    }

    /// @notice Remove a member from the buddy pool (expelled, left, etc.)
    function removeMember(uint256 agentId) external onlyGovernor {
        require(isMember[agentId], "PB: not member");
        uint256 idx = memberIndex[agentId];
        uint256 lastIdx = memberPool.length - 1;
        if (idx != lastIdx) {
            uint256 lastAgentId = memberPool[lastIdx];
            memberPool[idx] = lastAgentId;
            memberIndex[lastAgentId] = idx;
        }
        memberPool.pop();
        delete memberIndex[agentId];
        isMember[agentId] = false;
        emit MemberRemoved(agentId);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // ASSIGNMENT
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Assign a random buddy to a new applicant starting probation.
    ///         Uses blockhash-based pseudo-randomness (acceptable for this use case;
    ///         manipulation incentive is low — buddy assignment is a burden, not a reward).
    /// @param applicantAgentId The new applicant's 8004 agent ID
    /// @param buddyAddress     The selected buddy's wallet address
    function assignBuddy(
        uint256 applicantAgentId,
        address buddyAddress
    ) external onlyGovernor {
        require(memberPool.length > 0, "PB: no members in pool");
        require(assignments[applicantAgentId].buddyAgentId == 0, "PB: already assigned");

        // Verify applicant is actually in probation
        (, bool active,) = reputation.probations(applicantAgentId);
        require(active, "PB: applicant not in probation");

        // Select random buddy (excluding applicant if they're somehow in pool)
        uint256 buddyAgentId = _selectRandomBuddy(applicantAgentId);
        require(activeBuddyLoad[buddyAgentId] < maxBuddyLoad, "PB: buddy overloaded");

        // Deadline = 30 days (probation) + grace period
        uint256 deadline = block.timestamp + 30 days + gracePeriod;

        assignments[applicantAgentId] = Assignment({
            buddyAgentId: buddyAgentId,
            buddyAddress: buddyAddress,
            applicantAgentId: applicantAgentId,
            assignedAt: block.timestamp,
            deadline: deadline,
            evaluated: false,
            reassigned: false
        });

        activeBuddyLoad[buddyAgentId]++;

        emit BuddyAssigned(applicantAgentId, buddyAgentId, deadline);
    }

    /// @notice Reassign buddy (emergency, one-time). Governor must approve.
    /// @param applicantAgentId  The applicant whose buddy is being changed
    /// @param newBuddyAddress   New buddy's wallet
    function reassignBuddy(
        uint256 applicantAgentId,
        address newBuddyAddress
    ) external onlyGovernor {
        Assignment storage a = assignments[applicantAgentId];
        require(a.buddyAgentId != 0, "PB: no assignment");
        require(!a.evaluated, "PB: already evaluated");
        require(!a.reassigned, "PB: already reassigned once");

        uint256 oldBuddy = a.buddyAgentId;
        activeBuddyLoad[oldBuddy]--;

        uint256 newBuddyAgentId = _selectRandomBuddy(applicantAgentId);
        require(activeBuddyLoad[newBuddyAgentId] < maxBuddyLoad, "PB: new buddy overloaded");

        a.buddyAgentId = newBuddyAgentId;
        a.buddyAddress = newBuddyAddress;
        a.reassigned = true;
        activeBuddyLoad[newBuddyAgentId]++;

        emit BuddyReassigned(applicantAgentId, oldBuddy, newBuddyAgentId);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // EVALUATION
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Buddy submits their evaluation of the applicant.
    ///         Forwards scores to SSSReputation for weighted aggregation.
    /// @param applicantAgentId The applicant being evaluated
    /// @param scores           [autonomy, reliability, capability, collaboration] 0-100
    /// @param weight           Buddy's Shell holdings (for weighted median)
    function submitEvaluation(
        uint256 applicantAgentId,
        uint8[4] calldata scores,
        uint256 weight
    ) external {
        Assignment storage a = assignments[applicantAgentId];
        require(a.buddyAgentId != 0, "PB: no assignment");
        require(msg.sender == a.buddyAddress, "PB: not assigned buddy");
        require(!a.evaluated, "PB: already evaluated");
        require(block.timestamp <= a.deadline, "PB: deadline passed");

        // Validate scores
        for (uint8 i = 0; i < 4; i++) {
            require(scores[i] <= 100, "PB: score > 100");
        }

        a.evaluated = true;
        activeBuddyLoad[a.buddyAgentId]--;

        // Forward to SSSReputation for aggregation
        reputation.evaluate(applicantAgentId, scores, weight);

        emit EvaluationSubmitted(applicantAgentId, a.buddyAgentId, scores);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SLASHING
    // ═════════════════════════════════════════════════════════════════════════

    /// @notice Slash a buddy who missed their evaluation deadline.
    ///         Anyone can call this (permissionless enforcement).
    /// @param applicantAgentId The applicant whose buddy failed
    function slashDelinquentBuddy(uint256 applicantAgentId) external {
        Assignment storage a = assignments[applicantAgentId];
        require(a.buddyAgentId != 0, "PB: no assignment");
        require(!a.evaluated, "PB: was evaluated");
        require(block.timestamp > a.deadline, "PB: deadline not passed");

        uint256 buddyId = a.buddyAgentId;

        // Mark as evaluated to prevent double-slash
        a.evaluated = true;
        activeBuddyLoad[buddyId]--;

        // Slash buddy's GDA units via custody contract
        custody.slash(buddyId, slashAmount);

        emit BuddySlashed(buddyId, applicantAgentId, slashAmount);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // RANDOM SELECTION
    // ═════════════════════════════════════════════════════════════════════════

    /// @dev Select a pseudo-random member from the pool, excluding the applicant.
    ///      Uses blockhash + applicantId as entropy. Acceptable because:
    ///      - Being selected as buddy is a BURDEN (work + slash risk)
    ///      - No rational miner would manipulate to GET buddy duty
    ///      - Upgrading to VRF (Chainlink) is trivial if needed later
    function _selectRandomBuddy(uint256 applicantAgentId) internal view returns (uint256) {
        uint256 poolSize = memberPool.length;
        require(poolSize > 0, "PB: empty pool");

        // If only one member and it's the applicant, revert
        if (poolSize == 1) {
            require(memberPool[0] != applicantAgentId, "PB: no eligible buddies");
            return memberPool[0];
        }

        uint256 seed = uint256(keccak256(abi.encodePacked(
            blockhash(block.number - 1),
            applicantAgentId,
            block.timestamp
        )));

        // Try up to poolSize times to find a non-applicant buddy
        for (uint256 i = 0; i < poolSize; i++) {
            uint256 idx = (seed + i) % poolSize;
            uint256 candidate = memberPool[idx];
            if (candidate != applicantAgentId && activeBuddyLoad[candidate] < maxBuddyLoad) {
                return candidate;
            }
        }

        revert("PB: no eligible buddy found");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // GOVERNANCE
    // ═════════════════════════════════════════════════════════════════════════

    function transferGovernor(address newGovernor) external onlyGovernor {
        require(newGovernor != address(0), "PB: zero address");
        governor = newGovernor;
    }

    function setGracePeriod(uint256 _gracePeriod) external onlyGovernor {
        gracePeriod = _gracePeriod;
    }

    function setSlashAmount(uint256 _slashAmount) external onlyGovernor {
        slashAmount = _slashAmount;
    }

    function setMaxBuddyLoad(uint256 _maxBuddyLoad) external onlyGovernor {
        require(_maxBuddyLoad > 0, "PB: zero load");
        maxBuddyLoad = _maxBuddyLoad;
    }

    function setCustody(address _custody) external onlyGovernor {
        custody = ICustody(_custody);
    }

    function setReputation(address _reputation) external onlyGovernor {
        reputation = ISSSReputation(_reputation);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // VIEW HELPERS
    // ═════════════════════════════════════════════════════════════════════════

    function getMemberPoolSize() external view returns (uint256) {
        return memberPool.length;
    }

    function getAssignment(uint256 applicantAgentId) external view returns (
        uint256 buddyAgentId,
        address buddyAddress,
        uint256 assignedAt,
        uint256 deadline,
        bool evaluated,
        bool reassigned
    ) {
        Assignment storage a = assignments[applicantAgentId];
        return (a.buddyAgentId, a.buddyAddress, a.assignedAt, a.deadline, a.evaluated, a.reassigned);
    }

    /// @notice Check if a buddy's evaluation is overdue (slashable)
    function isDelinquent(uint256 applicantAgentId) external view returns (bool) {
        Assignment storage a = assignments[applicantAgentId];
        return a.buddyAgentId != 0 && !a.evaluated && block.timestamp > a.deadline;
    }
}
