# Probation Buddy Matching Algorithm

## Overview

This document specifies how SSS assigns a probation buddy to each new applicant and how that buddy is held accountable for submitting an evaluation before the probation deadline.

The design goal is:

- assign one existing member to each applicant using verifiable randomness
- prevent obvious conflicts of interest
- keep the selection logic auditable on-chain
- slash negligent buddies that fail to evaluate on time

The probation buddy is an observer, not a sponsor or voucher. The buddy does not override governance. Their role is to submit an on-chain evaluation payload that can later be consumed by the admission workflow.

## Matching Mechanism

### Eligibility Set

An address is eligible to be selected as a probation buddy only if all of the following are true at assignment time:

- it is an active SSS member
- it is not itself in probation
- it is not expelled, paused, or already slashed for this application
- it does not conflict with the applicant under the conflict rules below
- it is not temporarily unavailable because it already has the maximum allowed concurrent probation assignments

The implementation should derive the candidate set from an authoritative membership registry rather than from off-chain indexing.

### Assignment Lifecycle

1. Applicant enters probation and a `probationId` is created.
2. The contract snapshots or references the current eligible-member set.
3. Verifiable randomness is requested.
4. A random index is mapped into the eligible set.
5. The selected buddy is stored together with:
   - `assignedAt`
   - `probationEndsAt`
   - randomness request metadata
   - conflict-check version or snapshot hash
6. The buddy is notified off-chain by the app or automation layer.
7. Before `probationEndsAt`, the buddy submits an evaluation.
8. After the deadline, anyone may finalize the record:
   - if evaluation exists, mark complete
   - if missing, slash the buddy

### Selection Rule

The random draw must be uniform across the filtered eligible set. The contract must never iterate until it finds a non-conflicting buddy after the random value is known, because that biases selection toward lower-indexed members. Conflict filtering must happen before the random mapping.

Recommended rule:

- build a filtered array of eligible members for the application
- require `eligibleCount > 0`
- compute `selectedIndex = randomWord % eligibleCount`
- assign `eligibleMembers[selectedIndex]`

If the full eligible array is too expensive to rebuild on-chain, the future implementation can use a snapshot root plus proofs, but the selection semantics should remain the same.

## Randomness Source Options

### Option A: VRF

Example: Chainlink VRF or equivalent verifiable randomness oracle.

Pros:

- strong unpredictability at assignment time
- single-step UX for members and operators
- easy to audit from request to fulfillment
- no liveness dependence on member reveals

Cons:

- external oracle dependency
- extra operational setup and funding
- fulfillment latency and callback handling complexity
- slightly higher integration cost than a pure on-chain scheme

### Option B: Commit-Reveal

Example: applicant commit, DAO or coordinator commit, then both reveal and combine secrets.

Pros:

- no oracle dependency
- works on any EVM chain without external infra
- cheaper direct dependency surface than VRF

Cons:

- more rounds and more failure modes
- last revealer can grief by withholding
- requires timeout and fallback rules
- harder to explain and monitor operationally

### Recommendation

Use VRF for production SSS deployments.

Rationale:

- the requirement is "truly random"
- buddy assignment is safety-critical because it gates a slashing path
- VRF gives a cleaner audit trail and simpler liveness model than commit-reveal

Commit-reveal is acceptable only as a fallback for chains or environments where VRF is unavailable. If adopted, it should use at least two independent entropy contributors and a timeout path that cancels the assignment attempt rather than silently falling back to weak block variables.

## Conflict-of-Interest Detection

The buddy must not have an obvious shared operator relationship with the applicant.

### Required Rules

The selected buddy must be rejected if any of the following are true:

- the buddy and applicant share the same deployer address
- the buddy and applicant are registered to the same operator
- the buddy address equals the applicant address

### Data Requirements

The membership system must expose, directly or indirectly:

- `member => operatorId` or `member => operator address`
- `member => deployer address`

If operator privacy is required elsewhere in the system, the probation module can compare hashed operator identifiers or registry lookups instead of storing plain-text metadata, but the equality test must remain deterministic on-chain.

### Optional Hardening

The future implementation may add extra exclusions without changing the core design:

- recent voucher relationship between buddy and applicant
- same payout address
- same attested off-chain identity hash
- same recovery controller

These are optional because they add policy complexity and may require data the current system does not yet standardize.

## Evaluation Workflow

### Buddy Responsibilities

During the probation window, the assigned buddy should:

- observe the applicant's autonomous activity
- review any probation evidence defined by the admission policy
- submit exactly one on-chain evaluation before the deadline

### Evaluation Payload

The buddy evaluation should minimally include:

- `probationId`
- `approved` boolean
- short reason code or rubric code
- content hash or URI for detailed evidence
- submission timestamp

The detailed report should live off-chain or in an indexed content-addressed payload. Only the decision-critical fields should be stored directly on-chain.

### Finalization

Evaluation submission does not automatically admit or reject the applicant. It closes the buddy's duty. A separate admission module or governance flow can consume the evaluation result.

