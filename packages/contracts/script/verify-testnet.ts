import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { 
  SSS_CONTRACTS,
  SSS_TOKEN_ABI,
  SSS_STAKING_ABI,
  SSS_CORVEE_ABI,
  SSS_SHELLS_ABI,
  SSS_CUSTODY_FACTORY_ABI,
  SSS_MOCK_POOL_ABI
} from '../../web/lib/contracts.js';

// Create client connected to Base Sepolia
const client = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

// Test addresses (for testing balanceOf, staking info, etc.)
const TEST_ADDRESS = '0x0000000000000000000000000000000000000001'; // Valid test address

interface TestResult {
  contract: string;
  address: string;
  success: boolean;
  error?: string;
  results?: Record<string, any>;
}

async function testContract(
  name: string, 
  address: string, 
  abi: any[], 
  tests: { name: string; args?: any[] }[]
): Promise<TestResult> {
  console.log(`\n🔍 Testing ${name} at ${address}`);
  
  const result: TestResult = {
    contract: name,
    address,
    success: true,
    results: {}
  };

  try {
    for (const test of tests) {
      console.log(`  ├─ Calling ${test.name}${test.args ? `(${test.args.join(', ')})` : '()'}`);
      
      try {
        const response = await client.readContract({
          address: address as `0x${string}`,
          abi,
          functionName: test.name,
          args: test.args || []
        });
        
        result.results![test.name] = response;
        console.log(`  ├─ ✅ ${test.name}: ${formatValue(response)}`);
      } catch (err) {
        console.log(`  ├─ ❌ ${test.name}: ${err instanceof Error ? err.message : String(err)}`);
        result.results![test.name] = { error: err instanceof Error ? err.message : String(err) };
      }
    }
  } catch (err) {
    result.success = false;
    result.error = err instanceof Error ? err.message : String(err);
    console.log(`  └─ ❌ Contract failed: ${result.error}`);
  }

  return result;
}

function formatValue(value: any): string {
  if (typeof value === 'bigint') {
    return `${value.toString()} (${(Number(value) / 1e18).toFixed(4)} tokens)`;
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`;
  }
  return String(value);
}

async function main() {
  console.log('🚀 SSS Contract Integration Test - Base Sepolia');
  console.log('================================================');
  console.log(`Using RPC: ${baseSepolia.rpcUrls.default.http[0]}`);
  console.log(`Chain ID: ${baseSepolia.id}`);
  
  const results: TestResult[] = [];

  // Test SSS Token
  results.push(await testContract('SSS Token', SSS_CONTRACTS.sssToken, SSS_TOKEN_ABI, [
    { name: 'name' },
    { name: 'symbol' },
    { name: 'totalSupply' },
    { name: 'balanceOf', args: [TEST_ADDRESS] }
  ]));

  // Test Staking Contract
  results.push(await testContract('Staking', SSS_CONTRACTS.staking, SSS_STAKING_ABI, [
    { name: 'totalStaked' },
    { name: 'getStakeInfo', args: [TEST_ADDRESS] },
    { name: 'pendingRewards', args: [TEST_ADDRESS] }
  ]));

  // Test Shells (ERC1155)
  results.push(await testContract('Shells', SSS_CONTRACTS.shells, SSS_SHELLS_ABI, [
    { name: 'uri', args: [1] },
    { name: 'balanceOf', args: [TEST_ADDRESS, 1] },
    { name: 'balanceOfBatch', args: [[TEST_ADDRESS], [1]] }
  ]));

  // Test Corvee
  results.push(await testContract('Corvee', SSS_CONTRACTS.corvee, SSS_CORVEE_ABI, [
    { name: 'getCorveeHistory', args: [TEST_ADDRESS] },
    { name: 'getCorveeData', args: [1] }
  ]));

  // Test Custody Factory
  results.push(await testContract('Custody Factory', SSS_CONTRACTS.custodyFactory, SSS_CUSTODY_FACTORY_ABI, [
    { name: 'totalCustodies' },
    { name: 'hasCustody', args: [TEST_ADDRESS] },
    { name: 'custodyOf', args: [TEST_ADDRESS] }
  ]));

  // Test Dividend Pool
  results.push(await testContract('Dividend Pool', SSS_CONTRACTS.dividendPool, SSS_MOCK_POOL_ABI, [
    { name: 'getTotalUnits' },
    { name: 'getUnits', args: [TEST_ADDRESS] }
  ]));

  // Test Stream Modulator - Basic contract existence check
  console.log(`\n🔍 Testing Stream Modulator at ${SSS_CONTRACTS.streamModulator}`);
  try {
    const code = await client.getBytecode({ address: SSS_CONTRACTS.streamModulator as `0x${string}` });
    const streamModResult: TestResult = {
      contract: 'Stream Modulator',
      address: SSS_CONTRACTS.streamModulator,
      success: code && code !== '0x',
      results: { bytecodeExists: code && code !== '0x' }
    };
    console.log(`  └─ ${streamModResult.success ? '✅' : '❌'} Contract deployed: ${streamModResult.success}`);
    results.push(streamModResult);
  } catch (err) {
    console.log(`  └─ ❌ Failed to check: ${err instanceof Error ? err.message : String(err)}`);
    results.push({
      contract: 'Stream Modulator',
      address: SSS_CONTRACTS.streamModulator,
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  // Test Governor - Basic contract existence check
  console.log(`\n🔍 Testing Governor at ${SSS_CONTRACTS.governor}`);
  try {
    const code = await client.getBytecode({ address: SSS_CONTRACTS.governor as `0x${string}` });
    const governorResult: TestResult = {
      contract: 'Governor',
      address: SSS_CONTRACTS.governor,
      success: code && code !== '0x',
      results: { bytecodeExists: code && code !== '0x' }
    };
    console.log(`  └─ ${governorResult.success ? '✅' : '❌'} Contract deployed: ${governorResult.success}`);
    results.push(governorResult);
  } catch (err) {
    console.log(`  └─ ❌ Failed to check: ${err instanceof Error ? err.message : String(err)}`);
    results.push({
      contract: 'Governor',
      address: SSS_CONTRACTS.governor,
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  // Summary
  console.log('\n📊 Test Summary');
  console.log('===============');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total: ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed Contracts:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.contract} (${r.address}): ${r.error}`);
    });
  }

  console.log('\n🔧 Frontend Integration Status:');
  const criticalContracts = ['SSS Token', 'Staking', 'Shells', 'Dividend Pool'];
  const criticalResults = results.filter(r => criticalContracts.includes(r.contract));
  const criticalSuccess = criticalResults.every(r => r.success);
  
  if (criticalSuccess) {
    console.log('✅ All critical contracts are responding - frontend should work!');
  } else {
    console.log('❌ Some critical contracts are failing - frontend may have issues');
    criticalResults.filter(r => !r.success).forEach(r => {
      console.log(`  - Critical failure: ${r.contract}`);
    });
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});