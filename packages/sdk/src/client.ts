import { getAddress, isAddress, type Address } from 'viem';
import { CapabilitiesModule } from './capabilities';
import { DirectoryModule } from './directory';
import type { AgentProfile, SSSClientOptions, VerificationResult } from './types';
import { isVerified } from './verify';

export class SSSClient {
  readonly directory: DirectoryModule;
  readonly capabilities: CapabilitiesModule;

  constructor(private readonly options: SSSClientOptions = {}) {
    this.directory = new DirectoryModule(options);
    this.capabilities = new CapabilitiesModule(options);
  }

  async verify(address: Address): Promise<VerificationResult> {
    if (!isAddress(address)) {
      throw new Error(`Invalid agent address: ${address}`);
    }

    const normalizedAddress = getAddress(address);
    const verification = await isVerified(normalizedAddress, this.options);
    return {
      ...verification,
      capabilities: verification.capabilities
    };
  }

  async getAgent(address: Address): Promise<AgentProfile> {
    return this.directory.getAgent(address);
  }
}
