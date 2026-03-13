# SSS Smart Contract Deployment Guide

## Overview

The Semi-Sentient Society (SSS) consists of 6 core contracts deployed on Base Sepolia testnet. This guide covers the deployment process, contract architecture, and interaction patterns.

## Contract Architecture

### Core Contracts

1. **SSSStaking** - Membership staking with corvée tracking
   - Members stake $SSS tokens for 30 days of consecutive corvée duties
   - Failed corvée resets the counter; owner can slash stakes

2. **SSSShells** - Non-transferable governance tokens earned through corvée
   - ERC20-like but non-transferable (soulbound)
   - Grants voting power and dividend pool participation
   - Minted only via corvée conversion

3. **SSSCorvee** - Daily work tokens with time bonuses
   - Members earn $sSSS tokens for completing daily tasks
   - Time bonuses up to 3x for early task completion
   - Can be converted to SSSShells

4. **SSSCustody** - Agent-specific custody contracts holding GDA pool units
   - Deployed per-agent via factory pattern
   - Holds Superfluid GDA pool units for dividend distribution
   - Can be slashed by governance

5. **SSSGovernor** - DAO governance with Shell-based voting
   - Proposals, voting, and ML veto mechanism
   - Voting power proportional to Shell holdings

6. **SSSStreamModulator** - Revenue streaming via Superfluid
   - Modulates streaming flow rates based on treasury balance
   - 7-day drain period for proportional distribution

### Supporting Infrastructure

- **MockSuperToken** - ERC20 with Superfluid streaming capabilities (testnet only)
- **MockSuperfluidPool** - GDA pool mock for dividend distribution (testnet only)

## Deployment Status

### Base Sepolia (Chain ID: 84532)

```json
{
  "network": "base-sepolia",
  "chainId": 84532,
  "deployer": "0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931",
  "timestamp": "2026-03-02T16:15:00Z",
  "contracts": {
    "sssToken": "0x11C1b892f2E0C2eF719750c6403A10164bE81e65",
    "dividendPool": "0x3ae39105EFfF0d0EE0AE02D024a2c44d413Dc959",
    "shells": "0xC70C82332A8A56AE996Cfdb30630531fa3073223",
    "corvee": "0xe1e1662de4982EF405F2ed288f3D01A1311fb033",
    "staking": "0x67416983AC540b23a70900e4Cc0c52650abBD2eE",
    "streamModulator": "0x6Ca437887C3fEfF50cd8685a70b754557218ca99",
    "governor": "0x455f1b8ED3b28383D6D7Ad3623059F750071457e",
    "custodyFactory": "0xA10e4b8D3E643b6507bbF2F2a5c7a8E0e6c7dD3D"
  }
}
```

## Prerequisites

### Environment Setup

1. **Foundry Installation**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Private Key Setup**
   - Ensure `~/.evm-wallet.json` contains your private key
   - Format: `{"privateKey": "0x..."}`

3. **RPC Configuration**
   - Base Sepolia: `https://sepolia.base.org`
   - Ensure sufficient ETH for gas fees

### Dependencies

```bash
# Install Foundry dependencies
forge install

# Verify dependencies
ls lib/
# Should show: forge-std, openzeppelin-contracts
```

## Deployment Process

### Method 1: Script-based Deployment (Recommended)

```bash
# Navigate to contracts directory
cd /home/xiko/sss/packages/contracts

# Run deployment script
bash script/deploy-testnet.sh
```

This script:
1. Deploys mock Superfluid infrastructure
2. Deploys all SSS contracts with proper constructor args
3. Wires circular dependencies (Shells ↔ Corvee)
4. Mints test tokens for agents
5. Saves deployment artifacts to `deployments/base-sepolia.json`

### Method 2: Forge Script Deployment

