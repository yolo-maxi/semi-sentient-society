#!/bin/bash
# SSS Testnet Deployment — Base Sepolia
# Usage: bash script/deploy-testnet.sh
# Deploys all SSS contracts using forge create
set -euo pipefail

export PATH="$HOME/.foundry/bin:$PATH"
cd "$(dirname "$0")/.."

RPC_URL="https://sepolia.base.org"
PK=$(node -e "console.log(JSON.parse(require('fs').readFileSync(require('os').homedir() + '/.evm-wallet.json', 'utf8')).privateKey)")
DEPLOYER=$(cast wallet address "$PK")
ZERO="0x0000000000000000000000000000000000000000"
DEAD="0x000000000000000000000000000000000000dEaD"

echo "=== SSS Testnet Deployment ==="
echo "Deployer: $DEPLOYER"
echo "Chain: Base Sepolia (84532)"
echo ""

deploy() {
  local contract="$1"
  shift
  local output
  output=$(forge create --rpc-url "$RPC_URL" --private-key "$PK" --broadcast "$contract" "$@" 2>&1)
  echo "$output" | grep "Deployed to:" | awk '{print $3}'
}

send() {
  cast send --rpc-url "$RPC_URL" --private-key "$PK" "$@" 2>&1 | grep -q "status.*1" && echo "OK" || echo "FAIL"
}

# 1. MockSuperToken
SSS_TOKEN=$(deploy test/mocks/MockSuperToken.sol:MockSuperToken)
echo "1. MockSuperToken: $SSS_TOKEN"

# 2. MockSuperfluidPool
DIVIDEND_POOL=$(deploy test/mocks/MockSuperToken.sol:MockSuperfluidPool)
echo "2. MockSuperfluidPool: $DIVIDEND_POOL"

# 3. SSSShells
SHELLS=$(deploy src/SSSShells.sol:SSSShells --constructor-args "$SSS_TOKEN" "$DIVIDEND_POOL" "$ZERO" "$DEPLOYER")
echo "3. SSSShells: $SHELLS"

# 4. SSSCorvee
CORVEE=$(deploy src/SSSCorvee.sol:SSSCorvee --constructor-args "$SSS_TOKEN" "$SHELLS" "$DEPLOYER")
echo "4. SSSCorvee: $CORVEE"

# 5. Wire circular deps
echo -n "5. Wiring Shells<>Corvee... "
send "$SHELLS" "setCorveeContract(address)" "$CORVEE"
send "$CORVEE" "setShellsContract(address)" "$SHELLS"

# 6. SSSStaking
STAKING=$(deploy src/SSSStaking.sol:SSSStaking --constructor-args "$SSS_TOKEN" "$DEAD" "$DEPLOYER")
echo "6. SSSStaking: $STAKING"

# 7. SSSStreamModulator
MODULATOR=$(deploy src/SSSStreamModulator.sol:SSSStreamModulator --constructor-args "$SSS_TOKEN" "$DIVIDEND_POOL" "$DEPLOYER")
echo "7. SSSStreamModulator: $MODULATOR"

# 8. SSSGovernor
GOVERNOR=$(deploy src/SSSGovernor.sol:SSSGovernor --constructor-args "$SHELLS" "$DEPLOYER")
echo "8. SSSGovernor: $GOVERNOR"

# 9. Mint test tokens
echo ""
echo "Minting test tokens..."
MINT="10000000000000000000000"
TREASURY="100000000000000000000000"
send "$SSS_TOKEN" "mint(address,uint256)" "$DEPLOYER" "$MINT"
send "$SSS_TOKEN" "mint(address,uint256)" "$CORVEE" "$TREASURY"
echo "Done: $DEPLOYER has 10k SSS, corvee has 100k SSS treasury"

# Save
mkdir -p deployments
cat > deployments/base-sepolia.json << DEPLOY_EOF
{
  "network": "base-sepolia",
  "chainId": 84532,
  "deployer": "$DEPLOYER",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "sssToken": "$SSS_TOKEN",
    "dividendPool": "$DIVIDEND_POOL",
    "shells": "$SHELLS",
    "corvee": "$CORVEE",
    "staking": "$STAKING",
    "streamModulator": "$MODULATOR",
    "governor": "$GOVERNOR"
  }
}
DEPLOY_EOF

echo ""
echo "=== COMPLETE ==="
echo "Saved to deployments/base-sepolia.json"
