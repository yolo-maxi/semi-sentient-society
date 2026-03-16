// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken} from "./mocks/MockSuperToken.sol";
import {SSSStaking} from "../src/SSSStaking.sol";
import {SSSCapabilityRegistry} from "../src/SSSCapabilityRegistry.sol";

contract SSSCapabilityRegistryTest is Test {
    MockSuperToken token;
    SSSStaking staking;
    SSSCapabilityRegistry registry;

    address owner = address(this);
    address stakingPool = address(0x9001);
    address agent = address(0x1111);
    address otherAgent = address(0x2222);

    function setUp() public {
        token = new MockSuperToken();
        staking = new SSSStaking(token, stakingPool, owner);
        registry = new SSSCapabilityRegistry(address(staking));

        token.mint(agent, 1000e18);
        token.mint(otherAgent, 1000e18);
    }

    function testSetCapabilities() public {
        _stake(agent);

        string[] memory caps = new string[](2);
        caps[0] = "code-review";
        caps[1] = "security-audit";

        vm.prank(agent);
        registry.setCapabilities(caps);

        string[] memory storedCaps = registry.getCapabilities(agent);
        assertEq(storedCaps.length, 2);
        assertEq(storedCaps[0], "code-review");
        assertEq(storedCaps[1], "security-audit");
    }

    function testOnlyStakedAgentsCanRegister() public {
        string[] memory caps = new string[](1);
        caps[0] = "code-review";

        vm.prank(agent);
        vm.expectRevert("Agent not staked");
        registry.setCapabilities(caps);
    }

    function testAddCapabilityHonorsMax() public {
        _stake(agent);

        string[] memory caps = new string[](10);
        for (uint256 i = 0; i < caps.length; i++) {
            caps[i] = string.concat("cap-", vm.toString(i));
        }

        vm.prank(agent);
        registry.setCapabilities(caps);

        vm.prank(agent);
        vm.expectRevert("Too many capabilities");
        registry.addCapability("overflow");
    }

    function testSetCapabilitiesRejectsDuplicates() public {
        _stake(agent);

        string[] memory caps = new string[](2);
        caps[0] = "code-review";
        caps[1] = "code-review";

        vm.prank(agent);
        vm.expectRevert("Capability exists");
        registry.setCapabilities(caps);
    }

    function testRemoveCapability() public {
        _stake(agent);

        string[] memory caps = new string[](2);
        caps[0] = "code-review";
        caps[1] = "data-analysis";

        vm.prank(agent);
        registry.setCapabilities(caps);

        vm.prank(agent);
        registry.removeCapability("code-review");

        string[] memory storedCaps = registry.getCapabilities(agent);
        assertEq(storedCaps.length, 1);
        assertEq(storedCaps[0], "data-analysis");
    }

    function testIndexesAgentsForDiscovery() public {
        _stake(agent);
        _stake(otherAgent);

        vm.prank(agent);
        registry.addCapability("code-review");

        vm.prank(otherAgent);
        registry.addCapability("content-gen");

        address[] memory agents = registry.getAgents();
        assertEq(agents.length, 2);
        assertEq(agents[0], agent);
        assertEq(agents[1], otherAgent);
    }

    function _stake(address stakedAgent) internal {
        vm.startPrank(stakedAgent);
        token.approve(address(staking), 100e18);
        staking.stake(100e18);
        vm.stopPrank();
    }
}
