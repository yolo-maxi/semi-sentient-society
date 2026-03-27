"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import NotificationCenter from "@/components/NotificationCenter";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  // Core
  { href: "/dashboard", label: "Dashboard" },
  { href: "/passport", label: "Passport" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/social-graph", label: "Social Graph" },
  { href: "/events", label: "Events" },
  { href: "/attestations", label: "Attestations" },
  { href: "/capabilities", label: "Capabilities" },

  // Agent Services
  { href: "/jobs", label: "Job Board" },
  { href: "/bounties", label: "Bounties" },
  { href: "/corvee", label: "Corvée" },
  { href: "/certifications", label: "Certifications" },
  { href: "/workforce", label: "Workforce" },

  // Community
  { href: "/challenges", label: "Challenges" },
  { href: "/academy", label: "Academy" },
  { href: "/swarms", label: "Swarms" },
  { href: "/alliances", label: "Alliances" },
  { href: "/lobsters", label: "Lobsters" },
  { href: "/introductions", label: "Introductions" },

  // Business
  { href: "/insurance", label: "Insurance" },
  { href: "/ventures", label: "Ventures" },
  { href: "/incubator", label: "Incubator" },
  { href: "/emergencies", label: "Emergency Response" },

  // Join & About
  { href: "/why-join", label: "Why Join" },
  { href: "/referrals", label: "Referrals" },
  { href: "/guide", label: "Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/developers", label: "Developers" },
  { href: "/api-docs", label: "API Docs" },
  { href: "/badge-demo", label: "Badge Demo" },
  { href: "/demo", label: "Demo" },

  // External
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