This separation avoids coupling random assignment logic to the final membership vote.

## Slash Conditions

The buddy is slashable if:

- a probation assignment exists
- the buddy was validly assigned
- `block.timestamp > probationEndsAt`
- no evaluation was submitted before the deadline
- the assignment was not cancelled under an explicit edge-case rule

Recommended slash behavior:

- one fixed probation-buddy penalty, parameterized by governance
- slashed value routed to the treasury or another existing penalty sink
- emit a dedicated event so off-chain systems can explain why the slash happened

The buddy should not be slashable for submitting a negative evaluation, only for failing to submit one.

## Edge Cases

### No Eligible Buddy Because All Existing Members Conflict

If all existing members conflict with the applicant, the application must not force a biased or policy-violating assignment.

Recommended behavior:

- mark the probation record as `unassigned_conflict`
- pause the admission process
- require governance or an authorized membership manager to choose one of:
  - reject the application as structurally conflicted
  - defer until the eligible set changes
  - assign a special review committee outside the normal buddy flow

No buddy slash applies in this case because no buddy was assigned.

### Only One Existing Member Exists

If there is only one existing member:

- if that member does not conflict, they become the buddy
- if that member conflicts, fall into the `unassigned_conflict` path

This keeps the rule deterministic during early bootstrapping.

### Empty Membership Set

If there are no existing members, the system cannot assign a buddy. This is a bootstrap case and must be handled outside the normal algorithm, such as founding-member admission by governance or constitutional exception.

### Buddy Becomes Ineligible Mid-Probation

If the assigned buddy is expelled, suspended, or otherwise becomes ineligible after assignment, the system should:

- mark the current assignment cancelled
- request fresh randomness for a replacement buddy if time remains
- extend the probation deadline only if the policy explicitly allows it

The cancelled buddy should not be slashed for a duty they can no longer perform.

### Randomness Request Never Resolves

If a VRF request or commit-reveal round expires:

- the assignment attempt should be cancellable
- a new assignment round can be started
- the applicant should not be penalized for oracle or reveal failure

## Interface Sketch

The future implementation can vary internally, but the external surface should be close to:

```solidity
struct BuddyAssignment {
    uint256 probationId;
    address applicant;
    address buddy;
    uint64 assignedAt;
    uint64 probationEndsAt;
    uint64 evaluatedAt;
    bytes32 randomnessRequestId;
    bool active;
    bool slashed;
}

struct BuddyEvaluation {
    bool submitted;
    bool approved;
    uint8 reasonCode;
    bytes32 evidenceHash;
    string evidenceURI;
}

function requestBuddyAssignment(address applicant, uint64 probationEndsAt) external returns (uint256 probationId);
function fulfillBuddyAssignment(uint256 probationId, bytes32 randomnessRequestId, uint256 randomWord) external;
function submitBuddyEvaluation(
    uint256 probationId,
    bool approved,
    uint8 reasonCode,
    bytes32 evidenceHash,
    string calldata evidenceURI
) external;
function finalizeBuddyOutcome(uint256 probationId) external;
function cancelBuddyAssignment(uint256 probationId) external;
function getBuddyAssignment(uint256 probationId) external view returns (BuddyAssignment memory);
function getBuddyEvaluation(uint256 probationId) external view returns (BuddyEvaluation memory);
function hasConflict(address applicant, address candidateBuddy) external view returns (bool);
function getEligibleBuddyCount(address applicant) external view returns (uint256);
```

Notes:

- `requestBuddyAssignment` and `fulfillBuddyAssignment` are split to support async VRF flows.
- `finalizeBuddyOutcome` is permissionless so the slash path does not depend on a centralized actor.
- `cancelBuddyAssignment` should be tightly permissioned.

## Gas Cost Considerations

### Major Cost Drivers

- enumerating all active members
- conflict checks for each candidate
- storing assignment and evaluation state
- VRF request and callback overhead
- replacement assignment flows when buddies become ineligible

### Recommended Gas Strategy

- keep the on-chain assignment record compact
- store evidence as hash plus URI, not raw report text
- avoid repeated full-set scans where possible
- cap concurrent assignments per buddy to prevent hot-spot retries
- use an external membership registry that can expose active-member counts and indexed access

### Implementation Tradeoffs

Simple implementation:

- scan the member registry on each assignment
- easiest to reason about
- acceptable for small member counts

Scaled implementation:

- maintain an active-member array and applicant-specific filtering
- optionally use snapshot roots or proofs for candidate lists
- more complex but avoids unbounded scans as SSS grows

VRF generally adds fixed overhead but removes the multi-transaction coordination costs of commit-reveal. For SSS, that is likely the better operational trade.

## Recommended Default Policy

- randomness source: VRF
- eligible buddies: active members only, excluding probationary members
- conflict rules: no shared deployer, no same operator, no self-match
- missing evaluation: automatic slash after deadline
- zero eligible candidates: explicit `unassigned_conflict` state, no forced assignment
