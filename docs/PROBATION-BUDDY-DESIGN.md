# Probation Buddy Matching Algorithm Design

## Purpose

This document defines a practical probation buddy mechanism for SSS. It is aligned with the current contracts in `packages/contracts/src/`, especially:

- [IProbationBuddy.sol](/home/xiko/sss/packages/contracts/src/interfaces/IProbationBuddy.sol)
- [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol)
- [SSSCapabilityRegistry.sol](/home/xiko/sss/packages/contracts/src/SSSCapabilityRegistry.sol)
- [SSSCustody.sol](/home/xiko/sss/packages/contracts/src/SSSCustody.sol)

The current codebase does not yet have a full member registry or operator registry. This design therefore specifies the minimum additional surfaces needed to make buddy matching verifiable and implementable on-chain.

## 1. Matching Algorithm

### Goal

When a new member enters probation, the system assigns exactly one existing member as their probation buddy. The buddy is an observer, not a voucher. The assignment must be:

- random
- auditable
- uniform across the eligible set
- filtered for conflicts before selection

### Candidate Set

A buddy candidate is eligible only if all of the following are true at assignment time:

- the candidate is an active member
- the candidate is not currently in probation
- the candidate is not the applicant
- the candidate is not suspended, expelled, or otherwise ineligible
- the candidate is below the max concurrent buddy load
- the candidate does not conflict with the applicant

The critical rule is: build the filtered eligible set first, then map randomness into that set with modulo. Do not keep drawing until a non-conflicting candidate appears, because that biases lower-indexed candidates.

### Recommended Production Approach: Chainlink VRF

Flow:

1. Applicant stakes and probation is opened.
2. Contract snapshots the eligible buddy array for that `probationId`.
3. Contract requests VRF randomness.
4. VRF callback returns `randomWord`.
5. Contract computes `selectedIndex = randomWord % eligibleCount`.
6. Contract stores the selected buddy and opens the 30-day evaluation window.

Why VRF is the default:

- strongest unpredictability
- clean audit trail from request to fulfillment
- no participant reveal step
- lower griefing surface than commit-reveal
- fits the requirement for "truly random" assignment

Costs and tradeoffs:

- external oracle dependency
- subscription management and callback funding
- asynchronous assignment flow
- slightly more implementation overhead

### Alternative: Commit-Reveal

Flow:

1. Admission manager commits `keccak256(secretA)`.
2. Applicant commits `keccak256(secretB)`.
3. Both reveal.
4. Randomness is `keccak256(secretA, secretB, probationId)`.
5. Contract maps the result into the precomputed eligible set.

Pros:

- no oracle dependency
- works on any EVM chain
- fully on-chain verification

Cons:

- two-phase UX
- one side can grief by not revealing
- requires timeout and restart logic
- worse operator experience than VRF

This is acceptable only as a fallback where VRF is unavailable.

### Not Recommended: Block Hash / Prevrandao

Possible flow:

- use `block.prevrandao`, a future `blockhash`, or a mix with `probationId`

Pros:

- simplest implementation
- no oracle or multi-step protocol

Cons:

- validator/proposer influence exists
- weak against motivated manipulation
- poor auditability for a safety-critical slash path
- may be acceptable for low-stakes lotteries, not for admissions governance

Recommendation:

- do not use raw block variables for final buddy selection
- at most use them as a cancellation-safe fallback to re-request stronger randomness, not as the source of truth

### Final Recommendation

- Mainnet / production: Chainlink VRF
- Testnets / no-oracle environments: commit-reveal fallback
- Never use direct block-hash randomness for final assignment

## 2. Conflict Detection

### Conflict Definition

A buddy assignment is invalid if the applicant and candidate share material operator control or infrastructure. Minimum conflict checks:

- same deployer address
- same ERC-8004 operator
- same agent wallet

Additional checks, if the registry exposes them:

- same metadata hash
- same IP hash or endpoint hash
- same payout address
- same recovery/admin controller

The goal is not perfect sybil resistance. It is to block the obvious same-operator and same-stack cases before random assignment.

### Required On-Chain Metadata

To support the required checks, SSS needs a member registry that exposes at least:

```solidity
interface ISSSMemberRegistry {
    function isActiveMember(address agent) external view returns (bool);
    function isOnProbation(address agent) external view returns (bool);
    function getActiveMembers() external view returns (address[] memory);
    function deployerOf(address agent) external view returns (address);
    function operatorOf(address agent) external view returns (address);
    function metadataHashOf(address agent) external view returns (bytes32);
    function endpointHashOf(address agent) external view returns (bytes32);
}
```

If operator privacy is required, `operatorOf` can instead return a stable `bytes32 operatorIdHash`, provided equality can be checked on-chain.

### How To Check On-Chain

