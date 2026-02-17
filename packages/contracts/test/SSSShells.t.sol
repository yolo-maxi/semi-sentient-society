// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockSuperToken, MockSuperfluidPool} from "./mocks/MockSuperToken.sol";
import {SSSCorvee} from "../src/SSSCorvee.sol";
import {SSSShells} from "../src/SSSShells.sol";

contract SSSShellsTest is Test {
    MockSuperToken token;
    MockSuperfluidPool pool;
    SSSCorvee corvee;
    SSSShells shells;
    address owner = address(this);
    address worker = address(0x1111);

    function setUp() public {
        token = new MockSuperToken();
        pool = new MockSuperfluidPool();
        corvee = new SSSCorvee(token, address(0), owner);
        shells = new SSSShells(token, pool, address(corvee), owner);
        corvee.setShellsContract(address(shells));
        token.mint(address(corvee), 1_000_000e18);
    }

    function testMintFromCorveeConversion() public {
        corvee.payCorvee(worker, 100e18);
        vm.prank(worker);
        corvee.convertToShells(100e18);

        assertGt(shells.balanceOf(worker), 0);
    }

    function testOnlyCorveeCanMint() public {
        vm.expectRevert("Only corvee contract");
        shells.mintFromCorvee(worker, 100e18);
    }

    function testNonTransferable() public {
        corvee.payCorvee(worker, 100e18);
        vm.prank(worker);
        corvee.convertToShells(100e18);

        vm.prank(worker);
        vm.expectRevert("Non-transferable");
        shells.transfer(address(0xBEEF), 50e18);
    }

    function testGDAUnitsUpdated() public {
        corvee.payCorvee(worker, 100e18);
        vm.prank(worker);
        corvee.convertToShells(100e18);

        uint128 units = pool.getUnits(worker);
        assertEq(units, uint128(shells.balanceOf(worker)));
    }

    function testGDAUnitsAccumulateAcrossMints() public {
        corvee.payCorvee(worker, 50e18);
        vm.prank(worker);
        corvee.convertToShells(50e18);

        uint256 first = shells.balanceOf(worker);

        corvee.payCorvee(worker, 50e18);
        vm.prank(worker);
        corvee.convertToShells(50e18);

        uint256 total = shells.balanceOf(worker);
        assertGt(total, first);
        assertEq(pool.getUnits(worker), uint128(total));
    }

    function testLockPeriod() public {
        corvee.payCorvee(worker, 100e18);
        vm.prank(worker);
        corvee.convertToShells(100e18);

        // Record the minted time
        assertEq(shells.mintedAt(worker), block.timestamp);
    }

    function testMultipleMembers() public {
        address worker2 = address(0x2222);
        corvee.payCorvee(worker, 100e18);
        corvee.payCorvee(worker2, 200e18);

        vm.prank(worker);
        corvee.convertToShells(100e18);
        vm.prank(worker2);
        corvee.convertToShells(200e18);

        assertEq(pool.getTotalUnits(), uint128(shells.balanceOf(worker) + shells.balanceOf(worker2)));
    }
}