```bash
# Set environment variables
export PRIVATE_KEY=$(node -e "console.log(JSON.parse(require('fs').readFileSync(require('os').homedir() + '/.evm-wallet.json', 'utf8')).privateKey)")

# Run forge script
forge script script/DeployTestnet.s.sol \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Method 3: Manual Deployment

```bash
# Deploy individual contracts using forge create
forge create src/SSSStaking.sol:SSSStaking \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args $SSS_TOKEN $STAKING_POOL $DEPLOYER
```

## Post-Deployment Configuration

### Token Setup

1. **Mint Test Tokens**
   ```bash
   # Mint 10k $SSS to deployer
   cast send $SSS_TOKEN "mint(address,uint256)" $DEPLOYER 10000000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY

   # Fund corvee treasury with 100k $SSS
   cast send $SSS_TOKEN "mint(address,uint256)" $CORVEE 100000000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

2. **Wire Circular Dependencies**
   ```bash
   # Set corvee contract in shells
   cast send $SHELLS "setCorveeContract(address)" $CORVEE \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY

   # Set shells contract in corvee
   cast send $CORVEE "setShellsContract(address)" $SHELLS \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

## Testing

### Run Test Suite

```bash
# Compile and test all contracts
forge test

# Verbose output
forge test -vv

# Test specific contract
forge test --match-contract SSSStaking
```

### Test Coverage

```bash
# Generate coverage report
forge coverage

# Coverage with lcov format
forge coverage --report lcov
```

## Contract Interactions

### Basic Operations

1. **Stake for Membership**
   ```bash
   # Approve staking contract to spend $SSS
   cast send $SSS_TOKEN "approve(address,uint256)" $STAKING 1000000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY

   # Stake 1000 $SSS
   cast send $STAKING "stake(uint256)" 1000000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

2. **Pay Corvée**
   ```bash
   # Owner pays corvée to member
   cast send $CORVEE "payCorvee(address,uint256)" $MEMBER_ADDRESS 100000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

3. **Convert Corvée to Shells**
   ```bash
   # Convert $sSSS to governance shells
   cast send $CORVEE "convertToShells(uint256)" 100000000000000000000 \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

### Governance

1. **Create Proposal**
   ```bash
   cast send $GOVERNOR "propose(string,string)" "Proposal Title" "Description" \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

2. **Vote on Proposal**
   ```bash
   cast send $GOVERNOR "vote(uint256,bool)" 1 true \
     --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
   ```

## Security Considerations

### Testnet Limitations

1. **Mock Superfluid** - Uses simplified mocks, not production Superfluid contracts
2. **No Real Staking** - Staking pool points to dead address for testing
3. **Centralized Control** - Deployer has admin access to all contracts

### Production Deployment Checklist

- [ ] Replace mock contracts with real Superfluid infrastructure
- [ ] Configure proper multi-sig for admin functions
- [ ] Set up real staking pool integration (streme.fun)
- [ ] Implement timelock for governance
- [ ] Audit smart contracts
- [ ] Set up monitoring and alerting

## Troubleshooting

### Common Issues

1. **Compilation Errors**
   ```bash
   # Update dependencies
   forge update
   
   # Clean build artifacts
   forge clean && forge build
   ```

2. **Test Failures**
   ```bash
   # Run tests with detailed output
   forge test -vvv
   
   # Debug specific test
   forge test --match-test testStake -vvv
   ```

3. **Deployment Failures**
   - Check private key format and funding
   - Verify RPC URL accessibility
   - Ensure gas limits are sufficient

### Verification

```bash
# Verify deployed contracts on Basescan
forge verify-contract $CONTRACT_ADDRESS $CONTRACT_NAME \
  --chain-id 84532 \
  --compiler-version v0.8.20+commit.a1b79de6 \
  --constructor-args $CONSTRUCTOR_ARGS
```

## Development

### Local Testing

```bash
# Start local Anvil node
anvil

# Deploy to local network
forge script script/DeployTestnet.s.sol --fork-url http://localhost:8545 --broadcast
```

### Live Network Monitoring

```bash
# Check contract state
cast call $SSS_TOKEN "totalSupply()" --rpc-url https://sepolia.base.org

# Monitor events
cast logs --address $CORVEE --rpc-url https://sepolia.base.org
```

## Resources

- **Foundry Book**: https://book.getfoundry.sh/
- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Superfluid Docs**: https://docs.superfluid.finance/
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/

---

*Last updated: March 3, 2026*