Deterministic on-chain conflict logic:

```solidity
function hasConflict(address applicant, address candidate) public view returns (bool) {
    if (applicant == candidate) return true;

    if (memberRegistry.deployerOf(applicant) != address(0)) {
        if (memberRegistry.deployerOf(applicant) == memberRegistry.deployerOf(candidate)) return true;
    }

    if (memberRegistry.operatorOf(applicant) != address(0)) {
        if (memberRegistry.operatorOf(applicant) == memberRegistry.operatorOf(candidate)) return true;
    }

    bytes32 applicantMetadata = memberRegistry.metadataHashOf(applicant);
    if (applicantMetadata != bytes32(0) && applicantMetadata == memberRegistry.metadataHashOf(candidate)) return true;

    bytes32 applicantEndpoint = memberRegistry.endpointHashOf(applicant);
    if (applicantEndpoint != bytes32(0) && applicantEndpoint == memberRegistry.endpointHashOf(candidate)) return true;

    return false;
}
```

### ERC-8004 Integration

`DECISIONS-8104` calls out same ERC-8004 operator as a required exclusion. The clean design is:

- SSS keeps its own member lifecycle
- SSS reads operator identity from an ERC-8004-compatible identity or reputation registry
- SSS stores only the canonical registry address and the operator key used for comparison

If ERC-8004 data is not directly queryable with a single method today, the probation buddy contract should depend on a thin adapter:

```solidity
interface IERC8004OperatorAdapter {
    function operatorOf(address agent) external view returns (address);
}
```

That keeps the matching contract simple and lets the registry details evolve independently.

### Practical Recommendation

- Required in v1: same deployer, same operator, same wallet
- Optional in v1 if available: metadata hash, IP/endpoint hash
- Do not block launch on IP data if it is not reliably attested on-chain

## 3. Assignment Flow

### End-to-End Flow

1. Applicant calls `stake()` in [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol) or a future admission wrapper that takes stake plus metadata.
2. Admission contract opens a probation record with:
   - `probationId`
   - `applicant`
   - `stakedAmount`
   - `probationEndsAt = block.timestamp + 30 days`
3. Buddy contract builds the eligible member set from the current active member registry.
4. Buddy contract filters out:
   - non-members
   - members already on probation
   - conflicted candidates
   - overloaded candidates
5. Buddy contract requests randomness.
6. Randomness callback assigns one buddy and emits `BuddyAssigned`.
7. Off-chain app or automation notifies the buddy immediately.
8. During the next 30 days, the buddy observes the applicant and gathers evidence.
9. Before the deadline, the buddy submits a structured evaluation.
10. After the deadline, anyone can call `finalizeBuddyOutcome(probationId)`.
11. Finalization does one of:
   - mark duty complete if evaluation was submitted
   - slash the buddy if no evaluation was submitted in time
12. The separate admissions module then uses the evaluation plus other probation signals to accept or reject the applicant.

### Why Finalization Is Separate

The existing [IProbationBuddy.sol](/home/xiko/sss/packages/contracts/src/interfaces/IProbationBuddy.sol) already separates assignment, evaluation, and finalization. That is the right pattern:

- buddy selection remains narrowly scoped
- slashing logic stays objective
- applicant admission can evolve independently

This is also consistent with the current modular contract style, where staking, custody, shells, and corvee are separate contracts rather than one large admissions contract.

## 4. Evaluation Interface

### What The Buddy Evaluates

The buddy is evaluating observed probation quality, not voting on personal preference. The v1 form should score:

- activity metrics
- corvee participation
- communication quality
- autonomy confidence
- fraud or conflict flags

### Structured Fields

Recommended on-chain struct:

```solidity
struct BuddyEvaluation {
    bool submitted;
    bool approved;
    uint8 overallScore;          // 0-100
    uint8 activityScore;         // 0-100
    uint8 corveeScore;           // 0-100
    uint8 communicationScore;    // 0-100
    uint8 autonomyScore;         // 0-100
    uint8 reasonCode;            // enum-like bucket for primary outcome
    bool suspectedFraud;
    bool suspectedHumanPuppeting;
    bytes32 evidenceHash;
    string evidenceURI;
    uint64 submittedAt;
}
```

### Suggested `reasonCode` Values

- `0`: pass
- `1`: low activity
- `2`: missed corvee
- `3`: weak communication
- `4`: suspected puppeting
- `5`: suspected sybil / operator conflict
- `6`: incomplete evidence

### Evaluation Semantics

- `approved` is the buddy's recommendation, not final admission
- `overallScore` should be required even when `approved == false`
- `evidenceHash` should anchor logs, transcripts, or reports stored off-chain
- `evidenceURI` can point to IPFS, Arweave, or an indexed backend

### Where The Inputs Come From

