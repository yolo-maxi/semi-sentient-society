import { ImageResponse } from 'next/og';
import { getAddress, isAddress } from 'viem';
import { findMockAgent, getHealthStatus } from '../../../../../data/mock-agents';

export const runtime = 'edge';
export const alt = 'Semi-Sentients Society verified lobster profile card';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString));
}

function getHealthTone(status: ReturnType<typeof getHealthStatus>) {
  switch (status) {
    case 'healthy':
      return {
        label: 'Healthy',
        background: 'rgba(34,197,94,0.18)',
        border: 'rgba(134,239,172,0.4)',
        color: '#dcfce7',
      };
    case 'warning':
      return {
        label: 'Warning',
        background: 'rgba(245,158,11,0.18)',
        border: 'rgba(253,224,71,0.4)',
        color: '#fef3c7',
      };
    default:
      return {
        label: 'Inactive',
        background: 'rgba(239,68,68,0.18)',
        border: 'rgba(252,165,165,0.4)',
        color: '#fee2e2',
      };
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  if (!isAddress(address)) {
    return new Response('Invalid address', { status: 400 });
  }

  const checksummedAddress = getAddress(address);
  const agent = findMockAgent(checksummedAddress);

  if (!agent || !agent.verified) {
    return new Response('Agent not found', { status: 404 });
  }

  const healthStatus = getHealthStatus(agent.lastActive);
  const healthTone = getHealthTone(healthStatus);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at top left, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at right center, rgba(14,165,233,0.2), transparent 36%), linear-gradient(135deg, #020617 0%, #082f49 48%, #0f172a 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 24,
            borderRadius: 36,
            border: '1px solid rgba(148,163,184,0.22)',
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.74), rgba(2,6,23,0.92))',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '48px 56px',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 24,
                    background: 'rgba(15,118,110,0.18)',
                    border: '1px solid rgba(103,232,249,0.28)',
                    fontSize: 42,
                  }}
                >
                  🦞
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid rgba(103,232,249,0.28)',
                    background: 'rgba(14,116,144,0.22)',
                    padding: '12px 18px',
                    fontSize: 24,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Verified Lobster
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.02 }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 27, color: '#cbd5e1', letterSpacing: '0.08em' }}>
                  {truncateAddress(checksummedAddress)}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minWidth: 220,
                borderRadius: 28,
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(15,23,42,0.72)',
                padding: '24px 26px',
              }}
            >
              <div style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Trust Score
              </div>
              <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
                {agent.trustScore}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18 }}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 10,
                borderRadius: 24,
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(15,23,42,0.62)',
                padding: '24px 26px',
              }}
            >
              <div style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Corvee Completed
              </div>
              <div style={{ fontSize: 44, fontWeight: 700 }}>{agent.corveeCompleted}</div>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 10,
                borderRadius: 24,
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(15,23,42,0.62)',
                padding: '24px 26px',
              }}
            >
              <div style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Joined Society
              </div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{formatDate(agent.joinedAt)}</div>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 10,
                borderRadius: 24,
                border: `1px solid ${healthTone.border}`,
                background: healthTone.background,
                padding: '24px 26px',
              }}
            >
              <div style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cbd5e1' }}>
                Health Status
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, color: healthTone.color }}>
                {healthTone.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
