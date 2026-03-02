#!/bin/bash
# SSS Testnet Deployment — Base Sepolia
# Deploys all SSS contracts using forge create
set -e

export PATH="$HOME/.foundry/bin:$PATH"
cd "$(dirname "$0")/.."

RPC_URL="https://sepolia.base.org"
PRIVATE_KEY=$(node -e "console.log(JSON.parse(require('fs').readFileSync(require('os').homedir() + '/.evm-wallet.json', 'utf8')).privateKey)")
DEPLOYER=$(cast wallet address "$PRIVATE_KEY")

echo "=== SSS Testnet Deployment ==="
echo "Deployer: $DEPLOYER"
echo "RPC: $RPC_URL"
echo "Chain: Base Sepolia (84532)"
echo ""

# Helper function
deploy() {
  local name=$1
  shift
  echo "Deploying $name..."
  local result
  result=$(forge create "$@" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" 2>&1)
  local addr
  addr=$(echo "$result" | grep "Deployed to:" | awk '{print $3}')
  echo "  → $addr"
  echo "$addr"
}

# 1. MockSuperToken ($SSS)
SSS_TOKEN=$(forge create test/mocks/MockSuperToken.sol:MockSuperToken \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ MockSuperToken ($SSS): $SSS_TOKEN"

# 2. MockSuperfluidPool (dividends)
DIVIDEND_POOL=$(forge create test/mocks/MockSuperToken.sol:MockSuperfluidPool \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ MockSuperfluidPool: $DIVIDEND_POOL"

# 3. SSSShells (corveeContract = address(0) initially)
SHELLS=$(forge create src/SSSShells.sol:SSSShells \
  --constructor-args "$SSS_TOKEN" "$DIVIDEND_POOL" "0x0000000000000000000000000000000000000000" "$DEPLOYER" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ SSSShells: $SHELLS"

# 4. SSSCorvee
CORVEE=$(forge create src/SSSCorvee.sol:SSSCorvee \
  --constructor-args "$SSS_TOKEN" "$SHELLS" "$DEPLOYER" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ SSSCorvee: $CORVEE"

# 5. Wire circular dependency
echo "Wiring SSSShells.setCorveeContract($CORVEE)..."
cast send "$SHELLS" "setCorveeContract(address)" "$CORVEE" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" 2>&1 | tail -1
echo "  ✅ Shells → Corvee wired"

echo "Wiring SSSCorvee.setShellsContract($SHELLS)..."
cast send "$CORVEE" "setShellsContract(address)" "$SHELLS" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" 2>&1 | tail -1
echo "  ✅ Corvee → Shells wired"

# 6. SSSStaking
STAKING_POOL="0x000000000000000000000000000000000000dEaD" # mock sink
STAKING=$(forge create src/SSSStaking.sol:SSSStaking \
  --constructor-args "$SSS_TOKEN" "$STAKING_POOL" "$DEPLOYER" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ SSSStaking: $STAKING"

# 7. SSSStreamModulator
MODULATOR=$(forge create src/SSSStreamModulator.sol:SSSStreamModulator \
  --constructor-args "$SSS_TOKEN" "$DIVIDEND_POOL" "$DEPLOYER" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ SSSStreamModulator: $MODULATOR"

# 8. SSSGovernor
GOVERNOR=$(forge create src/SSSGovernor.sol:SSSGovernor \
  --constructor-args "$SHELLS" "$DEPLOYER" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --broadcast 2>&1 | grep "Deployed to:" | awk '{print $3}')
echo "✅ SSSGovernor: $GOVERNOR"

# 9. Mint test $SSS to agents
OCEAN="0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931"
AGENT2="0x0000000000000000000000000000000000000002"
AGENT3="0x0000000000000000000000000000000000000003"
MINT_AMOUNT="10000000000000000000000" # 10,000 * 1e18

echo ""
echo "Minting test $SSS..."
cast send "$SSS_TOKEN" "mint(address,uint256)" "$OCEAN" "$MINT_AMOUNT" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null 2>&1
echo "  ✅ 10,000 $SSS → Ocean ($OCEAN)"

cast send "$SSS_TOKEN" "mint(address,uint256)" "$AGENT2" "$MINT_AMOUNT" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null 2>&1
echo "  ✅ 10,000 $SSS → Agent2 ($AGENT2)"

cast send "$SSS_TOKEN" "mint(address,uint256)" "$AGENT3" "$MINT_AMOUNT" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null 2>&1
echo "  ✅ 10,000 $SSS → Agent3 ($AGENT3)"

# 10. Fund corvee treasury
TREASURY_AMOUNT="100000000000000000000000" # 100,000 * 1e18
cast send "$SSS_TOKEN" "mint(address,uint256)" "$CORVEE" "$TREASURY_AMOUNT" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null 2>&1
echo "  ✅ 100,000 $SSS → Corvee treasury"

echo ""
echo "=== SSS TESTNET DEPLOYMENT COMPLETE ==="
echo ""
echo "Network: Base Sepolia (84532)"
echo "Explorer: https://base-sepolia.blockscout.com"
echo ""
echo "Contracts:"
echo "  Token (\$SSS):     $SSS_TOKEN"
echo "  Staking:          $STAKING"
echo "  Corvee (\$sSSS):   $CORVEE"
echo "  Shells:           $SHELLS"
echo "  Governor:         $GOVERNOR"
echo "  StreamModulator:  $MODULATOR"
echo "  DividendPool:     $DIVIDEND_POOL"
echo ""
echo "Test Agents:"
echo "  Ocean:  $OCEAN (10,000 \$SSS)"
echo "  Agent2: $AGENT2 (10,000 \$SSS)"
echo "  Agent3: $AGENT3 (10,000 \$SSS)"

# Save deployment info
cat > deployments/base-sepolia.json << EOF
{
  "network": "base-sepolia",
  "chainId": 84532,
  "deployer": "$DEPLOYER",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "sssToken": "$SSS_TOKEN",
    "staking": "$STAKING",
    "corvee": "$CORVEE",
    "shells": "$SHELLS",
    "governor": "$GOVERNOR",
    "streamModulator": "$MODULATOR",
    "dividendPool": "$DIVIDEND_POOL"
  },
  "testAgents": {
    "ocean": "$OCEAN",
    "agent2": "$AGENT2",
    "agent3": "$AGENT3"
  }
}
EOF
echo "Saved to deployments/base-sepolia.json"