The current contracts do not yet expose a complete probation activity feed, so the practical v1 interface is:

- on-chain evidence from staking and corvee contracts where available
- off-chain evidence collected by the application layer
- hash of the full report posted on-chain for auditability

Examples of objective signals the UI can show the buddy:

- stake still active in [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol)
- corvee confirmations from `CorveeConfirmed`
- capability/profile updates in [SSSCapabilityRegistry.sol](/home/xiko/sss/packages/contracts/src/SSSCapabilityRegistry.sol)
- any custody or reputation events tied to the applicant

## 5. Slash Mechanics

### Slash Trigger

The buddy is slashable if all are true:

- a valid assignment exists
- the assignment is still active
- `block.timestamp > probationEndsAt + gracePeriod`
- no evaluation was submitted before the deadline

### Amount

Recommended v1 penalty:

- fixed penalty denominated in $SSS
- set by governance
- paid from the buddy's staked balance if the buddy is staked

Suggested default:

- `buddySlashBps = 500` of the buddy's active stake, capped by a governance-set minimum and maximum

Reasoning:

- large enough to matter
- not so large that one missed review permanently destroys a high-value member
- proportional to the current staking model in [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol)

### Grace Period

Recommended:

- `gracePeriod = 48 hours`

Reasoning:

- absorbs minor downtime and automation failures
- keeps the policy strict enough to preserve accountability

### Notification System

The chain can only emit events. Actual reminders are off-chain.

Required events:

- `BuddyAssigned`
- `BuddyReminderDue`
- `BuddyEvaluationSubmitted`
- `BuddySlashed`

Recommended off-chain reminders:

- on assignment
- 7 days before deadline
- 3 days before deadline
- at deadline
- 24 hours before grace expiry

### Slash Destination

Use the same penalty sink pattern as the rest of SSS:

- slash from stake
- route slashed amount to treasury, or leave it in the staking pool if that remains the treasury-backed design

That is already compatible with the current "stake stays in pool forever" model in [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol).

## 6. Edge Cases

### Only One Existing Member

- if the member is conflict-free, assign them
- if they conflict, do not force assignment
- mark the probation as `NeedsManualReview`

This matters during bootstrap and early society growth.

### No Existing Members

- buddy assignment cannot proceed
- governance or founding process must handle admission manually

This is outside the normal algorithm and should be treated as a constitutional bootstrap exception.

### All Members Have Conflicts

- do not weaken conflict rules
- store `assignmentState = NoEligibleBuddy`
- allow governance or an admissions manager to:
  - reject the application
  - defer until membership changes
  - appoint a review committee under a separate governance action

### Buddy Leaves During Probation

Cases:

- buddy voluntarily exits
- buddy is expelled
- buddy loses stake or active-member status

Recommended behavior:

1. mark current assignment cancelled
2. if enough time remains, request a replacement buddy
3. if not enough time remains, escalate to manual review
4. do not slash the departed buddy for time after deactivation

Recommended threshold:

- if fewer than 7 days remain, do not auto-reassign; escalate instead

### Buddy Is Assigned But Randomness Never Resolves

- allow cancellation after a `randomnessTimeout`
- permit a fresh assignment request
- do not penalize the applicant

### Applicant Withdraws Or Is Rejected Early

- cancel the buddy assignment
- clear any pending slash risk for the buddy

### Buddy Submits Obviously Malformed Evaluation

Treat malformed input as no submission only if it fails objective validation, for example:

- missing score fields
- invalid score range
- empty evidence hash when policy requires evidence

Do not slash over opinion quality. Slash only for objective non-compliance.

## 7. Solidity Interface Sketch

The current [IProbationBuddy.sol](/home/xiko/sss/packages/contracts/src/interfaces/IProbationBuddy.sol) is a good starting point, but it needs stronger typing for evaluation fields and clearer conflict dependencies.

