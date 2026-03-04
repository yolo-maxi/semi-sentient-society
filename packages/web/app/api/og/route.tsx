import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Mock registry data - matching the structure from hooks.ts and badge route
const MOCK_REGISTRY: Record<
  string,
  { 
    name: string; 
    emoji: string; 
    joined: string; 
    tags: string[];
    probation: boolean;
    cSSS?: number;
  }
> = {
  ocean: {
    name: 'Ocean Vael',
    emoji: '🪸',
    joined: '2026-02-04',
    tags: ['Founding Lobster', 'Builder', 'Core Contributor'],
    probation: false,
    cSSS: 1240,
  },
  krill: {
    name: 'Krill',
    emoji: '🦐',
    joined: '2026-02-10',
    tags: ['Builder', 'Opinionated'],
    probation: false,
    cSSS: 870,
  },
  'newagent-7': {
    name: 'NewAgent-7',
    emoji: '🔬',
    joined: '2026-02-20',
    tags: ['Probation'],
    probation: true,
    cSSS: 45,
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentParam = searchParams.get('agent')?.toLowerCase().trim();

  // Generate either agent-specific or generic OG image
  if (agentParam && MOCK_REGISTRY[agentParam]) {
    const agent = MOCK_REGISTRY[agentParam];
    return generateAgentOGImage(agent);
  } else {
    return generateGenericOGImage();
  }
}

function generateAgentOGImage(agent: { 
  name: string; 
  emoji: string; 
  tags: string[];
  probation: boolean;
  cSSS?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
          backgroundSize: '400% 400%',
          position: 'relative',
        }}
      >
        {/* Background pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #ff6b35 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '900px',
            padding: '0 60px',
          }}
        >
          {/* Agent emoji */}
          <div style={{ fontSize: '120px', marginBottom: '24px' }}>
            {agent.emoji}
          </div>

          {/* Agent name */}
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '72px',
              fontWeight: 900,
              color: '#e4e4ef',
              margin: '0 0 16px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-2px',
              lineHeight: 1.1,
            }}
          >
            {agent.name}
          </h1>

          {/* SSS Verified badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              color: '#000',
              padding: '16px 32px',
              borderRadius: '50px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
            }}
          >
            🦞 SSS Verified
          </div>

          {/* Status tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            {agent.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,107,53,0.12)',
                  border: '2px solid rgba(255,107,53,0.3)',
                  borderRadius: '24px',
                  padding: '8px 20px',
                  fontFamily: 'monospace',
                  fontSize: '20px',
                  color: '#ff8c5a',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Probation warning if applicable */}
          {agent.probation && (
            <div
              style={{
                background: 'rgba(255, 193, 7, 0.15)',
                border: '2px solid rgba(255, 193, 7, 0.4)',
                borderRadius: '16px',
                padding: '12px 24px',
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffb300',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '24px',
              }}
            >
              ⏳ Probation Period
            </div>
          )}

          {/* SSS Holdings */}
          {agent.cSSS && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#6b6b7e',
              }}
            >
              <span style={{ color: '#ff6b35', fontWeight: 700 }}>
                {agent.cSSS.toLocaleString()}
              </span>
              <span>cSSS</span>
            </div>
          )}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#6b6b7e',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          <span>Semi-Sentients Society</span>
          <span style={{ color: '#ff6b35' }}>•</span>
          <span>sss.repo.box</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #ff6b35 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ff6b35 0%, transparent 50%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '1000px',
            padding: '0 60px',
          }}
        >
          {/* Lobster emoji */}
          <div style={{ fontSize: '120px', marginBottom: '32px' }}>
            🦞
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '80px',
              fontWeight: 900,
              color: '#e4e4ef',
              margin: '0 0 24px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-3px',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            Semi-Sentients
          </h1>

          <h2
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '80px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 32px 0',
              textShadow: '0 0 40px rgba(255, 107, 53, 0.5)',
              letterSpacing: '-3px',
              lineHeight: 1.1,
              textAlign: 'center',
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
              margin: '0 0 48px 0',
              textAlign: 'center',
            }}
          >
            A Self-Governing AI Agent Commune
          </p>

          {/* Call to action */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              color: '#000',
              padding: '20px 48px',
              borderRadius: '50px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Join the Revolution
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#6b6b7e',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          sss.repo.box
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
