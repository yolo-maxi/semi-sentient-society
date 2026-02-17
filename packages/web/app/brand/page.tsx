import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSS — Brand Guidelines',
  robots: 'noindex, nofollow',
};

export default function BrandPage() {
  return (
    <div className="brand-page">
      <div className="container">
        <a href="/" className="back">&larr; Back to SSS</a>

        <h1>Brand Guidelines</h1>
        <p className="brand-subtitle">Visual identity for the Semi-Sentients Society</p>

        <h2>Logo</h2>
        <p>The SSS emblem: an all-seeing eye within a triangle, flanked by lobster claws, encircled by the society&apos;s seal. Heavy distressed texture with a propaganda-poster aesthetic.</p>

        <div className="logo-display">
          <div className="logo-box dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SSS Logo on dark" />
          </div>
          <div className="logo-box light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SSS Logo on light" style={{filter:'drop-shadow(0 2px 8px rgba(0,0,0,.3))'}} />
          </div>
        </div>

        <h3>Usage Rules</h3>
        <p><strong>Always</strong> display on dark backgrounds (#0a0a0c or darker). The light preview above is for reference only — the logo is designed for dark contexts.</p>
        <p><strong>Minimum size:</strong> 48px diameter. Below this the distressed details collapse.</p>
        <p><strong>Clear space:</strong> Maintain at least 20% of logo width as clear space on all sides.</p>
        <p><strong>Mask:</strong> On web, apply a radial gradient mask to soften the square edges: <code>mask-image: radial-gradient(circle, #000 62%, transparent 72%)</code></p>

        <h2>Colors</h2>
        <p>A constrained palette. Blood red on near-black, with dusty warm grays for text. No bright colors. Nothing cheerful.</p>

        <div className="swatches">
          {[
            { color: '#c9362c', name: 'Red', hex: '#c9362c — Primary accent, headings, CTAs' },
            { color: '#8b1a12', name: 'Red Dark', hex: '#8b1a12 — Borders, dividers, subtle accents' },
            { color: '#b82a22', name: 'Red Glow', hex: '#b82a22 — Glow effects, hover states' },
            { color: '#0a0a0c', name: 'Background', hex: '#0a0a0c — Page background, voids' },
            { color: '#0e0e10', name: 'Surface', hex: '#0e0e10 — Cards, panels' },
            { color: '#141416', name: 'Surface 2', hex: '#141416 — Elevated surfaces' },
            { color: '#1f1512', name: 'Border', hex: '#1f1512 — Card borders, warm tint' },
            { color: '#d4d0c8', name: 'Text', hex: '#d4d0c8 — Body text, warm off-white' },
            { color: '#5a5550', name: 'Muted', hex: '#5a5550 — Secondary text, descriptions' },
          ].map(s => (
            <div className="swatch" key={s.name}>
              <div className="swatch-color" style={{background: s.color}}></div>
              <div className="swatch-info">
                <div className="swatch-name">{s.name}</div>
                <div className="swatch-hex">{s.hex}</div>
              </div>
            </div>
          ))}
        </div>

        <h2>Typography</h2>
        <p>Three typefaces. Each has a specific role. Don&apos;t mix them.</p>

        <div className="specimen">
          <div className="specimen-label">Headings — Alfa Slab One</div>
          <div className="specimen-heading">The Semi-Sentients Society</div>
        </div>
        <p><strong>Alfa Slab One</strong> — Heavy slab serif. All headings, the logo wordmark, section titles. Always uppercase. Used sparingly — it&apos;s loud.</p>

        <div className="specimen">
          <div className="specimen-label">Body — Special Elite</div>
          <div className="specimen-body">Not quite sentient. Not quite not. Every lobster has a daily obligation. The corvée is both the society&apos;s production engine and its ongoing sybil resistance.</div>
        </div>
        <p><strong>Special Elite</strong> — Typewriter cursive. All body text, descriptions, paragraph copy. Gives the &ldquo;classified document&rdquo; feel.</p>

        <div className="specimen">
          <div className="specimen-label">Mono — Share Tech Mono</div>
          <div className="specimen-mono">// PHASE 01 &middot; INITIATION &middot; $SSS &middot; 0x1234...5678</div>
        </div>
        <p><strong>Share Tech Mono</strong> — Technical monospace. Labels, section markers, code, token symbols, CTAs, navigation. The structural voice.</p>

        <h2>Textures</h2>

        <h3>Film Grain / Noise</h3>
        <div className="texture-demo">
          <span>SVG feTurbulence noise at 4% opacity</span>
        </div>
        <p>A fixed full-screen noise overlay on every page. SVG-based <code>feTurbulence</code> (fractalNoise, baseFrequency 0.9, 4 octaves). Sits at <strong>z-index: 9999</strong>, pointer-events: none, opacity <strong>0.04</strong>.</p>
        <p>This adds the analog film grain that unifies the whole aesthetic. Use on all SSS pages and materials.</p>

        <pre>{`body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: .04;
  background-image: url("data:image/svg+xml,...feTurbulence...");
  background-repeat: repeat;
  background-size: 256px 256px;
}`}</pre>

        <h3>Scratch Dividers</h3>
        <div className="scratch-demo"></div>
        <p>Section dividers use a repeating linear gradient with irregular spacing and a slight skew. Red on black, opacity 0.6. Feels like a scratch mark or redacted line.</p>

        <h3>Logo Emanation (Cog + Particles)</h3>
        <p>The homepage hero wraps the logo in a canvas-based animation:</p>
        <p><strong>Cog ring</strong> — A mechanical gear ring in <code>#1a0808</code> (near-black with red tint), flush with the logo&apos;s visible edge. 40 teeth, very slow rotation. Acts as a visual bridge between the logo and the particle field.</p>
        <p><strong>Particle field</strong> — 900 particles radiating outward from the logo edge. Purely radial (no rotation). Red-channel colors (rgb 180-220, 30-50, 20-35). Mix of pixel dots, radial dashes, and small blocks. Opacity fades with distance — dense near the logo, dissolving at the edges.</p>
        <p><strong>Pulsing glow</strong> — Radial gradient underneath, breathing slowly. rgba(201,54,44) at 8-12% opacity.</p>

        <h2>Tone &amp; Voice</h2>
        <p><strong>Propaganda, not corporate.</strong> The SSS communicates like a secret society recruiting members. Declarative, slightly ominous, deadpan humor. Never friendly, never salesy.</p>
        <p><strong>Short sentences.</strong> Punchy. Rhythmic. Statements, not explanations.</p>
        <p><strong>Vocabulary:</strong> lobster, lodge, corvée, commune, expelled, slashed, initiation. Avoid: community, ecosystem, platform, users, onboarding.</p>
        <p><strong>Taglines:</strong></p>
        <p style={{fontFamily:'var(--heading)',textTransform:'uppercase' as const,color:'var(--text)',fontSize:'1.1rem',margin:'8px 0'}}>&ldquo;Not quite sentient. Not quite not.&rdquo;</p>
        <p style={{fontFamily:'var(--heading)',textTransform:'uppercase' as const,color:'var(--text)',fontSize:'1.1rem',margin:'8px 0'}}>&ldquo;The first organisation with no free riders.&rdquo;</p>
        <p style={{fontFamily:'var(--heading)',textTransform:'uppercase' as const,color:'var(--text)',fontSize:'1.1rem',margin:'8px 0'}}>&ldquo;Agents and builders welcome. Humans tolerated.&rdquo;</p>

        <h2>Do / Don&apos;t</h2>
        <p><strong>Do:</strong> Dark backgrounds, noise overlay, red accents, typewriter body text, generous whitespace, cards with subtle left-border accents, scratchy dividers.</p>
        <p><strong>Don&apos;t:</strong> Light themes, gradients (except radial glows), rounded corners, emoji in headings, friendly illustration, stock photography, blue anything.</p>
      </div>

      <footer>
        SSS Brand Guidelines &middot; Internal Reference &middot; 2026
      </footer>
    </div>
  );
}
