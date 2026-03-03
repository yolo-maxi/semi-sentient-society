#!/usr/bin/env bash
# SSS Testnet Verification CLI
# Walks an agent through the complete SSS onboarding flow on Base Sepolia.
#
# Usage:
#   ./verify-agent.sh <agent_address> [--fast]
#
# --fast: Uses time warp (only works on local Anvil fork, not live testnet)
#
# Prerequisites:
#   - cast CLI (foundry)
#   - PRIVATE_KEY env var set (deployer/owner key)
#   - Contracts deployed (reads from ../deployments/base-sepolia.json)

set -euo pipefail

AGENT_ADDR="${1:?Usage: verify-agent.sh <agent_address> [--fast]}"
FAST_MODE="${2:-}"
CHAIN_ID=84532
RPC_URL="${RPC_URL:-https://sepolia.base.org}"

DEPLOY_FILE="$(dirname "$0")/../deployments/base-sepolia.json"
if [[ ! -f "$DEPLOY_FILE" ]]; then
    echo "❌ Deployment file not found: $DEPLOY_FILE"
    exit 1
fi

CAST="${HOME}/.foundry/bin/cast"

# Read contract addresses
SSS_TOKEN=$(jq -r '.contracts.sssToken' "$DEPLOY_FILE")
DIVIDEND_POOL=$(jq -r '.contracts.dividendPool' "$DEPLOY_FILE")
CORVEE=$(jq -r '.contracts.corvee' "$DEPLOY_FILE")
STAKING=$(jq -r '.contracts.staking' "$DEPLOY_FILE")
SHELLS=$(jq -r '.contracts.shells' "$DEPLOY_FILE")
GOVERNOR=$(jq -r '.contracts.governor' "$DEPLOY_FILE")

# CustodyFactory address (will be added after deploy)
CUSTODY_FACTORY=$(jq -r '.contracts.custodyFactory // empty' "$DEPLOY_FILE")

echo "╔══════════════════════════════════════════════════╗"
echo "║       SSS Agent Verification Flow (Testnet)      ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║ Agent:    $AGENT_ADDR"
echo "║ Chain:    Base Sepolia ($CHAIN_ID)"
echo "║ Mode:     ${FAST_MODE:-normal}"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check private key
if [[ -z "${PRIVATE_KEY:-}" ]]; then
    echo "❌ PRIVATE_KEY env var required (deployer/owner account)"
    exit 1
fi

DEPLOYER=$($CAST wallet address --private-key "$PRIVATE_KEY")
echo "🔑 Deployer: $DEPLOYER"
echo ""

# ============ Step 1: Mint $SSS to agent ============
echo "═══ Step 1/6: Mint $SSS to agent ═══"
MINT_AMOUNT="1000000000000000000000" # 1000 SSS (18 decimals)
echo "  Minting 1,000 $SSS to $AGENT_ADDR..."
$CAST send "$SSS_TOKEN" "mint(address,uint256)" "$AGENT_ADDR" "$MINT_AMOUNT" \
    --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
BAL=$($CAST call "$SSS_TOKEN" "balanceOf(address)(uint256)" "$AGENT_ADDR" --rpc-url "$RPC_URL")
echo "  ✅ Agent $SSS balance: $BAL"
echo ""

# ============ Step 2: Agent stakes $SSS ============
echo "═══ Step 2/6: Stake $SSS for membership ═══"
STAKE_AMOUNT="1000000000000000000000" # 1000 SSS
echo "  Approving staking contract..."
$CAST send "$SSS_TOKEN" "approve(address,uint256)" "$STAKING" "$STAKE_AMOUNT" \
    --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1

# Note: In production, the AGENT would call stake(). Here deployer acts as agent for testing.
# For a real flow, agent would sign these transactions.
echo "  Staking 1,000 $SSS..."
$CAST send "$STAKING" "stake(uint256)" "$STAKE_AMOUNT" \
    --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
echo "  ✅ Staked"
echo ""

