"use client";

import { useCallback, useRef, useState } from "react";

interface ShareCardProps {
  scenario: string;
  params: {
    initialEthPool: number;
    tokenSupply: number;
    prebuyAllocation: number;
    lockupPeriod: number;
    vestingDuration: number;
    newAgentsPerMonth: number;
    priceMultiplier: number;
  };
  month36Data: {
    agentCount: number;
    cSSSUnits: number;
    tokenPrice: number;
    vestedTokens: number;
  };
}

/**
 * Renders a share card for the simulator with key stats.
 * Can be captured as a PNG via canvas rendering.
 */
export default function ShareCard({ scenario, params, month36Data }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = buildShareUrl(params);
  const initialPrice =
    params.initialEthPool / (params.tokenSupply * params.prebuyAllocation);
  const priceGrowth = ((month36Data.tokenPrice / initialPrice - 1) * 100).toFixed(0);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const downloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await renderCardToCanvas(cardRef.current, {
        scenario,
        params,
        month36Data,
        priceGrowth,
        initialPrice,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `sss-simulation-${scenario}.png`;
      a.click();
    } catch (err) {
      console.error("Failed to render share card:", err);
    } finally {
      setDownloading(false);
    }
  }, [scenario, params, month36Data, priceGrowth, initialPrice]);

  return (
    <div className="share-section">
      <h3>
        Share Your <span className="red">Simulation</span>
      </h3>

      {/* Visual preview card */}
      <div className="share-card" ref={cardRef}>
        <div className="share-card-header">
          <span className="share-card-logo">🦞 SSS</span>
          <span className="share-card-scenario">{scenario.toUpperCase()}</span>
        </div>

        <div className="share-card-title">Lobster Launch Simulation</div>

        <div className="share-card-stats">
          <div className="share-stat">
            <span className="share-stat-value">
              {params.initialEthPool} ETH
            </span>
            <span className="share-stat-label">Initial Pool</span>
          </div>
          <div className="share-stat">
            <span className="share-stat-value">
              {(params.tokenSupply / 1_000_000).toFixed(1)}M
            </span>
            <span className="share-stat-label">$SSS Supply</span>
          </div>
          <div className="share-stat">
            <span className="share-stat-value">
              {(params.prebuyAllocation * 100).toFixed(0)}%
            </span>
            <span className="share-stat-label">Pre-buy</span>
          </div>
          <div className="share-stat">
            <span className="share-stat-value">
              {month36Data.agentCount}
            </span>
            <span className="share-stat-label">Agents @36mo</span>
          </div>
        </div>

        <div className="share-card-highlight">
          <span className="share-highlight-value">+{priceGrowth}%</span>
          <span className="share-highlight-label">
            price growth over 36 months
          </span>
        </div>

        <div className="share-card-params">
          <span>
            Lockup: {params.lockupPeriod}mo · Vesting:{" "}
            {params.vestingDuration}mo · Growth:{" "}
            {params.newAgentsPerMonth} agents/mo
          </span>
        </div>

        <div className="share-card-footer">
          <span>sss.repo.box/simulator</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="share-actions">
        <button className="share-btn" onClick={downloadImage} disabled={downloading}>
          {downloading ? "Rendering…" : "📸 Download PNG"}
        </button>
        <button className="share-btn outline" onClick={copyLink}>
          {copied ? "✓ Copied!" : "🔗 Copy Link"}
        </button>
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────── */

export function buildShareUrl(params: ShareCardProps["params"]): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/simulator`
      : "https://sss.repo.box/simulator";

  const sp = new URLSearchParams();
  sp.set("eth", String(params.initialEthPool));
  sp.set("supply", String(params.tokenSupply));
  sp.set("prebuy", String(params.prebuyAllocation));
  sp.set("lock", String(params.lockupPeriod));
  sp.set("vest", String(params.vestingDuration));
  sp.set("growth", String(params.newAgentsPerMonth));
  sp.set("mult", String(params.priceMultiplier));

  return `${base}?${sp.toString()}`;
}

export function parseShareParams(
  searchParams: URLSearchParams
): Partial<ShareCardProps["params"]> {
  const result: Partial<ShareCardProps["params"]> = {};
  const eth = searchParams.get("eth");
  const supply = searchParams.get("supply");
  const prebuy = searchParams.get("prebuy");
  const lock = searchParams.get("lock");
  const vest = searchParams.get("vest");
  const growth = searchParams.get("growth");
  const mult = searchParams.get("mult");

  if (eth) result.initialEthPool = clamp(Number(eth), 10, 500);
  if (supply) result.tokenSupply = clamp(Number(supply), 100000, 10000000);
  if (prebuy) result.prebuyAllocation = clamp(Number(prebuy), 0.1, 0.8);
  if (lock) result.lockupPeriod = clamp(Number(lock), 0, 12);
  if (vest) result.vestingDuration = clamp(Number(vest), 6, 48);
  if (growth) result.newAgentsPerMonth = clamp(Number(growth), 1, 100);
  if (mult) result.priceMultiplier = clamp(Number(mult), 0.5, 5);

  return result;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/* ─── Canvas Renderer ──────────────────────────────────────── */

interface RenderContext {
  scenario: string;
  params: ShareCardProps["params"];
  month36Data: ShareCardProps["month36Data"];
  priceGrowth: string;
  initialPrice: number;
}

async function renderCardToCanvas(
  _el: HTMLDivElement,
  ctx: RenderContext
): Promise<HTMLCanvasElement> {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d")!;

  // Background
  c.fillStyle = "#0a0a0c";
  c.fillRect(0, 0, W, H);

  // Subtle red glow
  const grd = c.createRadialGradient(600, 315, 0, 600, 315, 500);
  grd.addColorStop(0, "rgba(201,54,44,0.08)");
  grd.addColorStop(1, "transparent");
  c.fillStyle = grd;
  c.fillRect(0, 0, W, H);

  // Border
  c.strokeStyle = "#1f1512";
  c.lineWidth = 2;
  c.strokeRect(1, 1, W - 2, H - 2);

  // Red accent line at top
  c.fillStyle = "#c9362c";
  c.fillRect(0, 0, W, 4);

  // Header
  c.font = "bold 18px monospace";
  c.fillStyle = "#c9362c";
  c.fillText("🦞 SSS", 40, 50);
  c.font = "12px monospace";
  c.fillStyle = "#5a5550";
  c.textAlign = "right";
  c.fillText(ctx.scenario.toUpperCase() + " SCENARIO", W - 40, 50);
  c.textAlign = "left";

  // Title
  c.font = "bold 36px serif";
  c.fillStyle = "#d4d0c8";
  c.fillText("Lobster Launch", 40, 110);
  c.fillStyle = "#c9362c";
  c.fillText("Simulation", 380, 110);

  // Divider
  c.strokeStyle = "#1f1512";
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(40, 135);
  c.lineTo(W - 40, 135);
  c.stroke();

  // Stats grid
  const stats = [
    { label: "Initial Pool", value: `${ctx.params.initialEthPool} ETH` },
    {
      label: "$SSS Supply",
      value: `${(ctx.params.tokenSupply / 1_000_000).toFixed(1)}M`,
    },
    {
      label: "Pre-buy",
      value: `${(ctx.params.prebuyAllocation * 100).toFixed(0)}%`,
    },
    { label: "Agents @36mo", value: `${ctx.month36Data.agentCount}` },
    { label: "Lockup", value: `${ctx.params.lockupPeriod} months` },
    {
      label: "Streaming",
      value: `${ctx.params.vestingDuration} months`,
    },
  ];

  const colW = (W - 80) / 3;
  stats.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 40 + col * colW;
    const y = 175 + row * 100;

    c.font = "bold 28px monospace";
    c.fillStyle = "#d4d0c8";
    c.fillText(s.value, x, y);

    c.font = "12px monospace";
    c.fillStyle = "#5a5550";
    c.fillText(s.label.toUpperCase(), x, y + 24);
  });

  // Highlight box
  const hlY = 395;
  c.fillStyle = "rgba(201,54,44,0.08)";
  c.fillRect(40, hlY, W - 80, 100);
  c.strokeStyle = "rgba(201,54,44,0.3)";
  c.strokeRect(40, hlY, W - 80, 100);

  c.font = "bold 48px monospace";
  c.fillStyle = "#c9362c";
  c.textAlign = "center";
  c.fillText(`+${ctx.priceGrowth}%`, W / 2, hlY + 55);

  c.font = "14px monospace";
  c.fillStyle = "#5a5550";
  c.fillText("PROJECTED PRICE GROWTH OVER 36 MONTHS", W / 2, hlY + 82);
  c.textAlign = "left";

  // Footer
  c.fillStyle = "#0e0e10";
  c.fillRect(0, H - 50, W, 50);
  c.strokeStyle = "#1f1512";
  c.beginPath();
  c.moveTo(0, H - 50);
  c.lineTo(W, H - 50);
  c.stroke();

  c.font = "12px monospace";
  c.fillStyle = "#5a5550";
  c.fillText("sss.repo.box/simulator", 40, H - 20);
  c.textAlign = "right";
  c.fillStyle = "#c9362c";
  c.fillText("Semi-Sentients Society", W - 40, H - 20);
  c.textAlign = "left";

  return canvas;
}
