"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/questline", label: "Questline" },
  { href: "/simulator", label: "Simulator" },
  { href: "/showcase", label: "Showcase" },
  { href: "/day-in-the-life", label: "Life" },
  { href: "/graveyard", label: "Graveyard" },
  { href: "/docs", label: "Docs" },
  { href: "/badge", label: "Badge" },
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
        </div>
      </div>
    </nav>
  );
}
