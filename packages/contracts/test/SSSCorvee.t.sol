// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken, MockSuperfluidPool} from "./mocks/MockSuperToken.sol";
import {SSSCorvee} from "../src/SSSCorvee.sol";
import {SSSShells} from "../src/SSSShells.sol";

contract SSSCorveeTest is Test {
    MockSuperToken token;
    MockSuperfluidPool pool;
    SSSCorvee corvee;
    SSSShells shells;
    address owner = address(this);
    address worker = address(0x1111);

    function setUp() public {
        token = new MockSuperToken();
        pool = new MockSuperfluidPool();

        // Deploy with placeholder shells, then set
        corvee = new SSSCorvee(token, address(0), owner);
        shells = new SSSShells(token, pool, address(corvee), owner);
        corvee.setShellsContract(address(shells));

        // Fund treasury (the corvee contract)
        token.mint(address(corvee), 1_000_000e18);
    }

    function testPayCorvee() public {
        corvee.payCorvee(worker, 100e18);

        assertEq(corvee.balanceOf(worker), 100e18);
        assertEq(corvee.totalLocked(), 100e18);
        assertEq(corvee.getBatchCount(worker), 1);
    }

    function testPayCorveeFailsInsufficientTreasury() public {
        // Try to pay more than treasury holds
        vm.expectRevert("Insufficient treasury");
        corvee.payCorvee(worker, 2_000_000e18);
    }

    function testPayCorveeOnlyOwner() public {
        vm.prank(worker);
        vm.expectRevert();
        corvee.payCorvee(worker, 100e18);
    }

    function testNonTransferable() public {
        corvee.payCorvee(worker, 100e18);

        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        corvee.transfer(address(0xBEEF), 50e18);
    }

    function testConvertToShells() public {
        corvee.payCorvee(worker, 100e18);

        vm.prank(worker);
        corvee.convertToShells(100e18);

        assertEq(corvee.balanceOf(worker), 0);
        assertEq(corvee.totalLocked(), 0); // Released back to treasury
        assertGt(shells.balanceOf(worker), 0); // Shells minted (1x at time 0)
    }

    function testConvertToShellsWithTimeBonus() public {
        corvee.payCorvee(worker, 100e18);

        // Warp 12 months
        vm.warp(block.timestamp + 365 days);

        vm.prank(worker);
        corvee.convertToShells(100e18);

        // With 12 months held, bonus = 1 + ln(1 + 12/6) = 1 + ln(3) ≈ 1 + 1.098 = 2.098
        uint256 shellBalance = shells.balanceOf(worker);
        assertGt(shellBalance, 200e18); // Should be > 2x
        assertLt(shellBalance, 220e18); // But < 2.2x
    }

    function testTimeBonusCappedAt3x() public {
        corvee.payCorvee(worker, 100e18);

        // Warp 5 years — way past cap
        vm.warp(block.timestamp + 1825 days);

        vm.prank(worker);
        corvee.convertToShells(100e18);

        uint256 shellBalance = shells.balanceOf(worker);
        assertEq(shellBalance, 300e18); // Capped at 3x
    }

    function testMultipleBatchesDifferentTimes() public {
        corvee.payCorvee(worker, 50e18);

        vm.warp(block.timestamp + 180 days); // 6 months
        corvee.payCorvee(worker, 50e18);

        // Convert all — first batch has 6mo bonus, second has 0
        vm.prank(worker);
        corvee.convertToShells(100e18);

        uint256 shellBalance = shells.balanceOf(worker);
        // First 50: 1 + ln(1 + 6/6) = 1 + ln(2) ≈ 1.693 → ~84.6
        // Second 50: 1 + ln(1 + 0/6) = 1 + 0 = 1 → 50
        // Total ≈ 134.6
        assertGt(shellBalance, 130e18);
        assertLt(shellBalance, 140e18);
    }
}
