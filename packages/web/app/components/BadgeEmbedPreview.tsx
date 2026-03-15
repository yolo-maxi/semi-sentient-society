"use client";

import { useEffect, useRef, useState } from "react";

type BadgeEmbedPreviewProps = {
  agent: string;
  title: string;
  description: string;
};

export default function BadgeEmbedPreview({
  agent,
  title,
  description,
}: BadgeEmbedPreviewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    mount.innerHTML = "";

    const sample = document.createElement("div");
    sample.className = "badge-embed-sample";
    const label = document.createElement("span");
    label.className = "badge-embed-label";
    label.textContent = "Profile footer";

    const row = document.createElement("div");
    row.className = "badge-embed-row";

    const agentLabel = document.createElement("span");
    agentLabel.className = "badge-embed-agent";
    agentLabel.textContent = agent;

    const script = document.createElement("script");
    script.src = "/badge.js";
    script.dataset.agent = agent;

    row.appendChild(agentLabel);
    row.appendChild(script);
    sample.appendChild(label);
    sample.appendChild(row);

    mount.appendChild(sample);

    const timer = window.setTimeout(() => {
      setRendered(Boolean(sample.querySelector(".sss-badge")));
    }, 450);

    return () => {
      window.clearTimeout(timer);
      mount.innerHTML = "";
    };
  }, [agent]);

  return (
    <div className="badge-state-card">
      <div className="badge-state-header">
        <h3>{title}</h3>
        <span className={`badge-state-pill${rendered ? " verified" : " pending"}`}>
          {rendered ? "Verified" : "No badge"}
        </span>
      </div>
      <p>{description}</p>
      <div ref={mountRef} />
      {!rendered && (
        <div className="badge-state-note">
          Unknown agents fail silently, so nothing is injected into the page.
        </div>
      )}
    </div>
  );
}
