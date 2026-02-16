// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SSSCorvee.sol";
import "../src/SSSShells.sol";

contract SSSShellsTest is Test {
    SSSCorvee corvee;
    SSSShells shells;
    address worker = address(0x1111);

    function setUp() public {
        corvee = new SSSCorvee();
        shells = new SSSShells(address(corvee));
    }

    function test_convertFromCorvee() public {
        corvee.mint(worker, 100e18);

        vm.prank(worker);
        shells.convertFromCorvee(100e18);

        assertEq(shells.balanceOf(worker), 100e18);
        assertEq(corvee.balanceOf(worker), 0);
    }

    function test_shellsNonTransferable() public {
        corvee.mint(worker, 100e18);
        vm.prank(worker);
        shells.convertFromCorvee(100e18);

        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        shells.transfer(address(0xBEEF), 50e18);
    }
}
