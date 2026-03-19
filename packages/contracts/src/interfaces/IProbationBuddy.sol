// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IProbationBuddy
/// @notice Interface sketch for SSS probation buddy assignment and evaluation.
interface IProbationBuddy {
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

    event BuddyAssignmentRequested(uint256 indexed probationId, address indexed applicant, uint64 probationEndsAt);
    event BuddyAssigned(uint256 indexed probationId, address indexed applicant, address indexed buddy, bytes32 randomnessRequestId);
    event BuddyEvaluationSubmitted(uint256 indexed probationId, address indexed buddy, bool approved, uint8 reasonCode);
    event BuddySlashed(uint256 indexed probationId, address indexed buddy);
    event BuddyAssignmentCancelled(uint256 indexed probationId);

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
}
