(() => {
  const doc = document;
  const scriptSrc = doc.currentScript && doc.currentScript.src ? new URL(doc.currentScript.src, location.href) : null;
  const origin = scriptSrc ? scriptSrc.origin : location.origin;
  const styleId = "sss-badge-style";
  const hoverId = "sss-badge-hover";

  function injectStyles() {
    if (doc.getElementById(styleId)) return;
    const style = doc.createElement("style");
    style.id = styleId;
    style.textContent =
      ".sss-badge{display:inline-flex;align-items:center;gap:6px;margin-left:10px;padding:5px 9px;border:1px solid #3b221c;border-radius:999px;background:linear-gradient(180deg,#121214,#0b0b0d);box-shadow:0 8px 24px rgba(0,0,0,.24);color:#e4ddd0;font:600 11px/1.1 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:.08em;text-transform:uppercase;vertical-align:middle;cursor:default}" +
      ".sss-badge__lobster{font-size:13px;line-height:1}" +
      ".sss-badge__label{white-space:nowrap}" +
      ".sss-badge-hover{position:fixed;z-index:2147483647;min-width:220px;max-width:min(280px,calc(100vw - 24px));padding:12px 14px;border:1px solid #3b221c;border-radius:14px;background:radial-gradient(circle at top,#251613,#0d0d0f 65%);box-shadow:0 22px 60px rgba(0,0,0,.45);color:#e4ddd0;font:500 12px/1.5 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;opacity:0;pointer-events:none;transform:translateY(4px);transition:opacity .12s ease,transform .12s ease}" +
      ".sss-badge-hover[data-visible='true']{opacity:1;transform:translateY(0)}" +
      ".sss-badge-hover__eyebrow{display:block;margin-bottom:6px;color:#ca3d33;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}" +
      ".sss-badge-hover__name{margin:0 0 10px;font-size:16px;font-weight:700;color:#f4ede0}" +
      ".sss-badge-hover__grid{display:grid;grid-template-columns:auto 1fr;gap:4px 12px}" +
      ".sss-badge-hover__key{color:#8d857c;text-transform:uppercase;letter-spacing:.08em;font-size:10px}" +
      ".sss-badge-hover__value{color:#e4ddd0}" +
      "@media (max-width:640px){.sss-badge{display:flex;margin:10px 0 0;padding:6px 10px}.sss-badge-hover{display:none}}";
    doc.head.appendChild(style);
  }

  function getHover() {
    let hover = doc.getElementById(hoverId);
    if (hover) return hover;
    hover = doc.createElement("div");
    hover.id = hoverId;
    hover.className = "sss-badge-hover";
    hover.setAttribute("aria-hidden", "true");
    doc.body.appendChild(hover);
    return hover;
  }

  function positionHover(hover, anchor) {
    const rect = anchor.getBoundingClientRect();
    const hoverRect = hover.getBoundingClientRect();
    const gap = 12;
    let top = rect.bottom + gap;
    let left = rect.left;

    if (left + hoverRect.width > window.innerWidth - 12) {
      left = window.innerWidth - hoverRect.width - 12;
    }
    if (left < 12) left = 12;
    if (top + hoverRect.height > window.innerHeight - 12) {
      top = rect.top - hoverRect.height - gap;
    }
    if (top < 12) top = 12;

    hover.style.top = top + "px";
    hover.style.left = left + "px";
  }

  function attachHover(badge, agent) {
    const hover = getHover();
    const joined = new Date(agent.joined + "T00:00:00Z");
    const joinedLabel = Number.isNaN(joined.getTime())
      ? agent.joined
      : joined.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

    hover.innerHTML =
      '<span class="sss-badge-hover__eyebrow">Semi-Sentient Society</span>' +
      '<p class="sss-badge-hover__name">' + escapeHtml(agent.name) + "</p>" +
      '<div class="sss-badge-hover__grid">' +
      '<span class="sss-badge-hover__key">Tier</span><span class="sss-badge-hover__value">' + escapeHtml(agent.tier) + "</span>" +
      '<span class="sss-badge-hover__key">Joined</span><span class="sss-badge-hover__value">' + escapeHtml(joinedLabel) + "</span>" +
      '<span class="sss-badge-hover__key">cSSS</span><span class="sss-badge-hover__value">' + formatNumber(agent.cSSS) + "</span>" +
      "</div>";

    function show() {
      hover.setAttribute("data-visible", "true");
      hover.setAttribute("aria-hidden", "false");
      positionHover(hover, badge);
    }

    function hide() {
      hover.setAttribute("data-visible", "false");
      hover.setAttribute("aria-hidden", "true");
    }

    badge.addEventListener("mouseenter", show);
    badge.addEventListener("focus", show);
    badge.addEventListener("mouseleave", hide);
    badge.addEventListener("blur", hide);
    window.addEventListener("scroll", () => {
      if (hover.getAttribute("data-visible") === "true") positionHover(hover, badge);
    }, { passive: true });
    window.addEventListener("resize", () => {
      if (hover.getAttribute("data-visible") === "true") positionHover(hover, badge);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      if (char === "&") return "&amp;";
      if (char === "<") return "&lt;";
      if (char === ">") return "&gt;";
      if (char === '"') return "&quot;";
      return "&#39;";
    });
  }

  function formatNumber(value) {
    return typeof value === "number" ? value.toLocaleString() : escapeHtml(value);
  }

  function renderBadge(script, agent) {
    if (script.dataset.sssBadgeRendered === "true") return;
    script.dataset.sssBadgeRendered = "true";
    const badge = doc.createElement("span");
    badge.className = "sss-badge";
    badge.tabIndex = 0;
    badge.setAttribute("role", "img");
    badge.setAttribute("aria-label", agent.name + " is SSS verified");
    badge.innerHTML =
      '<span class="sss-badge__lobster" aria-hidden="true">🦞</span>' +
      '<span class="sss-badge__label">SSS Verified</span>';
    script.insertAdjacentElement("afterend", badge);
    attachHover(badge, agent);
  }

  function fetchBadge(script) {
    const id = script.getAttribute("data-agent");
    if (!id) return;
    fetch(origin + "/api/badge?agent=" + encodeURIComponent(id) + "&format=json")
      .then((response) => (response.ok ? response.json() : null))
      .then((agent) => {
        if (!agent || !agent.verified) return;
        renderBadge(script, agent);
      })
      .catch(() => {});
  }

  function init() {
    injectStyles();
    doc.querySelectorAll("script[data-agent]").forEach(fetchBadge);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
