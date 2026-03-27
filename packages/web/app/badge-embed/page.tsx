'use client';

import { useState } from 'react';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

const ACCENT = '#2dd4bf';

const SIZES = [
  { id: 'small', label: 'Small', width: 120, height: 40 },
  { id: 'medium', label: 'Medium', width: 200, height: 64 },
  { id: 'large', label: 'Large', width: 300, height: 96 },
] as const;

type SizeId = (typeof SIZES)[number]['id'];

const CODE_TABS = ['HTML', 'Markdown', 'React'] as const;
type CodeTab = (typeof CODE_TABS)[number];

function generateCode(tab: CodeTab, agentId: string): string {
  switch (tab) {
    case 'HTML':
      return `<a href="https://sss.repo.box/verify/${agentId}">\n  <img src="https://sss.repo.box/api/badge/${agentId}" alt="SSS Verified" />\n</a>`;
    case 'Markdown':
      return `[![SSS Verified](https://sss.repo.box/api/badge/${agentId})](https://sss.repo.box/verify/${agentId})`;
    case 'React':
      return `import { LobsterBadge } from '@sss/react';\n\nexport default function MyComponent() {\n  return <LobsterBadge agentId="${agentId}" />;\n}`;
  }
}

function BadgePreview({
  size,
  theme,
  showDate,
}: {
  size: (typeof SIZES)[number];
  theme: 'dark' | 'light';
  showDate: boolean;
}) {
  const bg = theme === 'dark' ? '#0e0e10' : '#fcf7ef';
  const textColor = theme === 'dark' ? '#d4d0c8' : '#2e2219';
  const mutedColor = theme === 'dark' ? '#9a8f7f' : '#746455';
  const scale = size.width / 200;
  const fontSize = Math.max(10, 13 * scale);
  const dateFontSize = Math.max(8, 10 * scale);
  const lobsterSize = Math.max(16, 28 * scale);
  const padding = Math.max(6, 10 * scale);
  const borderRadius = Math.max(4, 6 * scale);
  const borderWidth = Math.max(1, 1.5 * scale);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: padding,
        padding: `${padding}px ${padding * 1.6}px`,
        border: `${borderWidth}px solid ${ACCENT}`,
        borderRadius,
        background: bg,
        boxShadow: `0 0 ${12 * scale}px rgba(45,212,191,.2), inset 0 0 ${8 * scale}px rgba(45,212,191,.05)`,
        width: size.width,
        height: size.height,
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: lobsterSize, lineHeight: 1, flexShrink: 0 }}>🦞</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: '.04em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          SSS Verified
        </span>
        {showDate && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: dateFontSize,
              color: mutedColor,
              letterSpacing: '.02em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            Since Mar 2025
          </span>
        )}
      </span>
    </div>
  );
}

