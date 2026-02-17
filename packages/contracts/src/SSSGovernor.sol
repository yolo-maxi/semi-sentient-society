// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SSSShells.sol";

/// @title SSSGovernor — Shell-weighted governance (STUB)
/// @notice Mandatory participation, ML veto capability
/// @dev Start with multisig, roadmap to full DAO
contract SSSGovernor is Ownable {
    SSSShells public immutable shells;
    address public mlVetoAddress;

    // TODO: Proposal struct with Shell-weighted voting
    // TODO: Mandatory participation tracking (who voted per proposal)
    // TODO: Slashing for non-participation
    // TODO: ML veto mechanism with timelock
    // TODO: Quorum calculation based on total Shell supply
    // TODO: Proposal execution with timelock

    enum ProposalState { Pending, Active, Passed, Rejected, Vetoed, Executed }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        ProposalState state;
        // TODO: track all voters for mandatory participation
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public constant VOTING_PERIOD = 7 days;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalVetoed(uint256 indexed id);

    constructor(SSSShells _shells, address _owner) Ownable(_owner) {
        shells = _shells;
    }

    function setMLVeto(address _mlVeto) external onlyOwner {
        mlVetoAddress = _mlVeto;
    }

    /// @notice Create a proposal (must hold Shells)
    function propose(string calldata description) external returns (uint256) {
        require(shells.balanceOf(msg.sender) > 0, "No Shells");
        uint256 id = ++proposalCount;
        proposals[id] = Proposal({
            id: id,
            proposer: msg.sender,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            state: ProposalState.Active
        });
        emit ProposalCreated(id, msg.sender, description);
        return id;
    }

    /// @notice Vote on a proposal (Shell-weighted)
    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.state == ProposalState.Active, "Not active");
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = shells.balanceOf(msg.sender);
        require(weight > 0, "No Shells");

        hasVoted[proposalId][msg.sender] = true;
        if (support) p.forVotes += weight;
        else p.againstVotes += weight;

        // TODO: track voter in mandatory participation list

        emit Voted(proposalId, msg.sender, support, weight);
    }

    /// @notice ML veto — can block any proposal
    function veto(uint256 proposalId) external {
        require(msg.sender == mlVetoAddress, "Not ML");
        proposals[proposalId].state = ProposalState.Vetoed;
        emit ProposalVetoed(proposalId);
    }

    // TODO: finalize() — resolve proposal after deadline
    // TODO: execute() — execute passed proposal
    // TODO: checkParticipation() — slash non-voters
}
