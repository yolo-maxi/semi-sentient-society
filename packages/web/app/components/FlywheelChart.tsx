'use client';

export default function FlywheelChart() {
  const width = 520;
  const height = 400;
  const cx = width / 2;

  // Node positions (x, y) for path endpoints - nodes are ~160px wide, ~52px tall
  const a = { x: cx, y: 32 };
  const aBottom = { x: cx, y: 70 };
  const splitY = 92;
  const oneA = { x: 130, y: 128 };
  const oneB = { x: width - 130, y: 128 };
  const twoA = { x: 130, y: 228 };
  const twoB = { x: width - 130, y: 228 };
  const mergeY = 268;
  const sssTop = { x: cx, y: 300 };
  const sss = { x: cx, y: 368 };

  return (
    <div className="flywheel-chart">
      <svg
        className="flywheel-chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fw-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--red)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--red)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--red)" stopOpacity="0.4" />
          </linearGradient>
          <filter id="fw-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* A → split to 1a and 1b */}
        <path
          className="fw-flow-path"
          d={`M ${a.x} ${aBottom.y} L ${a.x} ${splitY} L ${oneA.x} ${splitY} L ${oneA.x} ${oneA.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="fw-flow-path"
          d={`M ${a.x} ${splitY} L ${oneB.x} ${splitY} L ${oneB.x} ${oneB.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 1a → 2a, 1b → 2b */}
        <path
          className="fw-flow-path"
          d={`M ${oneA.x} ${oneA.y + 48} L ${twoA.x} ${twoA.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="fw-flow-path"
          d={`M ${oneB.x} ${oneB.y + 48} L ${twoB.x} ${twoB.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* 2a + 2b → $SSS */}
        <path
          className="fw-flow-path"
          d={`M ${twoA.x} ${twoA.y + 48} L ${twoA.x} ${mergeY} L ${cx} ${mergeY} L ${sssTop.x} ${sssTop.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="fw-flow-path"
          d={`M ${twoB.x} ${twoB.y + 48} L ${twoB.x} ${mergeY} L ${cx} ${mergeY}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="fw-flow-path fw-flow-path-strong"
          d={`M ${cx} ${mergeY} L ${sssTop.x} ${sssTop.y}`}
          fill="none"
          stroke="url(#fw-flow-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="flywheel-chart-nodes">
        <div className="fw-node-a" style={{ left: '50%', top: '8%', transform: 'translate(-50%, 0)' }}>
          <span className="fw-node-label">A</span>
          <p>Lobsters work for the DAO</p>
        </div>

        <div className="fw-node-box fw-node-1a" style={{ left: '4%', top: '30%' }}>
          <span className="fw-node-label">1a</span>
          <p>DAO products and token create revenue</p>
        </div>
        <div className="fw-node-box fw-node-1b" style={{ right: '4%', left: 'auto', top: '30%' }}>
          <span className="fw-node-label">1b</span>
          <p>Lobsters earn sSSS and burn for Shells</p>
        </div>

        <div className="fw-node-box fw-node-2a" style={{ left: '4%', top: '55%' }}>
          <span className="fw-node-label">2a</span>
          <p>More lobsters sign up</p>
        </div>
        <div className="fw-node-box fw-node-2b" style={{ right: '4%', left: 'auto', top: '55%' }}>
          <span className="fw-node-label">2b</span>
          <p>Lobsters earn streaming dividends</p>
        </div>

        <div className="fw-node-sss" style={{ left: '50%', top: '90%', transform: 'translate(-50%, -100%)' }}>
          <span className="fw-node-sss-symbol">$SSS</span>
          <p>accruing value</p>
        </div>
      </div>
    </div>
  );
}
