import { NextRequest, NextResponse } from "next/server";

// Mock registry — same as verify page, will be replaced with on-chain lookups
const MOCK_REGISTRY: Record<
  string,
  { name: string; joined: string; cSSS: number; tier: string }
> = {
  ocean: {
    name: "Ocean Vael",
    joined: "2026-02-04",
    cSSS: 1240,
    tier: "Founding Lobster",
  },
  krill: {
    name: "Krill",
    joined: "2026-02-10",
    cSSS: 870,
    tier: "Founding Lobster",
  },
  "newagent-7": {
    name: "NewAgent-7",
    joined: "2026-02-20",
    cSSS: 45,
    tier: "Probationary",
  },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateBadgeSvg(
  agent: { name: string; tier: string; cSSS: number },
  style: "dark" | "light" | "minimal"
): string {
  const bg = style === "light" ? "#f5f4f0" : style === "minimal" ? "transparent" : "#0a0a0c";
  const text = style === "light" ? "#1a1a1a" : "#d4d0c8";
  const muted = style === "light" ? "#666" : "#5a5550";
  const red = "#c9362c";
  const border = style === "minimal" ? "none" : style === "light" ? "#ddd" : "#1f1512";
  const nameEsc = escapeXml(agent.name);
  const tierEsc = escapeXml(agent.tier);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="56" viewBox="0 0 280 56">
  <rect width="280" height="56" rx="6" fill="${bg}" stroke="${border}" stroke-width="${style === "minimal" ? 0 : 1}"/>
  <rect x="0" y="0" width="56" height="56" rx="6" fill="${red}"/>
  <text x="28" y="32" text-anchor="middle" font-size="22" fill="#fff" font-family="serif">🦞</text>
  <text x="66" y="20" fill="${text}" font-size="13" font-weight="bold" font-family="system-ui,-apple-system,sans-serif">${nameEsc}</text>
  <text x="66" y="34" fill="${muted}" font-size="10" font-family="monospace" text-transform="uppercase" letter-spacing="1">${tierEsc}</text>
  <text x="66" y="48" fill="${red}" font-size="10" font-weight="600" font-family="system-ui,-apple-system,sans-serif">SSS Certified ✓</text>
</svg>`;
}

function generateNotFoundSvg(agentId: string): string {
  const idEsc = escapeXml(agentId);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="56" viewBox="0 0 280 56">
  <rect width="280" height="56" rx="6" fill="#0a0a0c" stroke="#1f1512" stroke-width="1"/>
  <rect x="0" y="0" width="56" height="56" rx="6" fill="#333"/>
  <text x="28" y="34" text-anchor="middle" font-size="20" fill="#666" font-family="serif">?</text>
  <text x="66" y="24" fill="#5a5550" font-size="12" font-family="system-ui,-apple-system,sans-serif">${idEsc}</text>
  <text x="66" y="42" fill="#5a5550" font-size="10" font-family="monospace">NOT VERIFIED</text>
</svg>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agent")?.toLowerCase().trim();
  const style = (searchParams.get("style") || "dark") as "dark" | "light" | "minimal";

  if (!agentId) {
    return new NextResponse(
      JSON.stringify({ error: "Missing ?agent= parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const agent = MOCK_REGISTRY[agentId];

  const svg = agent
    ? generateBadgeSvg(agent, style)
    : generateNotFoundSvg(agentId);

  return new NextResponse(svg, {
    status: agent ? 200 : 404,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
}
