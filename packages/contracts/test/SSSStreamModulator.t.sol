// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken, MockSuperfluidPool} from "./mocks/MockSuperToken.sol";
import {SSSStreamModulator} from "../src/SSSStreamModulator.sol";

contract SSSStreamModulatorTest is Test {
    MockSuperToken token;
    MockSuperfluidPool pool;
    SSSStreamModulator modulator;
    address owner = address(this);

    function setUp() public {
        token = new MockSuperToken();
        pool = new MockSuperfluidPool();
        modulator = new SSSStreamModulator(token, pool, owner);

        // Add a member so pool has units
        pool.updateMemberUnits(address(0x1111), 100);
    }

    function testModulate() public {
        // Deposit revenue
        token.mint(address(modulator), 604800e18); // exactly 7 days worth

        modulator.modulate();

        // Flow rate = 604800e18 / 604800 = 1e18 per second
        assertEq(token.lastFlowRate(), int96(int256(1e18)));
        assertEq(modulator.lastModulation(), block.timestamp);
    }

    function testModulateNoBalance() public {
        vm.expectRevert("No balance");
        modulator.modulate();
    }

    function testModulateNoMembers() public {
        // Remove all units
        pool.updateMemberUnits(address(0x1111), 0);
        token.mint(address(modulator), 100e18);

        vm.expectRevert("No pool members");
        modulator.modulate();
    }

    function testModulateFlowRateCalculation() public {
        uint256 revenue = 1_000_000e18;
        token.mint(address(modulator), revenue);

        modulator.modulate();

        int96 expectedRate = int96(int256(revenue / 7 days));
        assertEq(token.lastFlowRate(), expectedRate);
    }

    function testAnyoneCanModulate() public {
        token.mint(address(modulator), 100e18);

        vm.prank(address(0xBEEF));
        modulator.modulate();

        assertGt(token.lastFlowRate(), 0);
    }

    function testRemodulateWithNewRevenue() public {
        token.mint(address(modulator), 100e18);
        modulator.modulate();
        int96 rate1 = token.lastFlowRate();

        // More revenue arrives
        token.mint(address(modulator), 200e18);
        vm.warp(block.timestamp + 1 days);
        modulator.modulate();
        int96 rate2 = token.lastFlowRate();

        // Rate should be different (higher balance)
        assertGt(rate2, rate1);
    }
}
