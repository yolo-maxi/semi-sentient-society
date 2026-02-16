// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "./mocks/MockSuperToken.sol";

/// @notice Basic tests for the mock Super Token (stands in for streme.fun-deployed $SSS)
contract SSSTokenTest is Test {
    MockSuperToken token;

    function setUp() public {
        token = new MockSuperToken();
        token.mint(address(this), 1_000_000e18);
    }

    function test_name() public view {
        assertEq(token.symbol(), "SSS");
    }

    function test_transfer() public {
        address bob = address(0xB0B);
        token.transfer(bob, 100e18);
        assertEq(token.balanceOf(bob), 100e18);
    }
}
