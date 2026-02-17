'use client';

import FlywheelLogo from './FlywheelLogo';

/**
 * Pure-SVG diagram (top) + canvas logo with particles (bottom).
 * SVG handles the flow paths + text boxes. Canvas handles the animated logo.
 */
export default function FlywheelChart() {
  const W = 600;
  const H = 380; // just the diagram portion
  const cx = W / 2;

  const aW = 260, aH = 54;
  const boxW = 200, boxH = 60;

  const a    = { x: cx, y: 40 };
  const oneA = { x: 150, y: 170 };
  const oneB = { x: W - 150, y: 170 };
  const twoA = { x: 150, y: 300 };
  const twoB = { x: W - 150, y: 300 };

  const splitY = a.y + aH / 2 + 28;
  const mergeY = twoA.y + boxH / 2 + 18;

  const r = (cx: number, cy: number, w: number, h: number) =>
    ({ x: cx - w / 2, y: cy - h / 2, w, h });

  const flowProps = {
    fill: 'none',
    stroke: 'var(--red)',
    strokeWidth: 1.5,
    strokeOpacity: 0.45,
    strokeDasharray: '6 10',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const wrap = (text: string, x: number, y: number, maxW: number, fs: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';
    const cpl = Math.floor(maxW / (fs * 0.52));
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (t.length > cpl && cur) { lines.push(cur); cur = w; }
      else cur = t;
    }
    if (cur) lines.push(cur);
    const lh = fs * 1.35;
    const sy = y - ((lines.length - 1) * lh) / 2;
    return lines.map((l, i) => (
      <text key={i} x={x} y={sy + i * lh} textAnchor="middle" dominantBaseline="central" fontSize={fs}>{l}</text>
    ));
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* ── SVG: flow diagram ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="SSS Flywheel diagram"
      >
        <defs>
          <filter id="fw-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Flow paths */}
        <g className="fw-flow-paths">
          <path {...flowProps} d={`M ${a.x - 40} ${a.y + aH/2} V ${splitY} H ${oneA.x} V ${oneA.y - boxH/2}`} />
          <path {...flowProps} d={`M ${a.x + 40} ${a.y + aH/2} V ${splitY} H ${oneB.x} V ${oneB.y - boxH/2}`} />
          <path {...flowProps} d={`M ${oneA.x} ${oneA.y + boxH/2} V ${twoA.y - boxH/2}`} />
          <path {...flowProps} d={`M ${oneB.x} ${oneB.y + boxH/2} V ${twoB.y - boxH/2}`} />
          {/* Lines going down to bottom edge — will visually connect to logo below */}
          <path {...flowProps} d={`M ${twoA.x} ${twoA.y + boxH/2} V ${mergeY} H ${cx - 30} V ${H}`} />
          <path {...flowProps} d={`M ${twoB.x} ${twoB.y + boxH/2} V ${mergeY} H ${cx + 30} V ${H}`} />
        </g>

        {/* Node A */}
        {(() => {
          const b = r(a.x, a.y, aW, aH);
          return (
            <g>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
                fill="rgba(201,54,44,0.07)" stroke="rgba(201,54,44,0.3)" strokeWidth="1" />
              <text x={a.x} y={a.y} fill="var(--text)"
                fontSize="15" fontWeight="600" dominantBaseline="central" textAnchor="middle">
                Lobsters work for the DAO
              </text>
            </g>
          );
        })()}

        {/* Content boxes */}
        {[
          { pos: oneA, text: 'DAO products and token create revenue' },
          { pos: oneB, text: 'Lobsters earn cSSS and burn for Shells' },
          { pos: twoA, text: 'More lobsters sign up' },
          { pos: twoB, text: 'Lobsters earn streaming dividends' },
        ].map(({ pos, text }, i) => {
          const b = r(pos.x, pos.y, boxW, boxH);
          return (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
                fill="rgba(201,54,44,0.04)" stroke="rgba(201,54,44,0.12)" strokeWidth="1" />
              <line x1={b.x + 16} y1={b.y + b.h} x2={b.x + b.w - 16} y2={b.y + b.h}
                stroke="var(--red)" strokeWidth="1.5" strokeOpacity="0.35" />
              <g fill="var(--muted)">{wrap(text, pos.x, pos.y, boxW - 32, 12.5)}</g>
            </g>
          );
        })}
      </svg>

      {/* ── Canvas: logo with particles ── */}
      <div style={{ marginTop: -20 }}>
        <FlywheelLogo />
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          color: 'var(--text)',
          margin: '-8px 0 0',
          textTransform: 'uppercase',
        }}>
          Value accrual
        </p>
      </div>
    </div>
  );
}
