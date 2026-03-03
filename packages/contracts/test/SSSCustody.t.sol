// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken} from "./mocks/MockSuperToken.sol";
import {MockSuperfluidPool} from "./mocks/MockSuperToken.sol";
import {SSSCustody, SSSCustodyFactory} from "../src/SSSCustody.sol";

contract SSSCustodyTest is Test {
    MockSuperToken token;
    MockSuperfluidPool pool;
    SSSCustodyFactory factory;

    address owner = address(this);
    address agent1 = address(0x1111);
    address agent2 = address(0x2222);
    address treasury = address(0x9999);

    function setUp() public {
        token = new MockSuperToken();
        pool = new MockSuperfluidPool();
        factory = new SSSCustodyFactory(token, pool, owner);
    }

    // ===================== Factory Tests =====================

    function testCreateCustody() public {
        SSSCustody custody = factory.createCustody(agent1);
        assertEq(address(factory.custodyOf(agent1)), address(custody));
        assertTrue(factory.hasCustody(agent1));
        assertEq(factory.totalCustodies(), 1);
    }

    function testCannotCreateDuplicateCustody() public {
        factory.createCustody(agent1);
        vm.expectRevert("Custody already exists");
        factory.createCustody(agent1);
    }

    function testCannotCreateCustodyForZeroAddress() public {
        vm.expectRevert("Zero agent address");
        factory.createCustody(address(0));
    }

    function testCreateCustodyWithUnits() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 100);
        assertEq(custody.getUnits(), 100);
        assertEq(pool.getUnits(address(custody)), 100);
    }

    function testOnlyOwnerCanCreateCustody() public {
        vm.prank(agent1);
        vm.expectRevert();
        factory.createCustody(agent1);
    }

    function testMultipleCustodies() public {
        factory.createCustody(agent1);
        factory.createCustody(agent2);
        assertEq(factory.totalCustodies(), 2);
        assertTrue(factory.hasCustody(agent1));
        assertTrue(factory.hasCustody(agent2));
        assertFalse(factory.hasCustody(address(0x3333)));
    }

    // ===================== Custody Unit Tests =====================

    function testSetUnits() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 50);
        assertEq(custody.getUnits(), 50);

        factory.setAgentUnits(agent1, 100);
        assertEq(custody.getUnits(), 100);
    }

    function testAgentCannotSetUnits() public {
        SSSCustody custody = factory.createCustody(agent1);
        vm.prank(agent1);
        vm.expectRevert();
        custody.setUnits(100);
    }

    // ===================== Dividend Claim Tests =====================

    function testClaimDividends() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 100);

        // Simulate dividends arriving (mock: just mint to custody)
        token.mint(address(custody), 500e18);
        assertEq(custody.getAccumulatedSSS(), 500e18);

        vm.prank(agent1);
        custody.claimDividends();

        assertEq(token.balanceOf(agent1), 500e18);
        assertEq(custody.getAccumulatedSSS(), 0);
    }

    function testCannotClaimZeroDividends() public {
        SSSCustody custody = factory.createCustody(agent1);
        vm.prank(agent1);
        vm.expectRevert("Nothing to claim");
        custody.claimDividends();
    }

    function testOnlyAgentCanClaimDividends() public {
        SSSCustody custody = factory.createCustody(agent1);
        token.mint(address(custody), 100e18);

        vm.prank(agent2);
        vm.expectRevert("Only agent");
        custody.claimDividends();
    }

    // ===================== Owner Withdraw Tests =====================

    function testOwnerWithdrawSSS() public {
        SSSCustody custody = factory.createCustody(agent1);
        token.mint(address(custody), 200e18);

        // Factory is owner of custody, so we call via factory... but factory
        // doesn't expose withdrawSSS directly. Let's test via custody directly
        // since factory is the owner.
        // The factory address is address(this) context won't work — factory is owner.
        // We need to call custody.withdrawSSS from the factory's address.
        // Since factory doesn't expose this, test the custody directly.

        // custody.owner() == address(factory)
        // So we prank as factory:
        vm.prank(address(factory));
        custody.withdrawSSS(treasury, 200e18);
        assertEq(token.balanceOf(treasury), 200e18);
    }

    function testCannotWithdrawZero() public {
        SSSCustody custody = factory.createCustody(agent1);
        vm.prank(address(factory));
        vm.expectRevert("Zero amount");
        custody.withdrawSSS(treasury, 0);
    }

    function testCannotWithdrawMoreThanBalance() public {
        SSSCustody custody = factory.createCustody(agent1);
        token.mint(address(custody), 100e18);
        vm.prank(address(factory));
        vm.expectRevert("Insufficient balance");
        custody.withdrawSSS(treasury, 200e18);
    }

    // ===================== Slash Tests =====================

    function testSlashViaFactory() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 100);
        token.mint(address(custody), 500e18);

        factory.slashAgent(agent1, treasury);

        assertTrue(custody.slashed());
        assertEq(custody.getUnits(), 0);
        assertEq(custody.getAccumulatedSSS(), 0);
        assertEq(token.balanceOf(treasury), 500e18);
    }

    function testSlashNoUnitsNoBalance() public {
        factory.createCustody(agent1);
        factory.slashAgent(agent1, treasury);
        SSSCustody custody = factory.custodyOf(agent1);
        assertTrue(custody.slashed());
    }

    function testCannotSlashNonexistentAgent() public {
        vm.expectRevert("No custody for agent");
        factory.slashAgent(agent1, treasury);
    }

    function testCannotClaimAfterSlash() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 100);
        token.mint(address(custody), 500e18);
        factory.slashAgent(agent1, treasury);

        vm.prank(agent1);
        vm.expectRevert("Custody slashed");
        custody.claimDividends();
    }

    function testCannotSetUnitsAfterSlash() public {
        SSSCustody custody = factory.createCustodyWithUnits(agent1, 100);
        factory.slashAgent(agent1, treasury);

        vm.prank(address(factory));
        vm.expectRevert("Custody slashed");
        custody.setUnits(50);
    }

    function testOnlyOwnerCanSlash() public {
        factory.createCustody(agent1);
        SSSCustody custody = factory.custodyOf(agent1);
        vm.prank(agent1);
        vm.expectRevert();
        custody.slash(treasury);
    }

    // ===================== Integration: Multiple Agents =====================

    function testMultipleAgentsDividends() public {
        SSSCustody c1 = factory.createCustodyWithUnits(agent1, 100);
        SSSCustody c2 = factory.createCustodyWithUnits(agent2, 200);

        // Simulate proportional dividends
        token.mint(address(c1), 100e18);
        token.mint(address(c2), 200e18);

        vm.prank(agent1);
        c1.claimDividends();
        vm.prank(agent2);
        c2.claimDividends();

        assertEq(token.balanceOf(agent1), 100e18);
        assertEq(token.balanceOf(agent2), 200e18);
    }

    function testSlashOnePreservesOther() public {
        SSSCustody c1 = factory.createCustodyWithUnits(agent1, 100);
        SSSCustody c2 = factory.createCustodyWithUnits(agent2, 200);

        token.mint(address(c1), 100e18);
        token.mint(address(c2), 200e18);

        factory.slashAgent(agent1, treasury);

        // Agent1 slashed
        assertTrue(c1.slashed());
        assertEq(c1.getUnits(), 0);

        // Agent2 unaffected
        assertFalse(c2.slashed());
        assertEq(c2.getUnits(), 200);
        vm.prank(agent2);
        c2.claimDividends();
        assertEq(token.balanceOf(agent2), 200e18);
    }
}
