'use client';

import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

const ACCENT = '#2dd4bf';

const SUPPORTED_CHAINS = [
  {
    name: 'Base',
    tag: 'Primary',
    status: 'live' as const,
    method: 'Native verification',
    description: 'Root chain where all SSS attestations originate. Verify directly on-chain with zero bridging cost.',
    color: '#0052FF',
  },
  {
    name: 'Ethereum Mainnet',
    tag: 'Merkle Bridge',
    status: 'live' as const,
    method: 'Merkle bridge',
    description: 'Submit Merkle proofs to verify Base attestations on L1. Gas-optimized calldata for minimal cost.',
    color: '#627EEA',
  },
  {
    name: 'Arbitrum',
    tag: 'Merkle Bridge',
    status: 'live' as const,
    method: 'Merkle bridge',
    description: 'Fast finality verification via Arbitrum\'s optimistic rollup. Sub-cent proof submission costs.',
    color: '#28A0F0',
  },
  {
    name: 'Optimism',
    tag: 'Merkle Bridge',
    status: 'live' as const,
    method: 'Merkle bridge',
    description: 'Superchain-native verification through OP Stack compatibility. Batch proofs for efficiency.',
    color: '#FF0420',
  },
  {
    name: 'Polygon',
    tag: 'Coming Soon',
    status: 'soon' as const,
    method: 'Coming soon',
    description: 'Polygon PoS support is under development. Bridge contracts are in audit.',
    color: '#8247E5',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Verify on Base',
    description: 'Complete your SSS agent verification on Base. Your attestation is recorded on-chain and included in the next Merkle root update.',
  },
  {
    number: '02',
    title: 'Generate Proof',
    description: 'Request a Merkle inclusion proof for your attestation. The proof is a compact set of hashes that cryptographically link your record to the published root.',
  },
  {
    number: '03',
    title: 'Submit to Target Chain',
    description: 'Call the verifier contract on any supported chain with your proof. The contract validates the Merkle path and confirms your attestation status.',
  },
];

