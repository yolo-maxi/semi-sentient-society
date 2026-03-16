import { getAddress, isAddress, type Address, type Hash } from 'viem';
import type { Signer, SSSClientOptions } from './types';
import { resolvePublicClient, resolveRequiredContracts } from './verify';

const CAPABILITIES_WRITE_ABI = [
  {
    type: 'function',
    name: 'getCapabilities',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }]
  },
  {
    type: 'function',
    name: 'setCapabilities',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'capabilities', type: 'string[]' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'addCapability',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'capability', type: 'string' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'removeCapability',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'capability', type: 'string' }],
    outputs: []
  }
] as const;

export class CapabilitiesModule {
  constructor(private readonly options: SSSClientOptions) {}

  private getSignerAccount(signer: Signer) {
    if (!signer.account) {
      throw new Error('Signer account is required for capability writes.');
    }

    return signer.account;
  }

  async get(address: Address): Promise<string[]> {
    if (!isAddress(address)) {
      throw new Error(`Invalid agent address: ${address}`);
    }

    const publicClient = resolvePublicClient(this.options);
    const contracts = resolveRequiredContracts(this.options, ['capabilities']);

    const capabilities = await publicClient.readContract({
      address: contracts.capabilities,
      abi: CAPABILITIES_WRITE_ABI,
      functionName: 'getCapabilities',
      args: [getAddress(address)]
    });

    return [...capabilities];
  }

  async set(capabilities: string[], signer: Signer): Promise<Hash> {
    const contracts = resolveRequiredContracts(this.options, ['capabilities']);
    return signer.writeContract({
      account: this.getSignerAccount(signer),
      chain: signer.chain ?? null,
      address: contracts.capabilities,
      abi: CAPABILITIES_WRITE_ABI,
      functionName: 'setCapabilities',
      args: [capabilities]
    });
  }

  async add(capability: string, signer: Signer): Promise<Hash> {
    const contracts = resolveRequiredContracts(this.options, ['capabilities']);
    return signer.writeContract({
      account: this.getSignerAccount(signer),
      chain: signer.chain ?? null,
      address: contracts.capabilities,
      abi: CAPABILITIES_WRITE_ABI,
      functionName: 'addCapability',
      args: [capability]
    });
  }

  async remove(capability: string, signer: Signer): Promise<Hash> {
    const contracts = resolveRequiredContracts(this.options, ['capabilities']);
    return signer.writeContract({
      account: this.getSignerAccount(signer),
      chain: signer.chain ?? null,
      address: contracts.capabilities,
      abi: CAPABILITIES_WRITE_ABI,
      functionName: 'removeCapability',
      args: [capability]
    });
  }
}

export { CAPABILITIES_WRITE_ABI };
