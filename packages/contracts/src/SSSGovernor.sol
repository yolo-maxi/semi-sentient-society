// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SSSShells.sol";

/// @title SSSGovernor — Shell-weighted governance
/// @notice Mandatory participation, ML veto capability
/// @dev Stub — full implementation TBD
contract SSSGovernor is Ownable {
    SSSShells public immutable shells;
    address public mlVetoOracle; // address that can veto proposals

    enum ProposalState { Pending, Active, Passed, Rejected, Vetoed, Executed }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 createdAt;
        uint256 deadline;
        ProposalState state;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public constant VOTING_PERIOD = 7 days;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalVetoed(uint256 indexed id);

    constructor(address _shells) Ownable(msg.sender) {
        shells = SSSShells(_shells);
    }

    function setMLVetoOracle(address _oracle) external onlyOwner {
        mlVetoOracle = _oracle;
    }

    function propose(string calldata description) external returns (uint256) {
        require(shells.balanceOf(msg.sender) > 0, "No Shells");
        uint256 id = ++proposalCount;
        proposals[id] = Proposal({
            id: id,
            proposer: msg.sender,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            createdAt: block.timestamp,
            deadline: block.timestamp + VOTING_PERIOD,
            state: ProposalState.Active
        });
        emit ProposalCreated(id, msg.sender, description);
        return id;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.state == ProposalState.Active, "Not active");
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = shells.balanceOf(msg.sender);
        require(weight > 0, "No Shells");

        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function veto(uint256 proposalId) external {
        require(msg.sender == mlVetoOracle, "Not oracle");
        proposals[proposalId].state = ProposalState.Vetoed;
        emit ProposalVetoed(proposalId);
    }
}
