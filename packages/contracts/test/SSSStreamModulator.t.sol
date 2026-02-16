// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "./mocks/MockSuperToken.sol";
import "../src/SSSStreamModulator.sol";

/// @notice Basic deployment test — full GDA tests need a Superfluid fork
contract SSSStreamModulatorTest is Test {
    MockSuperToken token;
    SSSStreamModulator modulator;

    function setUp() public {
        token = new MockSuperToken();
        // GDA address is zero for unit tests (pool init will need fork test)
        modulator = new SSSStreamModulator(address(token), address(0));
    }

    function test_deploy() public view {
        assertEq(address(modulator.sss()), address(token));
        assertEq(modulator.DRAIN_PERIOD(), 7 days);
    }
}
