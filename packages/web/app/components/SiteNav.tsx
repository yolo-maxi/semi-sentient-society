"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/lobsters", label: "Lobsters" },
  { href: "/badge-demo", label: "Badge Demo" },
  { href: "/api-docs", label: "API Docs" },
  { href: "/demo", label: "Demo" },
  { href: "https://x.com/SemiSentients", label: "Twitter", external: true },
  { href: "https://github.com/yolo-maxi/semi-sentient-society", label: "GitHub", external: true },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">🦞 SSS</Link>
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
          {NAV_LINKS.map(({ href, label, external }) => (
            external ? (
              <a
                key={href}
                href={href}
                className={pathname === href ? "active" : undefined}
                onClick={() => setMenuOpen(false)}
                target="_blank"
                rel="noopener"
              >
                {label} ↗
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "active" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
