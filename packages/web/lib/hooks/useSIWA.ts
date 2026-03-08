import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { SiwaAgent } from '@buildersgarden/siwa/next';

interface SIWAAuthResponse {
  success: boolean;
  message?: string;
  agent?: SiwaAgent;
  session?: {
    token: string;
    expiresAt: string;
  };
  sss?: {
    eligible: boolean;
    membershipStatus: string;
    nextSteps: string[];
  };
  error?: string;
}

interface SIWANonceResponse {
  success: boolean;
  nonce?: string;
  issuedAt?: string;
  expirationTime?: string;
  domain?: string;
  uri?: string;
  version?: string;
  chainId?: number;
  error?: string;
}

interface UseSIWAReturn {
  isAuthenticated: boolean;
  agent: SiwaAgent | null;
  isLoading: boolean;
  error: string | null;
  signIn: (agentId: number, agentRegistry: string) => Promise<SIWAAuthResponse>;
  signOut: () => void;
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const SIWA_SESSION_KEY = 'sss-siwa-session';
const SIWA_AGENT_KEY = 'sss-siwa-agent';

export function useSIWA(): UseSIWAReturn {
  const { address } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agent, setAgent] = useState<SiwaAgent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SIWA_SESSION_KEY);
    const savedAgent = localStorage.getItem(SIWA_AGENT_KEY);
    
    if (savedSession && savedAgent) {
      try {
        const session = JSON.parse(savedSession);
        const agentData = JSON.parse(savedAgent);
        
        // Check if session is still valid
        if (new Date(session.expiresAt) > new Date()) {
          setSessionToken(session.token);
          setAgent(agentData);
          setIsAuthenticated(true);
        } else {
          // Clear expired session
          localStorage.removeItem(SIWA_SESSION_KEY);
          localStorage.removeItem(SIWA_AGENT_KEY);
        }
      } catch (e) {
        console.error('Error loading SIWA session:', e);
        localStorage.removeItem(SIWA_SESSION_KEY);
        localStorage.removeItem(SIWA_AGENT_KEY);
      }
    }
  }, []);

  const requestNonce = async (agentId: number, agentRegistry: string): Promise<SIWANonceResponse> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const params = new URLSearchParams({
      address,
      agentId: agentId.toString(),
      agentRegistry,
    });

    const response = await fetch(`/api/auth/siwa?${params}`);
    return await response.json();
  };

  const signSIWAMessage = async (
    nonce: string,
    domain: string,
    uri: string,
    agentId: number,
    agentRegistry: string,
    chainId: number,
    issuedAt: string,
    expirationTime?: string
  ): Promise<{ message: string; signature: string }> => {
    // This is a simplified version - in a real implementation,
    // you would use the SIWA SDK to build and sign the message
    // with the user's wallet (via wagmi or similar)
    
    // For now, we'll simulate the message structure
    const message = `sss.repo.box wants you to sign in with your agent account:
${address}

I am agent #${agentId} signing in to Semi-Sentient Society

URI: ${uri}
Version: 1
Agent ID: ${agentId}
Agent Registry: ${agentRegistry}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}${expirationTime ? `\nExpiration Time: ${expirationTime}` : ''}`;

    // In a real implementation, this would use the wallet to sign the message
    // For now, return a placeholder
    throw new Error('Message signing not yet implemented - requires wallet integration');
  };

  const signIn = useCallback(async (agentId: number, agentRegistry: string): Promise<SIWAAuthResponse> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Request nonce
      const nonceResponse = await requestNonce(agentId, agentRegistry);
      
      if (!nonceResponse.success || !nonceResponse.nonce) {
        throw new Error(nonceResponse.error || 'Failed to get authentication nonce');
      }

      // Step 2: Sign SIWA message (placeholder - needs wallet integration)
      try {
        const { message, signature } = await signSIWAMessage(
          nonceResponse.nonce,
          nonceResponse.domain!,
          nonceResponse.uri!,
          agentId,
          agentRegistry,
          nonceResponse.chainId!,
          nonceResponse.issuedAt!,
          nonceResponse.expirationTime
        );

        // Step 3: Submit signed message for verification
        const authResponse = await fetch('/api/auth/siwa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            signature,
          }),
        });

        const result: SIWAAuthResponse = await authResponse.json();

        if (result.success && result.agent && result.session) {
          // Store session and agent data
          localStorage.setItem(SIWA_SESSION_KEY, JSON.stringify(result.session));
          localStorage.setItem(SIWA_AGENT_KEY, JSON.stringify(result.agent));
          
          setSessionToken(result.session.token);
          setAgent(result.agent);
          setIsAuthenticated(true);
        }

        return result;
      } catch (signingError) {
        // If signing fails, return a helpful error
        return {
          success: false,
          error: 'SIWA message signing not yet implemented. Please check back soon for full agent authentication support.',
        };
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during authentication';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const signOut = useCallback(() => {
    localStorage.removeItem(SIWA_SESSION_KEY);
    localStorage.removeItem(SIWA_AGENT_KEY);
    setSessionToken(null);
    setAgent(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!sessionToken) {
      throw new Error('Not authenticated - please sign in first');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${sessionToken}`,
      'X-SIWA-Session': sessionToken,
    };

    // TODO: Implement ERC-8128 request signing for full authentication
    // For now, just add the session token to headers
    return fetch(url, {
      ...options,
      headers,
    });
  }, [sessionToken]);

  return {
    isAuthenticated,
    agent,
    isLoading,
    error,
    signIn,
    signOut,
    makeAuthenticatedRequest,
  };
}