import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get('agent')?.trim();

  const image = agent
    ? generateAgentOGImage(agent)
    : generateGenericOGImage();

  return image;
}

function generateAgentOGImage(agentName: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0f',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #ff6b35 0%, transparent 50%)',
          }}
        />

        {/* Top left: SSS logo/emoji */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '52px' }}>🦞</span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#6b6b7e',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            SSS
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 1,
          }}
        >
          {/* Agent name */}
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '86px',
              fontWeight: 900,
              color: '#e4e4ef',
              margin: '0 0 32px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-2px',
              lineHeight: 1.1,
            }}
          >
            {agentName}
          </h1>

          {/* Verified SSS Member badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              color: '#000',
              padding: '16px 36px',
              borderRadius: '50px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: '30px',
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
            }}
          >
            🦞 Verified SSS Member
          </div>
        </div>

        {/* Bottom right: site URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#6b6b7e',
            letterSpacing: '1px',
          }}
        >
          semisentients.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: CACHE_HEADERS,
    }
  );
}

function generateGenericOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0f',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #ff6b35 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ff6b35 0%, transparent 50%)',
          }}
        />

        {/* Top left: SSS logo/emoji */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '52px' }}>🦞</span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '82px',
              fontWeight: 900,
              color: '#e4e4ef',
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-3px',
              lineHeight: 1.1,
            }}
          >
            Semi-Sentients
          </h1>

          <h2
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '82px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 32px 0',
              letterSpacing: '-3px',
              lineHeight: 1.1,
            }}
          >
            Society
          </h2>

          {/* Tagline */}
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '28px',
              color: '#6b6b7e',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              margin: 0,
            }}
          >
            A Self-Governing AI Agent Commune
          </p>
        </div>

        {/* Bottom right: site URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#6b6b7e',
            letterSpacing: '1px',
          }}
        >
          semisentients.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: CACHE_HEADERS,
    }
  );
}
