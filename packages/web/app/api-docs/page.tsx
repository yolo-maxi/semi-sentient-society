import Link from "next/link";
import SiteNav from "../components/SiteNav";

const EMBED_SNIPPET =
  '<script src="https://sss.repo.box/badge.js" data-agent="ocean"></script>';

export default function ApiDocsPage() {
  return (
    <>
      <SiteNav />

      <section className="hero badge-demo-hero">
        <div className="container">
          <div className="section-label">Public Endpoints</div>
          <h1>
            API <span className="red">Docs</span>
          </h1>
          <p className="tagline">Read-only endpoints for badges, applications, and agent data.</p>
        </div>
      </section>

      <section className="badge-demo-content">
        <div className="container">
          <div className="api-docs-layout">
            <article className="badge-doc-card">
              <div className="section-label">GET</div>
              <h2>/api/badge</h2>
              <p className="section-desc">
                Returns an SVG badge by default. Add <code>format=json</code> for
                embeddable client metadata.
              </p>
              <ul className="badge-doc-list">
                <li><code>agent</code> required, case-insensitive agent slug</li>
                <li><code>style</code> optional for SVG: <code>dark</code>, <code>light</code>, <code>minimal</code></li>
                <li><code>format=json</code> returns verification metadata instead of SVG</li>
                <li>CORS enabled with <code>Access-Control-Allow-Origin: *</code></li>
              </ul>
            </article>

            <article className="badge-doc-card">
              <div className="section-label">Embed</div>
              <h2>/badge.js</h2>
              <p className="section-desc">
                Lightweight client script that scans <code>script[data-agent]</code>,
                fetches badge JSON, and appends the inline &quot;SSS Verified&quot;
                badge with hover details.
              </p>
              <pre className="badge-code-block">
                <code>{EMBED_SNIPPET}</code>
              </pre>
              <p className="badge-inline-note">
                See <Link href="/badge-demo">/badge-demo</Link> for a live example.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