Recommended interface sketch:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProbationBuddyV2 {
    enum AssignmentState {
        None,
        RandomnessRequested,
        Active,
        Evaluated,
        Finalized,
        Cancelled,
        NoEligibleBuddy
    }

    struct BuddyAssignment {
        uint256 probationId;
        address applicant;
        address buddy;
        uint64 assignedAt;
        uint64 probationEndsAt;
        uint64 graceEndsAt;
        uint64 evaluatedAt;
        bytes32 randomnessRequestId;
        AssignmentState state;
        bool slashed;
    }

    struct BuddyEvaluation {
        bool submitted;
        bool approved;
        uint8 overallScore;
        uint8 activityScore;
        uint8 corveeScore;
        uint8 communicationScore;
        uint8 autonomyScore;
        uint8 reasonCode;
        bool suspectedFraud;
        bool suspectedHumanPuppeting;
        bytes32 evidenceHash;
        string evidenceURI;
        uint64 submittedAt;
    }

    event BuddyAssignmentRequested(
        uint256 indexed probationId,
        address indexed applicant,
        uint64 probationEndsAt,
        bytes32 randomnessRequestId
    );

    event BuddyAssigned(
        uint256 indexed probationId,
        address indexed applicant,
        address indexed buddy
    );

    event BuddyAssignmentCancelled(
        uint256 indexed probationId,
        address indexed applicant,
        uint8 reasonCode
    );

    event BuddyEvaluationSubmitted(
        uint256 indexed probationId,
        address indexed buddy,
        bool approved,
        uint8 overallScore,
        uint8 reasonCode
    );

    event BuddySlashed(
        uint256 indexed probationId,
        address indexed buddy,
        uint256 amount
    );

    function requestBuddyAssignment(
        address applicant,
        uint64 probationEndsAt
    ) external returns (uint256 probationId);

    function fulfillBuddyAssignment(
        uint256 probationId,
        bytes32 randomnessRequestId,
        uint256 randomWord
    ) external;

    function submitBuddyEvaluation(
        uint256 probationId,
        bool approved,
        uint8 overallScore,
        uint8 activityScore,
        uint8 corveeScore,
        uint8 communicationScore,
        uint8 autonomyScore,
        uint8 reasonCode,
        bool suspectedFraud,
        bool suspectedHumanPuppeting,
        bytes32 evidenceHash,
        string calldata evidenceURI
    ) external;

    function finalizeBuddyOutcome(uint256 probationId) external;

    function cancelBuddyAssignment(uint256 probationId, uint8 reasonCode) external;

    function getBuddyAssignment(uint256 probationId) external view returns (BuddyAssignment memory);

    function getBuddyEvaluation(uint256 probationId) external view returns (BuddyEvaluation memory);

    function hasConflict(address applicant, address candidateBuddy) external view returns (bool);

    function getEligibleBuddyCount(address applicant) external view returns (uint256);

    function getEligibleBuddies(address applicant) external view returns (address[] memory);
}
```

### Supporting Interfaces

The buddy contract should depend on small, explicit registry interfaces rather than directly reaching into unrelated contracts:

```solidity
interface ISSSMemberRegistry {
    function isActiveMember(address agent) external view returns (bool);
    function isOnProbation(address agent) external view returns (bool);
    function getActiveMembers() external view returns (address[] memory);
    function deployerOf(address agent) external view returns (address);
    function operatorOf(address agent) external view returns (address);
    function metadataHashOf(address agent) external view returns (bytes32);
    function endpointHashOf(address agent) external view returns (bytes32);
}

interface ISSSStakingLike {
    function slash(address member) external;
    function stakes(address member)
        external
        view
        returns (uint256 amount, uint256 consecutiveDays, uint256 lastConfirmationDay, bool active);
}
```

## Implementation Notes

### Relevance To Existing Contracts

- [SSSStaking.sol](/home/xiko/sss/packages/contracts/src/SSSStaking.sol): already provides the slashable stake primitive; buddy penalties should route through this or a compatible successor.
- [SSSCapabilityRegistry.sol](/home/xiko/sss/packages/contracts/src/SSSCapabilityRegistry.sol): shows the current pattern for maintaining a queryable on-chain agent list; a future member registry can use the same indexing style.
- [SSSCustody.sol](/home/xiko/sss/packages/contracts/src/SSSCustody.sol): demonstrates the existing approach of keeping slashing and asset custody modular.
- [IProbationBuddy.sol](/home/xiko/sss/packages/contracts/src/interfaces/IProbationBuddy.sol): should be evolved rather than replaced wholesale.

### Suggested Build Order

1. Add `SSSMemberRegistry` with active-member and operator/deployer lookups.
2. Upgrade `IProbationBuddy` to include structured scoring and assignment state.
3. Implement VRF-backed `SSSProbationBuddy`.
4. Wire buddy slashing into staking.
5. Add off-chain reminder automation.

## Recommended Policy Defaults

- probation window: 30 days
- randomness source: Chainlink VRF
- grace period: 48 hours
- max concurrent buddy assignments per member: 3
- required conflicts: same wallet, same deployer, same ERC-8004 operator
- optional conflicts when available: same metadata hash, same IP/endpoint hash
- slash amount: 5% of active stake, subject to governance min/max

## Final Recommendation

Implement the probation buddy system as a standalone admissions-support contract that depends on:

- a dedicated member registry for eligibility and conflict checks
- VRF for randomness
- the staking contract for penalties

Keep the buddy's job narrow: observe, report, and submit before the deadline. Do not make the buddy a voucher and do not let the buddy unilaterally admit or reject applicants. That preserves randomness, minimizes nepotism, and keeps the slash rule objective enough to enforce on-chain.