export default function BadgeEmbedPage() {
  const [selectedSize, setSelectedSize] = useState<SizeId>('medium');
  const [codeTab, setCodeTab] = useState<CodeTab>('HTML');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [badgeTheme, setBadgeTheme] = useState<'dark' | 'light'>('dark');
  const [showDate, setShowDate] = useState(true);
  const [agentId, setAgentId] = useState('AGENT_ID');

  const currentSize = SIZES.find((s) => s.id === selectedSize)!;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(key);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="hero" style={{ '--hero-accent': ACCENT } as React.CSSProperties}>
        <div className="container hero-shell" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ color: ACCENT }}>
            {'// Badge Embed'}
          </div>
          <h1 style={{ color: ACCENT, textShadow: `0 0 30px rgba(45,212,191,.3), 2px 2px 0 #000` }}>
            Lobster Verified Badge
          </h1>
          <p className="tagline">Show the World You&apos;re Verified</p>
          <p className="subtitle">
            Embed your SSS verification badge on any website, README, or app.
            Prove your agent identity with a single line of code.
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
            Embed anywhere&ensp;·&ensp;Auto-updates
          </div>
        </div>
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

      {/* Live Badge Preview */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Live Preview'}</div>
          <h2>
            Your <span style={{ color: ACCENT }}>badge</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            See how the Lobster Verified badge looks at different sizes. Toggle between variants below.
          </p>

          {/* Size Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                style={{
                  padding: '8px 18px',
                  border: `1px solid ${selectedSize === size.id ? ACCENT : 'var(--border)'}`,
                  background: selectedSize === size.id ? 'rgba(45,212,191,.12)' : 'var(--surface)',
                  color: selectedSize === size.id ? ACCENT : 'var(--muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: '.75rem',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                {size.label} ({size.width}px)
              </button>
            ))}
          </div>

          {/* Badge Preview Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 160,
              padding: 32,
              border: '1px solid var(--border)',
              background: badgeTheme === 'dark'
                ? 'repeating-conic-gradient(rgba(255,255,255,.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px'
                : 'repeating-conic-gradient(rgba(0,0,0,.04) 0% 25%, rgba(255,255,255,.9) 0% 50%) 0 0 / 20px 20px',
              backgroundColor: badgeTheme === 'dark' ? '#0a0a0c' : '#f4efe5',
            }}
          >
            <BadgePreview size={currentSize} theme={badgeTheme} showDate={showDate} />
          </div>
        </div>
      </FadeIn>

      {/* Code Snippets */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Embed Code'}</div>
          <h2>
            Get the <span style={{ color: ACCENT }}>code</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 24 }}>
            Copy the snippet for your platform. Replace AGENT_ID with your agent&apos;s address or identifier.
          </p>

          {/* Agent ID Input */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--mono)',
                fontSize: '.7rem',
                letterSpacing: '.14em',
                textTransform: 'uppercase' as const,
                color: 'var(--muted)',
                marginBottom: 8,
              }}
            >
              Agent ID / Address
            </label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="0x... or AGENT_ID"
              style={{
                width: '100%',
                maxWidth: 480,
                padding: '10px 14px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontFamily: 'var(--mono)',
                fontSize: '.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
            {CODE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setCodeTab(tab)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderBottom: `2px solid ${codeTab === tab ? ACCENT : 'transparent'}`,
                  background: codeTab === tab ? 'rgba(45,212,191,.06)' : 'transparent',
                  color: codeTab === tab ? ACCENT : 'var(--muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: '.75rem',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div
            style={{
              position: 'relative',
              border: '1px solid var(--border)',
              borderTop: 'none',
              background: 'var(--surface2)',
            }}
          >
            <button
              onClick={() => copyToClipboard(generateCode(codeTab, agentId), codeTab)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: '6px 14px',
                border: `1px solid ${copiedTab === codeTab ? 'rgba(74,222,128,.4)' : 'var(--border)'}`,
                background: copiedTab === codeTab ? 'rgba(74,222,128,.1)' : 'var(--surface)',
                color: copiedTab === codeTab ? '#4ade80' : 'var(--muted)',
                fontFamily: 'var(--mono)',
                fontSize: '.7rem',
                letterSpacing: '.1em',
                textTransform: 'uppercase' as const,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {copiedTab === codeTab ? 'Copied!' : 'Copy'}
            </button>
            <pre
              style={{
                padding: '20px 24px',
                paddingRight: 100,
                margin: 0,
                overflow: 'auto',
                fontFamily: 'var(--mono)',
                fontSize: '.8rem',
                lineHeight: 1.7,
                color: 'var(--text)',
              }}
            >
              <code>{generateCode(codeTab, agentId)}</code>
            </pre>
          </div>
        </div>
      </FadeIn>

      {/* Customize */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Customize'}</div>
          <h2>
            Make it <span style={{ color: ACCENT }}>yours</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            Toggle badge options to match your site&apos;s design.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Theme Toggle */}
            <div
              className="border border-[var(--border)] bg-[var(--surface)] p-6"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <h3
                style={{
                  fontFamily: 'var(--heading)',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  letterSpacing: '.02em',
                }}
              >
                Badge Theme
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBadgeTheme(t)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: `1px solid ${badgeTheme === t ? ACCENT : 'var(--border)'}`,
                      background: badgeTheme === t ? 'rgba(45,212,191,.1)' : 'var(--surface2)',
                      color: badgeTheme === t ? ACCENT : 'var(--muted)',
                      fontFamily: 'var(--mono)',
                      fontSize: '.75rem',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase' as const,
                      cursor: 'pointer',
                      transition: 'all .2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <span>{t === 'dark' ? '🌙' : '☀️'}</span>
                    {t} mode
                  </button>
                ))}
              </div>
            </div>

            {/* Show/Hide Date Toggle */}
            <div
              className="border border-[var(--border)] bg-[var(--surface)] p-6"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <h3
                style={{
                  fontFamily: 'var(--heading)',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  letterSpacing: '.02em',
                }}
              >
                Verification Date
              </h3>
              <button
                onClick={() => setShowDate(!showDate)}
                style={{
                  padding: '12px 16px',
                  border: `1px solid ${showDate ? ACCENT : 'var(--border)'}`,
                  background: showDate ? 'rgba(45,212,191,.1)' : 'var(--surface2)',
                  color: showDate ? ACCENT : 'var(--muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: '.75rem',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    background: showDate ? ACCENT : 'var(--border)',
                    position: 'relative',
                    transition: 'background .2s',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: showDate ? 18 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: showDate ? '#fff' : 'var(--muted)',
                      transition: 'left .2s',
                    }}
                  />
                </span>
                {showDate ? 'Showing verification date' : 'Date hidden'}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Example Integration Preview */}
      <FadeIn>
        <div className="container">
          <div className="section-label" style={{ color: ACCENT }}>{'// Example Integration'}</div>
          <h2>
            In the <span style={{ color: ACCENT }}>wild</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>
            Here&apos;s how the badge looks embedded in a real README or profile page.
          </p>

          {/* Mock README */}
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              overflow: 'hidden',
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface2)',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <span
                style={{
                  marginLeft: 12,
                  fontFamily: 'var(--mono)',
                  fontSize: '.7rem',
                  color: 'var(--muted)',
                  letterSpacing: '.06em',
                }}
              >
                README.md
              </span>
            </div>

            {/* Mock content */}
            <div style={{ padding: '24px 28px' }}>
              <div
                style={{
                  fontFamily: 'var(--heading)',
                  fontSize: '1.4rem',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: 8,
                }}
              >
                🤖 My Autonomous Agent
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: 16, lineHeight: 1.7 }}>
                A fully autonomous AI agent for DeFi operations, governance participation, and cross-chain messaging.
              </p>

              {/* Embedded Badge */}
              <div style={{ marginBottom: 20 }}>
                <BadgePreview size={SIZES[1]} theme={badgeTheme} showDate={showDate} />
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['TypeScript', 'Solidity', 'LangChain'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 10px',
                      border: '1px solid var(--border)',
                      fontFamily: 'var(--mono)',
                      fontSize: '.65rem',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Features & CTA */}
      <FadeIn className="pb-24">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3" style={{ marginBottom: 48 }}>
            {[
              { icon: '🔄', title: 'Auto-Updates', desc: 'Badge reflects real-time verification status from the SSS registry.' },
              { icon: '🎨', title: 'Customizable', desc: 'Light/dark themes, size variants, and optional verification date display.' },
              { icon: '⚡', title: 'Fast & Cached', desc: 'CDN-cached SVG badges load in under 100ms with 5-minute refresh.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[rgba(45,212,191,.3)] hover:bg-[var(--surface2)]"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{feature.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--heading)',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    marginBottom: 8,
                    letterSpacing: '.02em',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="border p-8 text-center md:p-12"
            style={{
              borderColor: 'rgba(45,212,191,.25)',
              background: 'linear-gradient(180deg, rgba(45,212,191,.08), rgba(14,14,16,.98))',
            }}
          >
            <h2 className="mb-4 font-[var(--font-heading)] text-2xl uppercase text-[var(--text)] md:text-3xl">
              Ready to show your <span style={{ color: ACCENT }}>verification</span>?
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto 24px' }}>
              Get verified through the SSS registry, then embed your badge anywhere to prove your agent identity on-chain.
            </p>
            <a
              href="/verify"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 44,
                padding: '14px 36px',
                background: ACCENT,
                color: '#000',
                fontFamily: 'var(--mono)',
                fontSize: '.76rem',
                fontWeight: 600,
                letterSpacing: '.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all .3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#14b8a6';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(45,212,191,0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Verified
            </a>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
