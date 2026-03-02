// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {MockSuperToken, MockSuperfluidPool} from "../test/mocks/MockSuperToken.sol";
import {SSSStaking} from "../src/SSSStaking.sol";
import {SSSCorvee} from "../src/SSSCorvee.sol";
import {SSSShells} from "../src/SSSShells.sol";
import {SSSGovernor} from "../src/SSSGovernor.sol";
import {SSSStreamModulator} from "../src/SSSStreamModulator.sol";

/// @title SSS Testnet Deployment Script
/// @notice Deploys all SSS contracts to Base Sepolia with mock Superfluid
/// @dev Run: forge script script/DeployTestnet.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast
contract DeployTestnet is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);

        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);

        vm.startBroadcast(deployerPk);

        // ── 1. Mock Superfluid infrastructure ──────────────────────────────
        MockSuperToken sssToken = new MockSuperToken();
        console.log("MockSuperToken ($SSS):", address(sssToken));

        MockSuperfluidPool dividendPool = new MockSuperfluidPool();
        console.log("MockSuperfluidPool (dividends):", address(dividendPool));

        address stakingPool = address(0xDEAD); // mock staking sink for testnet

        // ── 2. Deploy SSSShells (needs dividendPool) ───────────────────────
        // Deploy with corveeContract = address(0), wire later
        SSSShells shells = new SSSShells(
            sssToken,
            dividendPool,
            address(0), // corvee contract — set after
            deployer
        );
        console.log("SSSShells:", address(shells));

        // ── 3. Deploy SSSCorvee (needs sssToken + shells) ─────────────────
        SSSCorvee corvee = new SSSCorvee(
            sssToken,
            address(shells),
            deployer
        );
        console.log("SSSCorvee:", address(corvee));

        // ── 4. Wire circular dependency ────────────────────────────────────
        shells.setCorveeContract(address(corvee));
        corvee.setShellsContract(address(shells));

        // ── 5. Deploy SSSStaking ───────────────────────────────────────────
        SSSStaking staking = new SSSStaking(
            sssToken,
            stakingPool,
            deployer
        );
        console.log("SSSStaking:", address(staking));

        // ── 6. Deploy SSSStreamModulator ───────────────────────────────────
        SSSStreamModulator modulator = new SSSStreamModulator(
            sssToken,
            dividendPool,
            deployer
        );
        console.log("SSSStreamModulator:", address(modulator));

        // ── 7. Deploy SSSGovernor ──────────────────────────────────────────
        SSSGovernor governor = new SSSGovernor(
            shells,
            deployer
        );
        console.log("SSSGovernor:", address(governor));

        // ── 8. Mint test $SSS for demo agents ─────────────────────────────
        // Ocean: 0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931
        // Agent 2 & 3: deterministic test addresses
        address ocean = 0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931;
        address agent2 = 0x0000000000000000000000000000000000000002;
        address agent3 = 0x0000000000000000000000000000000000000003;

        uint256 mintAmount = 10_000e18;

        sssToken.mint(ocean, mintAmount);
        sssToken.mint(agent2, mintAmount);
        sssToken.mint(agent3, mintAmount);
        console.log("Minted 10,000 $SSS to 3 agents");

        // ── 9. Fund corvee treasury for testing ────────────────────────────
        sssToken.mint(address(corvee), 100_000e18);
        console.log("Funded corvee treasury with 100,000 $SSS");

        vm.stopBroadcast();

        // ── Summary ────────────────────────────────────────────────────────
        console.log("\n=== SSS TESTNET DEPLOYMENT COMPLETE ===");
        console.log("Network: Base Sepolia (chain 84532)");
        console.log("Token ($SSS):", address(sssToken));
        console.log("Staking:", address(staking));
        console.log("Corvee ($sSSS):", address(corvee));
        console.log("Shells:", address(shells));
        console.log("Governor:", address(governor));
        console.log("StreamModulator:", address(modulator));
        console.log("DividendPool:", address(dividendPool));
    }
}
