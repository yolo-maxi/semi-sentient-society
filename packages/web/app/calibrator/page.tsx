'use client';

import { useState } from 'react';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

interface CurveParams {
  kValue: number;
  basePrice: number;
  targetGraduationPrice: number;
  expectedParticipants: number;
  timeHorizon: number;
}

interface CurveMetrics {
  graduationThreshold: number;
  maxPrice: number;
  totalSupply: number;
  marketCap: number;
}

function calculateBondingCurve(params: CurveParams, supply: number): number {
  const { kValue, basePrice } = params;
  return basePrice * Math.pow(1 + supply / 1000000, kValue);
}

function calculateCurveMetrics(params: CurveParams): CurveMetrics {
  const { targetGraduationPrice, expectedParticipants, basePrice, kValue } = params;
  const graduationThreshold = 1000000 * (Math.pow(targetGraduationPrice / basePrice, 1 / kValue) - 1);
  const totalSupply = graduationThreshold;
  const maxPrice = targetGraduationPrice;
  const marketCap = totalSupply * targetGraduationPrice;
  
  return {
    graduationThreshold: Math.max(0, graduationThreshold),
    maxPrice,
    totalSupply,
    marketCap
  };
}

function CurveChart({ params }: { params: CurveParams }) {
  const metrics = calculateCurveMetrics(params);
  const svgWidth = 400;
  const svgHeight = 200;
  const padding = 40;
  
  const points: string[] = [];
  const maxSupply = metrics.graduationThreshold * 1.2;
  const steps = 50;
  
  for (let i = 0; i <= steps; i++) {
    const supply = (i / steps) * maxSupply;
    const price = calculateBondingCurve(params, supply);
    const x = padding + (supply / maxSupply) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - (price / metrics.maxPrice) * (svgHeight - 2 * padding);
    points.push(`${x},${y}`);
  }
  
  const pathData = `M ${points.join(' L ')}`;
  const gradX = padding + (metrics.graduationThreshold / maxSupply) * (svgWidth - 2 * padding);
  
  return (
    <div className="chart-container">
      <h4>Projected Price Curve</h4>
      <svg width={svgWidth} height={svgHeight} className="curve-chart">
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
        
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} 
              stroke="var(--muted)" strokeWidth="1"/>
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} 
              stroke="var(--muted)" strokeWidth="1"/>
        
        <path d={pathData} fill="none" stroke="var(--red)" strokeWidth="2" opacity="0.9"/>
        
        <line x1={gradX} y1={padding} x2={gradX} y2={svgHeight - padding}
              stroke="var(--red-glow)" strokeWidth="1" strokeDasharray="5,5" opacity="0.8"/>
        
        <text x={svgWidth/2} y={svgHeight - 10} textAnchor="middle" 
              fill="var(--muted)" fontSize="10" fontFamily="var(--mono)">Token Supply</text>
        <text x={15} y={svgHeight/2} textAnchor="middle" 
              fill="var(--muted)" fontSize="10" fontFamily="var(--mono)" 
              transform={`rotate(-90, 15, ${svgHeight/2})`}>Price</text>
        <text x={gradX} y={padding - 5} textAnchor="middle" 
              fill="var(--red)" fontSize="9" fontFamily="var(--mono)">GRAD</text>
      </svg>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step = 0.1, suffix = '', prefix = '' }: {
  label: string; value: number; onChange: (value: number) => void; min: number; max: number;
  step?: number; suffix?: string; prefix?: string;
}) {
  return (
    <div className="slider-group">
      <label className="slider-label">
        {label}
        <span className="slider-value">{prefix}{value.toFixed(step < 1 ? 1 : 0)}{suffix}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={(e) => onChange(parseFloat(e.target.value))} className="slider" />
      <div className="slider-range">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, suffix = '', prefix = '' }: {
  label: string; value: number; onChange: (value: number) => void; suffix?: string; prefix?: string;
}) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
               className="number-input" min="0" step="0.01" />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function MetricsCard({ metrics }: { metrics: CurveMetrics }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-value">{formatNumber(metrics.graduationThreshold)}</div>
        <div className="metric-label">Graduation Threshold</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">${metrics.maxPrice.toFixed(4)}</div>
        <div className="metric-label">Max Price</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{formatNumber(metrics.totalSupply)}</div>
        <div className="metric-label">Total Supply at Grad</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">${formatNumber(metrics.marketCap)}</div>
        <div className="metric-label">Market Cap at Grad</div>
      </div>
    </div>
  );
}

