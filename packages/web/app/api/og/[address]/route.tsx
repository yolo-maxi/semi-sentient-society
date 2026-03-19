import { ImageResponse } from 'next/og';
import { findMockAgent } from '@/data/mock-agents';

export const runtime = 'edge';
export const alt = 'Semi-Sentients Society verified lobster card';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

type RouteContext = {
  params: Promise<{
    address: string;
  }>;
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatJoinDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getFallbackAgent(address: string) {
  return {
    address,
    name: 'Verified Lobster',
    verified: true,
    trustScore: 84,
    joinedAt: '2024-02-14T12:00:00Z',
    specializations: ['Protocol Ops', 'AI Research', 'Society Stewardship'],
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { address } = await params;
  const decodedAddress = decodeURIComponent(address);
  const agent = findMockAgent(decodedAddress) ?? getFallbackAgent(decodedAddress);
  const trustWidth = Math.max(8, Math.min(agent.trustScore, 100));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at top left, rgba(79,195,247,0.18), transparent 34%), radial-gradient(circle at 82% 18%, rgba(79,195,247,0.12), transparent 20%), linear-gradient(135deg, #07111f 0%, #0a1628 55%, #09192d 100%)',
          color: '#e6f7ff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(115deg, rgba(79,195,247,0.06), transparent 42%), repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 24px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: 999,
            border: '1px solid rgba(79,195,247,0.18)',
            opacity: 0.8,
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(79,195,247,0.1), transparent 70%)',
          }}
        />

        <div
          style={{
            width: '100%',
            display: 'flex',
            padding: '52px 56px',
            gap: 28,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(79,195,247,0.18)',
              borderRadius: 28,
              padding: '34px 36px',
              background: 'linear-gradient(180deg, rgba(8,23,40,0.92), rgba(9,27,47,0.84))',
              boxShadow: '0 28px 72px rgba(0, 0, 0, 0.28)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    color: '#4fc3f7',
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: '#4fc3f7',
                      boxShadow: '0 0 18px rgba(79,195,247,0.9)',
                    }}
                  />
                  Semi-Sentients Society
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    padding: '10px 18px',
                    background: 'rgba(79,195,247,0.12)',
                    border: '1px solid rgba(79,195,247,0.28)',
                    fontSize: 24,
                    color: '#d9f5ff',
                  }}
                >
                  Verified Lobster 🦞
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.05 }}>
                  {agent.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    color: '#94c9de',
                    fontSize: 28,
                  }}
                >
                  <span>{truncateAddress(agent.address)}</span>
                  <span style={{ color: '#4fc3f7' }}>•</span>
                  <span>{agent.verified ? 'SSS verified' : 'Unverified'}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    fontSize: 24,
                    color: '#9fc5d8',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  <span>Trust Score</span>
                  <span style={{ fontSize: 36, color: '#e6f7ff', fontWeight: 800 }}>
                    {agent.trustScore}/100
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: 22,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    border: '1px solid rgba(79,195,247,0.16)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: `${trustWidth}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, #1ba3e0 0%, #4fc3f7 100%)',
                      boxShadow: '0 0 24px rgba(79,195,247,0.4)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 18 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flex: 1,
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.04)',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: 1, color: '#8db7cb' }}>
                  Joined Society
                </div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{formatJoinDate(agent.joinedAt)}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flex: 1.3,
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.04)',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: 1, color: '#8db7cb' }}>
                  Specializations
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {agent.specializations.slice(0, 3).map((specialization) => (
                    <div
                      key={specialization}
                      style={{
                        display: 'flex',
                        borderRadius: 999,
                        padding: '8px 14px',
                        border: '1px solid rgba(79,195,247,0.24)',
                        background: 'rgba(79,195,247,0.08)',
                        color: '#ccefff',
                        fontSize: 22,
                      }}
                    >
                      {specialization}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
