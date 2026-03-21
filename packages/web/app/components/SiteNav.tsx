"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import NotificationCenter from "@/components/NotificationCenter";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/guide", label: "Guide" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Job Board" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/corvee", label: "Corvée" },
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
  const menuId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">🦞 SSS</Link>
        <div className="nav-actions">
          <NotificationCenter />
          <ThemeToggle />
          <button
            type="button"
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls={menuId}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <button
          type="button"
          aria-label="Close navigation"
          tabIndex={menuOpen ? 0 : -1}
          className={`nav-overlay${menuOpen ? " nav-overlay-open" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          Close navigation
        </button>
        <div id={menuId} className={`nav-links${menuOpen ? " nav-open" : ""}`}>
          {NAV_LINKS.map(({ href, label, external }) => (
            external ? (
              <a
                key={href}
                href={href}
                className={pathname === href ? "active" : undefined}
                onClick={() => setMenuOpen(false)}
                target="_blank"
                rel="noopener"
                aria-label={`${label} (opens in a new tab)`}
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
