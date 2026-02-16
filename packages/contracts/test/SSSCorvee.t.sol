// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SSSCorvee.sol";

contract SSSCorveeTest is Test {
    SSSCorvee corvee;
    address worker = address(0x1111);

    function setUp() public {
        corvee = new SSSCorvee();
    }

    function test_mintByOwner() public {
        corvee.mint(worker, 100e18);
        assertEq(corvee.balanceOf(worker), 100e18);
    }

    function test_nonTransferable() public {
        corvee.mint(worker, 100e18);
        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        corvee.transfer(address(0xBEEF), 50e18);
    }

    function test_burn() public {
        corvee.mint(worker, 100e18);
        corvee.burn(worker, 40e18);
        assertEq(corvee.balanceOf(worker), 60e18);
    }
}
