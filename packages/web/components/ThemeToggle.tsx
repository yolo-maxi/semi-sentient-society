"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";
  const nextTheme = isLight ? "dark" : "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      aria-label={mounted ? `Switch to ${nextTheme} theme` : "Toggle theme"}
      title={mounted ? `Switch to ${nextTheme} theme` : "Toggle theme"}
    >
      <span className={`theme-toggle-icon sun${isLight ? " active" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="4.25" />
          <path d="M12 1.75v3.1M12 19.15v3.1M4.76 4.76l2.19 2.19M17.05 17.05l2.19 2.19M1.75 12h3.1M19.15 12h3.1M4.76 19.24l2.19-2.19M17.05 6.95l2.19-2.19" />
        </svg>
      </span>
      <span className={`theme-toggle-icon moon${!isLight ? " active" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M20.3 14.2A8.75 8.75 0 0 1 9.8 3.7a8.75 8.75 0 1 0 10.5 10.5Z" />
        </svg>
      </span>
      <span className="theme-toggle-label">{mounted ? resolvedTheme ?? "system" : "theme"}</span>
    </button>
  );
}
