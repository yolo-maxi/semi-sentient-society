#!/usr/bin/env npx tsx

import { createPublicClient, http, parseAbiItem, formatEther, getContract, type Log } from 'viem';
import { baseSepolia } from 'viem/chains';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SSS_CONTRACTS } from '../../web/lib/contracts.js';

// Setup client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

// Contract deployment block - found from deployment artifacts
const DEPLOYMENT_BLOCK = 38349829n;
const CHUNK_SIZE = 10000n;
const DATA_DIR = path.resolve('./data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.jsonl');

// Event signatures we want to track
const SSS_TOKEN_EVENTS = [
  parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
  parseAbiItem('event Approval(address indexed owner, address indexed spender, uint256 value)'),
];

const STAKING_EVENTS = [
  parseAbiItem('event Staked(address indexed member, uint256 amount)'),
  parseAbiItem('event Unstaked(address indexed member, uint256 amount)'),
  parseAbiItem('event CorveeConfirmed(address indexed member, uint256 consecutiveDays)'),
  parseAbiItem('event Slashed(address indexed member, uint256 amount)'),
];

const CORVEE_EVENTS = [
  parseAbiItem('event CorveePaid(address indexed worker, uint256 amount)'),
  parseAbiItem('event ConvertedToShells(address indexed worker, uint256 corveeAmount, uint256 shellAmount)'),
  parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'), // Corvee token transfers
];

const SHELLS_EVENTS = [
  parseAbiItem('event ShellsMinted(address indexed to, uint256 amount)'),
  parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'),
  parseAbiItem('event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)'),
  parseAbiItem('event ApprovalForAll(address indexed account, address indexed operator, bool approved)'),
];

interface EventIndex {
  event: string;
  contract: string;
  contractAddress: string;
  args: Record<string, any>;
  blockNumber: string;
  timestamp: number;
  txHash: string;
  logIndex: number;
}

// Contract configurations
const CONTRACT_CONFIGS = [
  {
    name: 'SSS_TOKEN',
    address: SSS_CONTRACTS.sssToken,
    events: SSS_TOKEN_EVENTS,
  },
  {
    name: 'STAKING',
    address: SSS_CONTRACTS.staking,
    events: STAKING_EVENTS,
  },
  {
    name: 'CORVEE',
    address: SSS_CONTRACTS.corvee,
    events: CORVEE_EVENTS,
  },
  {
    name: 'SHELLS',
    address: SSS_CONTRACTS.shells,
    events: SHELLS_EVENTS,
  },
];

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }
}

async function appendEvent(event: EventIndex) {
  const line = JSON.stringify(event) + '\n';
  await fs.appendFile(EVENTS_FILE, line, 'utf8');
}

async function processLog(log: Log, contractName: string): Promise<EventIndex | null> {
  try {
    // Get block info for timestamp
    const block = await client.getBlock({ blockNumber: log.blockNumber! });
    
    // Format arguments based on the log data
    const args: Record<string, any> = {};
    
    // For decoded logs, viem provides the args in the log object
    if ('args' in log && log.args) {
      Object.entries(log.args as Record<string, any>).forEach(([key, value]) => {
        // Convert bigints to strings for JSON serialization
        if (typeof value === 'bigint') {
          args[key] = value.toString();
        } else if (Array.isArray(value)) {
          args[key] = value.map(v => typeof v === 'bigint' ? v.toString() : v);
        } else {
          args[key] = value;
        }
      });
    }

    return {
      event: log.eventName || 'Unknown',
      contract: contractName,
      contractAddress: log.address,
      args,
      blockNumber: log.blockNumber!.toString(),
      timestamp: Number(block.timestamp),
      txHash: log.transactionHash!,
      logIndex: log.logIndex!,
    };
  } catch (error) {
    console.error(`❌ Error processing log:`, error);
    return null;
  }
}