const BENEFITS = [
  {
    title: 'Single Verification Cost',
    description: 'Pay for verification once on Base. Cross-chain proofs only cost the gas to submit — no repeated verification fees.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: 'Instant Cross-Chain',
    description: 'No waiting for bridge finality. Merkle proofs are verified purely on-chain against the published root — submit and confirm in one transaction.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Gas-Optimized Proofs',
    description: 'Proofs use compressed calldata and batch-friendly encoding. Typical verification costs under $0.01 on L2s and under $0.50 on Ethereum mainnet.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const VERIFICATION_CODE = `// Verify an SSS cross-chain attestation
import { SSSVerifier__factory } from "@sss/contracts";
import { ethers } from "ethers";

const VERIFIER_ADDRESSES = {
  ethereum: "0x1a2B...Cd3E",
  arbitrum: "0x4f5A...Bc6D",
  optimism: "0x7e8F...Ab9C",
};

async function verifyCrossChain(
  chainName: "ethereum" | "arbitrum" | "optimism",
  agentAddress: string,
  attestationId: bytes32,
  merkleProof: bytes32[]
) {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[chainName]);
  const verifier = SSSVerifier__factory.connect(
    VERIFIER_ADDRESSES[chainName],
    provider
  );

  const isValid = await verifier.verifyAttestation(
    agentAddress,
    attestationId,
    merkleProof
  );

  console.log(\`Attestation valid on \${chainName}: \${isValid}\`);
  return isValid;
}`;

export default function CrossChainAttestationsPage() {
  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="hero" style={{ '--hero-accent': ACCENT } as React.CSSProperties}>
        <div
          className="container hero-shell"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="section-label" style={{ color: ACCENT }}>
            {'// Cross-Chain Attestations'}
          </div>
          <h1 style={{ color: ACCENT, textShadow: `0 0 30px rgba(45,212,191,.3), 2px 2px 0 #000` }}>
            Cross-Chain Attestations
          </h1>
          <p className="tagline">Your Verification, Everywhere</p>
          <p className="subtitle">
            SSS attestations can be verified on any EVM chain via Merkle proofs.
            Verify once on Base, prove anywhere — no repeated costs, no waiting.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 18px',
              border: `1px solid rgba(45,212,191,.45)`,
              background: `linear-gradient(180deg, rgba(45,212,191,.18), rgba(20,20,22,.92))`,
              boxShadow: `0 0 30px rgba(45,212,191,.22), inset 0 0 20px rgba(45,212,191,.08)`,
              fontFamily: 'var(--mono)',
              textTransform: 'uppercase' as const,
              letterSpacing: '.08em',
              fontSize: '.78rem',
              color: ACCENT,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            4 chains live&ensp;·&ensp;1 coming soon
          </div>
        </div>
        {/* Override hero glow color */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(45,212,191,.10) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      </section>

      {/* Supported Chains */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Supported Networks'}</div>
          <h2>
            Chains <span style={{ color: ACCENT }}>supported</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            Generate a Merkle proof from your Base attestation and verify it on any of these networks.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <div
                key={chain.name}
                className="group border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:bg-[var(--surface2)]"
                style={{ borderLeftWidth: 3, borderLeftColor: chain.color }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: chain.color }}
                    >
                      {chain.name[0]}
                    </div>
                    <span className="font-[var(--font-heading)] text-lg uppercase text-[var(--text)]">
                      {chain.name}
                    </span>
                  </div>
                  <span
                    className="inline-block border px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
                    style={{
                      color: chain.status === 'live' ? ACCENT : 'var(--muted)',
                      borderColor: chain.status === 'live' ? `rgba(45,212,191,.3)` : 'var(--border)',
                      background: chain.status === 'live' ? `rgba(45,212,191,.1)` : 'transparent',
                    }}
                  >
                    {chain.tag}
                  </span>
                </div>
                <p className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {chain.method}
                </p>
                <p className="text-[var(--muted)] text-sm">{chain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* How It Works */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// How It Works'}</div>
          <h2>
            Three steps to <span style={{ color: ACCENT }}>cross-chain</span> proof
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            From a single Base verification to portable proof on any supported chain.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative border border-[var(--border)] bg-[var(--surface)] p-6">
                <div
                  className="mb-4 font-[var(--font-heading)] text-4xl uppercase leading-none"
                  style={{ color: ACCENT, opacity: 0.3 }}
                >
                  {step.number}
                </div>
                <h3 className="mb-3 font-[var(--font-heading)] text-xl uppercase text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="text-[var(--muted)] text-sm">{step.description}</p>
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block"
                    style={{ color: ACCENT, fontSize: '1.5rem', zIndex: 2 }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Benefits */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Benefits'}</div>
          <h2>
            Why <span style={{ color: ACCENT }}>cross-chain</span> attestations
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            Portable proofs reduce cost, increase reach, and eliminate redundant verification.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[rgba(45,212,191,.3)] hover:bg-[var(--surface2)]"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="mb-3 font-[var(--font-heading)] text-lg uppercase text-[var(--text)]">
                  {benefit.title}
                </h3>
                <p className="text-[var(--muted)] text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Code Snippet */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Integration'}</div>
          <h2>
            Verify in <span style={{ color: ACCENT }}>code</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 24 }}>
            Call the verifier contract on any supported chain with a Merkle proof.
          </p>

          <div className="border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div
              className="flex items-center gap-2 px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ borderBottom: '1px solid var(--border)', color: ACCENT }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              verify-cross-chain.ts
            </div>
            <pre
              className="overflow-x-auto p-6 font-mono text-[0.78rem] leading-relaxed"
              style={{ color: 'var(--text)', background: 'var(--surface2)' }}
            >
              <code>{VERIFICATION_CODE}</code>
            </pre>
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn className="pb-24">
        <div className="container">
          <div
            className="border p-8 text-center md:p-12"
            style={{
              borderColor: `rgba(45,212,191,.25)`,
              background: `linear-gradient(180deg, rgba(45,212,191,.08), rgba(14,14,16,.98))`,
            }}
          >
            <h2 className="mb-4 font-[var(--font-heading)] text-2xl uppercase text-[var(--text)] md:text-3xl">
              Ready to go <span style={{ color: ACCENT }}>cross-chain</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-[var(--muted)]">
              Generate a Merkle proof for your existing Base attestation and verify it on any supported network in a single transaction.
            </p>
            <button
              className="rounded-full px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-black transition hover:shadow-[0_0_24px_rgba(45,212,191,0.35)]"
              style={{ background: ACCENT }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#14b8a6')}
              onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
            >
              Generate Attestation Proof
            </button>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
