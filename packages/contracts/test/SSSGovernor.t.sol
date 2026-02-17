// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken, MockSuperfluidPool} from "./mocks/MockSuperToken.sol";
import {SSSCorvee} from "../src/SSSCorvee.sol";
import {SSSShells} from "../src/SSSShells.sol";
import {SSSGovernor} from "../src/SSSGovernor.sol";

contract SSSGovernorTest is Test {
    MockSuperToken token;
    MockSuperfluidPool pool;
    SSSCorvee corvee;
    SSSShells shells;
    SSSGovernor governor;
    address owner = address(this);
    address voter1 = address(0x1111);
    address voter2 = address(0x2222);
    address mlVeto = address(0xBE70);

    function setUp() public {
        token = new MockSuperToken();
        pool = new MockSuperfluidPool();
        corvee = new SSSCorvee(token, address(0), owner);
        shells = new SSSShells(token, pool, address(corvee), owner);
        corvee.setShellsContract(address(shells));
        governor = new SSSGovernor(shells, owner);
        governor.setMLVeto(mlVeto);

        // Give voters some shells via corvee flow
        token.mint(address(corvee), 1_000_000e18);
        corvee.payCorvee(voter1, 100e18);
        corvee.payCorvee(voter2, 200e18);
        vm.prank(voter1);
        corvee.convertToShells(100e18);
        vm.prank(voter2);
        corvee.convertToShells(200e18);
    }

    function testPropose() public {
        vm.prank(voter1);
        uint256 id = governor.propose("Test proposal");
        assertEq(id, 1);
    }

    function testVote() public {
        vm.prank(voter1);
        uint256 id = governor.propose("Test");

        vm.prank(voter1);
        governor.vote(id, true);

        vm.prank(voter2);
        governor.vote(id, false);

        (,,,uint256 forV, uint256 againstV,,) = governor.proposals(id);
        assertEq(forV, shells.balanceOf(voter1));
        assertEq(againstV, shells.balanceOf(voter2));
    }

    function testCannotVoteTwice() public {
        vm.prank(voter1);
        uint256 id = governor.propose("Test");

        vm.prank(voter1);
        governor.vote(id, true);

        vm.prank(voter1);
        vm.expectRevert("Already voted");
        governor.vote(id, true);
    }

    function testVeto() public {
        vm.prank(voter1);
        uint256 id = governor.propose("Test");

        vm.prank(mlVeto);
        governor.veto(id);

        (,,,,,,SSSGovernor.ProposalState state) = governor.proposals(id);
        assertEq(uint256(state), uint256(SSSGovernor.ProposalState.Vetoed));
    }

    function testOnlyMLCanVeto() public {
        vm.prank(voter1);
        uint256 id = governor.propose("Test");

        vm.prank(voter1);
        vm.expectRevert("Not ML");
        governor.veto(id);
    }
}
