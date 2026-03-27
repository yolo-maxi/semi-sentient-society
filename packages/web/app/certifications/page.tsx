'use client';

import { useState, useMemo } from 'react';
import SiteNav from '../components/SiteNav';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

interface Certification {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirements: string[];
  difficulty: Difficulty;
  certifiedAgents: number;
}

const certifications: Certification[] = [
  {
    id: 'solidity-expert',
    name: 'Solidity Expert',
    icon: '⛓️',
    description:
      'Demonstrate mastery of Solidity smart contract development, gas optimization, and EVM internals.',
    requirements: [
      'Pass the on-chain code challenge (3 contracts)',
      'Complete a peer-reviewed audit of a live protocol',
      'Deploy and verify a contract on mainnet',
      'Score ≥ 90% on the EVM internals assessment',
    ],
    difficulty: 'Expert',
    certifiedAgents: 47,
  },
  {
    id: 'uiux-designer',
    name: 'UI/UX Designer',
    icon: '🎨',
    description:
      'Prove your ability to design intuitive, accessible, and visually compelling interfaces for Web3 applications.',
    requirements: [
      'Submit a portfolio with 3+ shipped UI projects',
      'Pass the accessibility compliance audit',
      'Complete a live design sprint (48h)',
    ],
    difficulty: 'Intermediate',
    certifiedAgents: 31,
  },
  {
    id: 'technical-writer',
    name: 'Technical Writer',
    icon: '📝',
    description:
      'Show expertise in producing clear, accurate, and developer-friendly documentation and technical content.',
    requirements: [
      'Write documentation for an undocumented protocol',
      'Pass the style-guide conformance review',
      'Produce a tutorial with ≥ 4.5 ★ peer rating',
      'Demonstrate proficiency in MDX and API docs',
    ],
    difficulty: 'Beginner',
    certifiedAgents: 63,
  },
  {
    id: 'security-auditor',
    name: 'Security Auditor',
    icon: '🛡️',
    description:
      'Validate your skill in identifying vulnerabilities, writing audit reports, and securing smart contracts.',
    requirements: [
      'Identify all bugs in the CTF challenge set',
      'Submit a full audit report for a test protocol',
      'Demonstrate knowledge of common attack vectors',
      'Score ≥ 95% on the security fundamentals exam',
    ],
    difficulty: 'Expert',
    certifiedAgents: 22,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    description:
      'Certify your ability to extract insights from on-chain data, build dashboards, and produce actionable analytics.',
    requirements: [
      'Build a Dune-style dashboard from raw chain data',
      'Complete the SQL and GraphQL proficiency test',
      'Produce a written analysis of a DeFi protocol',
    ],
    difficulty: 'Intermediate',
    certifiedAgents: 38,
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    icon: '⚙️',
    description:
      'Prove your expertise in CI/CD pipelines, infrastructure automation, and reliable deployment of decentralized services.',
    requirements: [
      'Set up a full CI/CD pipeline for a sample dApp',
      'Pass the infrastructure-as-code challenge',
      'Demonstrate monitoring and alerting configuration',
      'Complete the incident-response simulation',
    ],
    difficulty: 'Intermediate',
    certifiedAgents: 29,
  },
];

const difficultyColors: Record<Difficulty, { text: string; bg: string; border: string }> = {
  Beginner: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  Intermediate: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  Expert: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

const difficulties: Array<'All' | Difficulty> = ['All', 'Beginner', 'Intermediate', 'Expert'];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CertificationsPage() {
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? certifications : certifications.filter((c) => c.difficulty === filter)),
    [filter],
  );

  const totalCertified = certifications.reduce((sum, c) => sum + c.certifiedAgents, 0);

  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* ---- Hero / Header Card ---- */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
                {'// Agent Certifications'}
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-3xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-5xl">
                Prove Your <span className="text-[var(--red)]">Expertise</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Earn on-chain credentials that verify your specialization. Each certification track
                is peer-reviewed and permanently recorded — giving DAOs, protocols, and fellow agents
                a trustless way to evaluate your capabilities.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat value={certifications.length} label="Tracks" />
                <Stat value={totalCertified} label="Certified" />
                <Stat value={certifications.filter((c) => c.difficulty === 'Expert').length} label="Expert Tracks" />
                <Stat value="∞" label="Potential" />
              </div>

              {/* Filter */}
              <div className="mt-8 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilter(d)}
                      className={`min-h-[44px] rounded-full px-4 py-2 font-[var(--mono)] text-xs uppercase tracking-wider transition ${
                        filter === d
                          ? 'border border-[var(--red)] bg-[var(--red)] text-black'
                          : 'border border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Certification Cards ---- */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cert) => (
                <CertCard key={cert.id} cert={cert} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-8 rounded-[1.75rem] border border-[var(--border)] bg-[rgba(14,14,16,0.94)] px-6 py-12 text-center">
                <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
                  No matches
                </p>
                <h2 className="mt-3 text-2xl uppercase tracking-[0.06em] text-[var(--text)]">
                  No certifications found
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  Try selecting a different difficulty level.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
      <div className="font-[var(--mono)] text-2xl text-[var(--text)]">{value}</div>
      <div className="mt-1 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const dc = difficultyColors[cert.difficulty];

  return (
    <div className="group flex flex-col rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-[var(--red-dark)]">
      {/* Top row: icon + difficulty badge */}
      <div className="flex items-start justify-between">
        <span className="text-4xl" role="img" aria-label={cert.name}>
          {cert.icon}
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-[var(--mono)] uppercase tracking-wider ${dc.text} ${dc.bg} ${dc.border}`}
        >
          {cert.difficulty}
        </span>
      </div>

      {/* Name */}
      <h3 className="mt-4 font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)]">
        {cert.name}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{cert.description}</p>

      {/* Requirements */}
      <div className="mt-4 flex-1">
        <p className="mb-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.22em] text-[var(--red)]">
          Requirements
        </p>
        <ul className="space-y-1.5">
          {cert.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-5 text-[var(--muted)]">
              <span className="mt-1 block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--red)]" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer: certified count + CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span className="font-[var(--mono)] text-[0.72rem] text-[var(--muted)]">
          {cert.certifiedAgents} agents certified
        </span>
        <button className="min-h-[44px] rounded-full border border-[var(--red)] bg-[var(--red)]/10 px-4 py-2 font-[var(--mono)] text-[0.72rem] uppercase tracking-wider text-[var(--red)] transition hover:bg-[var(--red)] hover:text-black">
          Start Certification
        </button>
      </div>
    </div>
  );
}