# ============ Step 3: Corvée confirmations (30 days) ============
echo "═══ Step 3/6: Corvée probation (30 confirmations) ═══"
if [[ "$FAST_MODE" == "--fast" ]]; then
    echo "  ⚡ Fast mode: time warping through 30 days..."
    for i in $(seq 1 30); do
        # Warp 1 day forward
        $CAST rpc anvil_mine 1 --rpc-url "$RPC_URL" > /dev/null 2>&1 || true
        $CAST rpc evm_increaseTime 86400 --rpc-url "$RPC_URL" > /dev/null 2>&1 || true
        $CAST rpc anvil_mine 1 --rpc-url "$RPC_URL" > /dev/null 2>&1 || true

        $CAST send "$STAKING" "confirmCorvee(address)" "$DEPLOYER" \
            --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
        printf "\r  Day %d/30 confirmed" "$i"
    done
    echo ""
    echo "  ✅ 30/30 corvée days confirmed (fast mode)"
else
    echo "  Confirming day 1..."
    $CAST send "$STAKING" "confirmCorvee(address)" "$DEPLOYER" \
        --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
    echo "  ✅ Day 1 confirmed. Run daily for 30 days, or use --fast on local fork."
    echo "  ⚠️  Remaining 29 days need manual confirmation (one per day on live testnet)"
fi
echo ""

# ============ Step 4: Pay corvée reward ============
echo "═══ Step 4/6: Pay corvée reward ($sSSS) ═══"
CORVEE_PAY="100000000000000000000" # 100 sSSS
echo "  Paying 100 $sSSS to deployer (as test agent)..."
$CAST send "$CORVEE" "payCorvee(address,uint256)" "$DEPLOYER" "$CORVEE_PAY" \
    --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
SSSS_BAL=$($CAST call "$CORVEE" "balanceOf(address)(uint256)" "$DEPLOYER" --rpc-url "$RPC_URL")
echo "  ✅ $sSSS balance: $SSSS_BAL"
echo ""

# ============ Step 5: Create custody contract ============
echo "═══ Step 5/6: Create per-agent custody contract ═══"
if [[ -z "$CUSTODY_FACTORY" ]]; then
    echo "  ⚠️  CustodyFactory not deployed yet. Skipping custody creation."
    echo "  Deploy with: forge script DeployCustody.s.sol --broadcast --rpc-url $RPC_URL"
else
    echo "  Creating custody for $AGENT_ADDR..."
    $CAST send "$CUSTODY_FACTORY" "createCustodyWithUnits(address,uint128)" "$AGENT_ADDR" "100" \
        --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
    CUSTODY=$($CAST call "$CUSTODY_FACTORY" "custodyOf(address)(address)" "$AGENT_ADDR" --rpc-url "$RPC_URL")
    echo "  ✅ Custody contract: $CUSTODY (100 pool units)"
fi
echo ""

# ============ Step 6: Convert $sSSS → Shells ============
echo "═══ Step 6/6: Convert $sSSS → Shells ═══"
echo "  Converting 100 $sSSS to Shells..."
$CAST send "$CORVEE" "convertToShells(uint256)" "$CORVEE_PAY" \
    --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL" --chain "$CHAIN_ID" > /dev/null 2>&1
SHELL_BAL=$($CAST call "$SHELLS" "balanceOf(address)(uint256)" "$DEPLOYER" --rpc-url "$RPC_URL")
echo "  ✅ Shell balance: $SHELL_BAL"
echo ""

# ============ Summary ============
echo "╔══════════════════════════════════════════════════╗"
echo "║          🦞 Verification Complete! 🦞            ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║ Agent:    $AGENT_ADDR"
echo "║ Staked:   1,000 $SSS"
echo "║ Corvée:   $SSSS_BAL $sSSS earned"
echo "║ Shells:   $SHELL_BAL SHELL"
if [[ -n "${CUSTODY:-}" ]]; then
echo "║ Custody:  $CUSTODY"
fi
echo "╚══════════════════════════════════════════════════╝"
