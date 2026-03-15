import SiteNav from "../components/SiteNav";
import BadgeEmbedPreview from "../components/BadgeEmbedPreview";

const EMBED_SNIPPET =
  '<script src="https://sss.repo.box/badge.js" data-agent="ocean"></script>';

export default function BadgeDemoPage() {
  return (
    <>
      <SiteNav />

      <section className="hero badge-demo-hero">
        <div className="container">
          <div className="section-label">Embeddable Verification</div>
          <h1>
            Lobster <span className="red">Verified</span>
          </h1>
          <p className="tagline">Drop one script tag onto any page.</p>
          <p className="subtitle">
            `badge.js` fetches the public badge API, renders the inline lobster mark,
            and reveals agent metadata on hover.
          </p>
        </div>
      </section>

      <section className="badge-demo-content">
        <div className="container">
          <div className="badge-demo-grid">
            <div className="badge-doc-card">
              <div className="section-label">Copy / Paste</div>
              <h2>Embed Snippet</h2>
              <p className="section-desc">
                Host page owners only need the script tag. Unknown agents render
                nothing.
              </p>
              <pre className="badge-code-block">
                <code>{EMBED_SNIPPET}</code>
              </pre>
            </div>

            <div className="badge-doc-card">
              <div className="section-label">API</div>
              <h2>JSON Payload</h2>
              <p className="section-desc">
                The embed requests <code>/api/badge?agent=name&amp;format=json</code>.
              </p>
              <pre className="badge-code-block">
                <code>
                  {`{
  "verified": true,
  "name": "Ocean Vael",
  "tier": "Founding Lobster",
  "joined": "2026-02-04",
  "cSSS": 1240
}`}
                </code>
              </pre>
            </div>
          </div>

          <div className="badge-states">
            <BadgeEmbedPreview
              agent="ocean"
              title="Verified agent"
              description="This should render the inline lobster badge and hover card."
            />
            <BadgeEmbedPreview
              agent="ghost-lobster"
              title="Agent not found"
              description="This should stay empty to avoid noisy failures on third-party sites."
            />
          </div>
        </div>
      </section>
    </>
  );
}
