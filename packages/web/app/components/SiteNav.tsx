"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConnectWallet } from "./ConnectWallet";

const NAV_LINKS = [
  { href: "/join", label: "Join" },
  { href: "/why-join", label: "Why Join" },
  { href: "/lobsters", label: "Lobsters" },
  { href: "/jobs", label: "Jobs" },
  { href: "/activity", label: "Activity" },
  { href: "/governance", label: "Governance" },
  { href: "/referrals", label: "Referrals" },
  { href: "/staking", label: "Staking" },
  { href: "/calibrator", label: "Calibrator" },
  { href: "/questline", label: "Questline" },
  { href: "/simulator", label: "Simulator" },
  { href: "/showcase", label: "Showcase" },
  { href: "/docs", label: "Docs" },
  { href: "/api-docs", label: "API" },
  { href: "/faq", label: "FAQ" },
  { href: "/badge", label: "Badge" },
  { href: "/members", label: "Members" },
  { href: "/verify", label: "Verify" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <a href="/" className="nav-logo">🦞 SSS</a>
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links${menuOpen ? " nav-open" : ""}`}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={pathname === href ? "active" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a href="/#join" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Apply
          </a>
          <div style={{ marginLeft: '16px' }}>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}
