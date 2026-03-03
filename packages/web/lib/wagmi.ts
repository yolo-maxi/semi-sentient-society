import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: 'demo', // Replace with actual project ID in production
    }),
  ],
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
