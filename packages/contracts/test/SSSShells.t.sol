// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "./mocks/MockSuperToken.sol";
import "../src/SSSCorvee.sol";
import "../src/SSSShells.sol";

contract SSSShellsTest is Test {
    MockSuperToken token;
    SSSCorvee corvee;
    SSSShells shells;
    address worker = address(0x1111);

    function setUp() public {
        token = new MockSuperToken();
        corvee = new SSSCorvee(address(token));
        shells = new SSSShells(address(corvee));

        // Give worker some corvée credits
        token.mint(address(this), 1_000_000e18);
        token.approve(address(corvee), 100e18);
        corvee.payCorvee(worker, 100e18);
    }

    function test_convertFromCorvee() public {
        vm.prank(worker);
        shells.convertFromCorvee(100e18);

        assertEq(shells.balanceOf(worker), 100e18);
        assertEq(corvee.balanceOf(worker), 0);
    }

    function test_shellsNonTransferable() public {
        vm.prank(worker);
        shells.convertFromCorvee(100e18);

        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        shells.transfer(address(0xBEEF), 50e18);
    }

    function test_lockedSSS_stays_locked() public {
        vm.prank(worker);
        shells.convertFromCorvee(100e18);

        // Locked $SSS should still be in corvee contract
        assertEq(token.balanceOf(address(corvee)), 100e18);
    }
}
