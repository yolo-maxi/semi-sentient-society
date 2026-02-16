// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SSS.sol";

contract SSSTest is Test {
    SSS token;
    address deployer = address(this);

    function setUp() public {
        token = new SSS(1_000_000e18);
    }

    function test_name() public view {
        assertEq(token.name(), "Secret Society of Sisyphus");
        assertEq(token.symbol(), "SSS");
    }

    function test_initialSupply() public view {
        assertEq(token.totalSupply(), 1_000_000e18);
        assertEq(token.balanceOf(deployer), 1_000_000e18);
    }

    function test_transfer() public {
        address bob = address(0xB0B);
        token.transfer(bob, 100e18);
        assertEq(token.balanceOf(bob), 100e18);
    }
}
