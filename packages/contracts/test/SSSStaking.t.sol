// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken} from "./mocks/MockSuperToken.sol";
import {SSSStaking} from "../src/SSSStaking.sol";

contract SSSStakingTest is Test {
    MockSuperToken token;
    SSSStaking staking;
    address owner = address(this);
    address stakingPool = address(0x9001);
    address member = address(0x1111);

    function setUp() public {
        vm.warp(1_700_000_000); // realistic timestamp
        token = new MockSuperToken();
        staking = new SSSStaking(token, stakingPool, owner);
        token.mint(member, 1000e18);
    }

    function testStake() public {
        vm.startPrank(member);
        token.approve(address(staking), 100e18);
        staking.stake(100e18);
        vm.stopPrank();

        (uint256 amount, , , bool active) = staking.stakes(member);
        assertEq(amount, 100e18);
        assertTrue(active);
        // Tokens sent to staking pool
        assertEq(token.balanceOf(stakingPool), 100e18);
    }

    function testCannotStakeTwice() public {
        vm.startPrank(member);
        token.approve(address(staking), 200e18);
        staking.stake(100e18);
        vm.expectRevert("Already staked");
        staking.stake(100e18);
        vm.stopPrank();
    }

    function testCorveeConfirmation() public {
        _stakeAsMember(100e18);

        staking.confirmCorvee(member);
        (, uint256 days_, , ) = staking.stakes(member);
        assertEq(days_, 1);
    }

    function testCorveeCannotConfirmTwiceSameDay() public {
        _stakeAsMember(100e18);
        staking.confirmCorvee(member);
        vm.expectRevert("Already confirmed today");
        staking.confirmCorvee(member);
    }

    function testCorveeConsecutiveDays() public {
        _stakeAsMember(100e18);

        for (uint256 i = 0; i < 5; i++) {
            vm.warp(block.timestamp + 1 days);
            staking.confirmCorvee(member);
        }

        (, uint256 days_, , ) = staking.stakes(member);
        assertEq(days_, 5);
    }

    function testCorveeMissedDayResetsCounter() public {
        _stakeAsMember(100e18);

        vm.warp(block.timestamp + 1 days);
        staking.confirmCorvee(member);
        vm.warp(block.timestamp + 1 days);
        staking.confirmCorvee(member);

        (, uint256 days1, , ) = staking.stakes(member);
        assertEq(days1, 2);

        // Skip a day
        vm.warp(block.timestamp + 2 days);
        staking.confirmCorvee(member);

        (, uint256 days2, , ) = staking.stakes(member);
        assertEq(days2, 1); // Reset!
    }

    function testUnstakeAfter30Days() public {
        _stakeAsMember(100e18);

        // Fund the staking pool so it can transfer back
        token.mint(stakingPool, 100e18);
        vm.prank(stakingPool);
        token.approve(address(staking), 100e18);

        // Confirm 30 consecutive days
        for (uint256 i = 0; i < 30; i++) {
            vm.warp(block.timestamp + 1 days);
            staking.confirmCorvee(member);
        }

        vm.prank(member);
        staking.unstake();

        assertEq(token.balanceOf(member), 1000e18); // 900 + 100 returned
        (, , , bool active) = staking.stakes(member);
        assertFalse(active);
    }

    function testCannotUnstakeBefore30Days() public {
        _stakeAsMember(100e18);

        for (uint256 i = 0; i < 10; i++) {
            vm.warp(block.timestamp + 1 days);
            staking.confirmCorvee(member);
        }

        vm.prank(member);
        vm.expectRevert("Not enough corvee days");
        staking.unstake();
    }

    function testSlash() public {
        _stakeAsMember(100e18);

        staking.slash(member);

        (, , , bool active) = staking.stakes(member);
        assertFalse(active);
        // Tokens stay in staking pool
        assertEq(token.balanceOf(stakingPool), 100e18);
    }

    function testSlashOnlyOwner() public {
        _stakeAsMember(100e18);
        vm.prank(member);
        vm.expectRevert();
        staking.slash(member);
    }

    function _stakeAsMember(uint256 amount) internal {
        vm.startPrank(member);
        token.approve(address(staking), amount);
        staking.stake(amount);
        vm.stopPrank();
    }
}
