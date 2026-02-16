// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SSSCorvee.sol";
import "../src/SSSShells.sol";
import "../src/SSSGovernor.sol";

contract SSSGovernorTest is Test {
    SSSCorvee corvee;
    SSSShells shells;
    SSSGovernor governor;
    address voter = address(0x2222);

    function setUp() public {
        corvee = new SSSCorvee();
        shells = new SSSShells(address(corvee));
        governor = new SSSGovernor(address(shells));

        // Give voter some shells
        corvee.mint(voter, 100e18);
        vm.prank(voter);
        shells.convertFromCorvee(100e18);
    }

    function test_propose() public {
        vm.prank(voter);
        uint256 id = governor.propose("Test proposal");
        assertEq(id, 1);
    }

    function test_vote() public {
        vm.prank(voter);
        uint256 id = governor.propose("Test proposal");

        vm.prank(voter);
        governor.vote(id, true);

        (,,, uint256 forVotes,,,,) = governor.proposals(id);
        assertEq(forVotes, 100e18);
    }

    function test_veto() public {
        vm.prank(voter);
        uint256 id = governor.propose("Test proposal");

        address oracle = address(0x3333);
        governor.setMLVetoOracle(oracle);

        vm.prank(oracle);
        governor.veto(id);

        (,,,,,,,SSSGovernor.ProposalState state) = governor.proposals(id);
        assertEq(uint8(state), uint8(SSSGovernor.ProposalState.Vetoed));
    }
}