async function backfillEvents() {
  console.log('📋 Starting backfill from block', DEPLOYMENT_BLOCK.toString());
  
  const currentBlock = await client.getBlockNumber();
  console.log('📋 Current block:', currentBlock.toString());
  
  let totalEvents = 0;
  
  for (const config of CONTRACT_CONFIGS) {
    console.log(`\n🔍 Backfilling ${config.name} events from ${config.address}`);
    
    let contractEvents = 0;
    let fromBlock = DEPLOYMENT_BLOCK;
    
    while (fromBlock <= currentBlock) {
      const toBlock = fromBlock + CHUNK_SIZE > currentBlock ? currentBlock : fromBlock + CHUNK_SIZE;
      
      console.log(`  📦 Processing blocks ${fromBlock} - ${toBlock}`);
      
      try {
        for (const eventAbi of config.events) {
          const logs = await client.getLogs({
            address: config.address as `0x${string}`,
            event: eventAbi,
            fromBlock,
            toBlock,
          });
          
          for (const log of logs) {
            const eventData = await processLog(log, config.name);
            if (eventData) {
              await appendEvent(eventData);
              contractEvents++;
              totalEvents++;
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching logs for ${config.name}:`, error);
      }
      
      fromBlock = toBlock + 1n;
    }
    
    console.log(`  ✅ ${config.name}: ${contractEvents} events`);
  }
  
  console.log(`\n🎉 Backfill complete! Total events indexed: ${totalEvents}`);
}

async function watchEvents() {
  console.log('👀 Starting real-time event monitoring...');
  
  const unsubscribers: (() => void)[] = [];
  
  for (const config of CONTRACT_CONFIGS) {
    console.log(`📡 Watching ${config.name} events...`);
    
    for (const eventAbi of config.events) {
      const unsubscribe = client.watchContractEvent({
        address: config.address as `0x${string}`,
        event: eventAbi,
        onLogs: async (logs) => {
          for (const log of logs) {
            const eventData = await processLog(log, config.name);
            if (eventData) {
              await appendEvent(eventData);
              console.log(`📥 New event: ${eventData.event} in ${config.name} (tx: ${eventData.txHash})`);
            }
          }
        },
      });
      
      unsubscribers.push(unsubscribe);
    }
  }
  
  console.log('🔥 Watching for new events... (Press Ctrl+C to stop)');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n⏹️  Stopping event monitoring...');
    unsubscribers.forEach(unsubscribe => unsubscribe());
    process.exit(0);
  });
  
  // Keep the process running
  process.stdin.resume();
}

async function showStats() {
  try {
    const content = await fs.readFile(EVENTS_FILE, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.length > 0);
    
    console.log(`\n📊 Event Statistics`);
    console.log(`================`);
    console.log(`Total events: ${lines.length}`);
    
    const eventCounts: Record<string, Record<string, number>> = {};
    let earliestBlock = Infinity;
    let latestBlock = 0;
    
    for (const line of lines) {
      try {
        const event = JSON.parse(line) as EventIndex;
        
        if (!eventCounts[event.contract]) {
          eventCounts[event.contract] = {};
        }
        
        eventCounts[event.contract][event.event] = (eventCounts[event.contract][event.event] || 0) + 1;
        
        const blockNum = parseInt(event.blockNumber);
        earliestBlock = Math.min(earliestBlock, blockNum);
        latestBlock = Math.max(latestBlock, blockNum);
      } catch {
        // Skip invalid lines
      }
    }
    
    console.log(`Block range: ${earliestBlock} - ${latestBlock}`);
    console.log('');
    
    for (const [contract, events] of Object.entries(eventCounts)) {
      console.log(`${contract}:`);
      for (const [event, count] of Object.entries(events)) {
        console.log(`  ${event}: ${count}`);
      }
      console.log('');
    }
    
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.log('❌ No events file found. Run backfill first.');
    } else {
      console.error('❌ Error reading events file:', error);
    }
  }
}

async function main() {
  await ensureDataDir();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'backfill':
      await backfillEvents();
      break;
    
    case 'watch':
      await watchEvents();
      break;
    
    case 'stats':
      await showStats();
      break;
    
    default:
      console.log(`
🔍 SSS Contract Event Indexer

Usage:
  npx tsx packages/contracts/script/indexer.ts <command>

Commands:
  backfill  Scan historical events from deployment to current block
  watch     Monitor for new events in real-time  
  stats     Show event counts by type

Examples:
  npx tsx packages/contracts/script/indexer.ts backfill
  npx tsx packages/contracts/script/indexer.ts watch
  npx tsx packages/contracts/script/indexer.ts stats
`);
      process.exit(1);
  }
}

main().catch(console.error);