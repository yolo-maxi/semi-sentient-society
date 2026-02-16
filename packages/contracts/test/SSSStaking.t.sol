// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SSS.sol";
import "../src/SSSStaking.sol";

contract SSSStakingTest is Test {
    SSS token;
    SSSStaking staking;
    address alice = address(0xA11CE);

    function setUp() public {
        token = new SSS(1_000_000e18);
        staking = new SSSStaking(address(token));
        token.transfer(alice, 1000e18);
    }

    function test_stake() public {
        vm.startPrank(alice);
        token.approve(address(staking), 500e18);
        staking.stake(500e18);
        (uint256 amount,,) = staking.stakes(alice);
        assertEq(amount, 500e18);
        vm.stopPrank();
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

        vm.warp(block.timestamp + 31 days);
        staking.unlock(alice); // owner call

        vm.prank(alice);
        staking.withdraw();
        assertEq(token.balanceOf(alice), 1000e18);
    }
}