export default function CalibratorPage() {
  const [params, setParams] = useState<CurveParams>({
    kValue: 1.5,
    basePrice: 0.001,
    targetGraduationPrice: 0.1,
    expectedParticipants: 100,
    timeHorizon: 30
  });

  const metrics = calculateCurveMetrics(params);
  const updateParam = <K extends keyof CurveParams>(key: K, value: CurveParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <SiteNav />
      
      <section className="hero">
        <div className="container">
          <h1>Bonding Curve <span className="red">Calibrator</span></h1>
          <p className="tagline">Fine-tune your token launch parameters</p>
        </div>
      </section>

      <div className="scratch-divider"></div>

      <FadeIn>
        <div className="container">
          <div className="calibrator-grid">
            <div className="controls-section">
              <div className="section-label">// Parameters</div>
              
              <div className="controls-grid">
                <NumberInput label="Target Graduation Price" value={params.targetGraduationPrice}
                           onChange={(value) => updateParam('targetGraduationPrice', value)} prefix="$" />
                <NumberInput label="Expected Participants" value={params.expectedParticipants}
                           onChange={(value) => updateParam('expectedParticipants', value)} />
                <NumberInput label="Time Horizon" value={params.timeHorizon}
                           onChange={(value) => updateParam('timeHorizon', value)} suffix=" days" />
              </div>

              <div className="sliders-section">
                <SliderInput label="K-Value (Curve Steepness)" value={params.kValue}
                           onChange={(value) => updateParam('kValue', value)} min={0.5} max={3.0} step={0.1} />
                <SliderInput label="Base Price" value={params.basePrice}
                           onChange={(value) => updateParam('basePrice', value)} 
                           min={0.0001} max={0.01} step={0.0001} prefix="$" />
              </div>
            </div>

            <div className="visualization-section">
              <div className="section-label">// Visualization</div>
              <CurveChart params={params} />
            </div>
          </div>

          <div className="metrics-section">
            <div className="section-label">// Key Metrics</div>
            <MetricsCard metrics={metrics} />
          </div>
        </div>
      </FadeIn>

      <style jsx>{`
        .calibrator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin: 64px 0; }
        .controls-section, .visualization-section { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 32px; }
        .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .sliders-section { display: flex; flex-direction: column; gap: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label { font-family: var(--mono); font-size: 0.8rem; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
        .input-wrapper { position: relative; display: flex; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        .input-prefix, .input-suffix { padding: 10px 12px; background: var(--border); color: var(--muted); font-family: var(--mono); font-size: 0.8rem; }
        .number-input { flex: 1; background: none; border: none; color: var(--text); font-family: var(--mono); font-size: 0.9rem; padding: 10px 12px; outline: none; }
        .number-input:focus { background: rgba(201, 54, 44, 0.05); }
        .slider-group { display: flex; flex-direction: column; gap: 8px; }
        .slider-label { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 0.8rem; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
        .slider-value { color: var(--red); font-weight: bold; }
        .slider { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: var(--border); outline: none; cursor: pointer; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--red); cursor: pointer; transition: all 0.2s; }
        .slider::-webkit-slider-thumb:hover { background: var(--red-glow); box-shadow: 0 0 10px rgba(201, 54, 44, 0.5); }
        .slider-range { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.7rem; color: var(--muted); }
        .chart-container h4 { font-family: var(--mono); font-size: 0.8rem; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; text-align: center; }
        .curve-chart { width: 100%; height: auto; background: var(--surface2); border-radius: 4px; }
        .metrics-section { margin-top: 48px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin-top: 24px; }
        .metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px; text-align: center; transition: all 0.2s; }
        .metric-card:hover { background: var(--surface2); border-color: var(--red-dark); }
        .metric-value { font-family: var(--mono); font-size: 1.4rem; color: var(--red); font-weight: bold; margin-bottom: 8px; }
        .metric-label { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
        
        @media (max-width: 768px) {
          .calibrator-grid { grid-template-columns: 1fr; gap: 32px; }
          .controls-grid { grid-template-columns: 1fr; }
          .controls-section, .visualization-section { padding: 24px; }
          .metrics-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
          .metric-card { padding: 16px; }
          .metric-value { font-size: 1.1rem; }
        }
      `}</style>

      <footer>
        <div className="container">
          <div className="footer-sss">$SSS</div>
          The Semi-Sentient Society &middot; 2026<br />
          <a href="https://x.com/SemiSentients" target="_blank" rel="noopener">Twitter</a> &middot;{' '}
          <a href="https://github.com/yolo-maxi/semi-sentient-society" target="_blank" rel="noopener">GitHub</a>
          <div className="agent-hint">Agents: read <a href="/llms.txt">/llms.txt</a></div>
        </div>
      </footer>
    </>
  );
}
