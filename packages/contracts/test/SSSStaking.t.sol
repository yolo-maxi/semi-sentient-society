// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "./mocks/MockSuperToken.sol";
import "../src/SSSStaking.sol";

contract SSSStakingTest is Test {
    MockSuperToken token;
    MockStremeStaking stremePool;
    SSSStaking staking;
    address alice = address(0xA11CE);

    function setUp() public {
        token = new MockSuperToken();
        stremePool = new MockStremeStaking();
        staking = new SSSStaking(address(token), address(stremePool));
        token.mint(alice, 1000e18);
    }

    function test_stake() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        (uint256 amount,,,,) = staking.stakes(alice);
        assertEq(amount, 500e18);
        vm.stopPrank();

        // Verify deposited into streme pool
        assertEq(stremePool.stakedBalance(address(staking)), 500e18);
    }

    function test_corveeConfirmation() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        vm.stopPrank();

        // Confirm corvée for 30 days
        for (uint256 i = 0; i < 30; i++) {
            staking.confirmCorvee(alice);
            vm.warp(block.timestamp + 1 days);
        }

        (,,,, bool unlocked) = staking.stakes(alice);
        assertTrue(unlocked);
    }

    function test_cannotWithdrawBeforeUnlock() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        vm.stopPrank();

        vm.prank(alice);
        vm.expectRevert("Not unlocked");
        staking.withdraw();
    }

    function test_unlockAndWithdraw() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        vm.stopPrank();

        for (uint256 i = 0; i < 30; i++) {
            staking.confirmCorvee(alice);
            vm.warp(block.timestamp + 1 days);
        }

        vm.prank(alice);
        staking.withdraw();
        assertEq(token.balanceOf(alice), 1000e18);
    }

    function test_slash() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        vm.stopPrank();

        staking.slash(alice);
        (uint256 amount,,,,) = staking.stakes(alice);
        assertEq(amount, 0);
        // Stake remains in streme pool
        assertEq(stremePool.stakedBalance(address(staking)), 500e18);
    }
}
