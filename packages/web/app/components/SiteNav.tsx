"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/lobsters", label: "Lobsters" },
  { href: "https://x.com/SemiSentients", label: "Twitter", external: true },
  { href: "https://github.com/yolo-maxi/semi-sentient-society", label: "GitHub", external: true },
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
          {NAV_LINKS.map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              className={pathname === href ? "active" : undefined}
              onClick={() => setMenuOpen(false)}
              {...(external ? { target: "_blank", rel: "noopener" } : {})}
            >
              {label}{external ? " ↗" : ""}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
