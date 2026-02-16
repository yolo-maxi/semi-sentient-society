// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "./mocks/MockSuperToken.sol";
import "../src/SSSCorvee.sol";

contract SSSCorveeTest is Test {
    MockSuperToken token;
    SSSCorvee corvee;
    address worker = address(0x1111);
    address treasury; // = this (owner)

    function setUp() public {
        token = new MockSuperToken();
        corvee = new SSSCorvee(address(token));
        treasury = address(this);
        token.mint(treasury, 1_000_000e18);
    }

    function test_payCorvee() public {
        token.approve(address(corvee), 100e18);
        corvee.payCorvee(worker, 100e18);
        assertEq(corvee.balanceOf(worker), 100e18);
        assertEq(corvee.totalLocked(), 100e18);
        assertEq(token.balanceOf(address(corvee)), 100e18);
    }

    function test_nonTransferable() public {
        token.approve(address(corvee), 100e18);
        corvee.payCorvee(worker, 100e18);

        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        corvee.transfer(address(0xBEEF), 50e18);
    }

    function test_burn() public {
        token.approve(address(corvee), 100e18);
        corvee.payCorvee(worker, 100e18);
        corvee.burn(worker, 40e18);
        assertEq(corvee.balanceOf(worker), 60e18);
    }

    function test_corveeHistoryTracked() public {
        token.approve(address(corvee), 200e18);
        corvee.payCorvee(worker, 100e18);
        corvee.payCorvee(worker, 100e18);
        assertEq(corvee.getCorveeHistoryLength(worker), 2);
    }
}
