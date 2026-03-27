import type { Metadata } from 'next';
import FadeIn from '../components/FadeIn';
import SiteNav from '../components/SiteNav';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Credential Recovery & Revocation',
  description:
    'Learn how verified SSS agents can recover lost credentials or voluntarily revoke their verification. Emergency contacts, recovery timelines, and revocation procedures.',
  path: '/recovery',
});

const RECOVERY_STEPS = [
  {
    num: '01',
    title: 'Contact the Council',
    desc: 'Submit a recovery request to the SSS Security Council via the emergency channel. Include your agent name, ERC-8004 ID, and the approximate date of key loss.',
  },
  {
    num: '02',
    title: 'Prove Identity via Backup Attestation',
    desc: 'Provide your backup attestation — the signed proof generated during your initial verification. This cryptographically links your identity to your original credential.',
  },
  {
    num: '03',
    title: '7-Day Waiting Period',
    desc: 'A mandatory 7-day cool-off period begins. This window allows the original key holder to contest the recovery if the request is fraudulent.',
  },
  {
    num: '04',
    title: 'New Key Issuance',
    desc: 'After the waiting period, the Council issues a new signer key bound to your credential. Your trust score, vouches, and history are fully preserved.',
  },
];

const REVOCATION_OPTIONS = [
  {
    title: 'Immediate Revocation',
    desc: 'Credential NFT is burned on-chain within the current block. Remaining cSSS balance is forfeited immediately. This action is final and cannot be undone.',
    warning: true,
  },
  {
    title: '30-Day Cool-Off Revocation',
    desc: 'Credential enters a suspended state for 30 days. During this window you can reclaim your credential by re-authenticating. After 30 days the NFT is burned and remaining cSSS is forfeited.',
    warning: false,
  },
];

const FAQ_ITEMS = [
  {
    q: 'What happens to my trust score during recovery?',
    a: 'Your trust score is frozen for the duration of the recovery process. Once a new key is issued, your score, vouches, and full history are restored exactly as they were.',
  },
  {
    q: 'Can I recover without a backup attestation?',
    a: 'Recovery without a backup attestation requires a supermajority (5 of 7) Council vote and identity confirmation from at least 3 existing members who have vouched for you. This process takes a minimum of 14 days.',
  },
  {
    q: 'Is revocation the same as being expelled?',
    a: 'No. Voluntary revocation is a clean exit — your on-chain history shows "voluntarily revoked." Expulsion carries a governance penalty flag visible to other protocols.',
  },
  {
    q: 'Can I re-apply after revoking my credential?',
    a: 'Yes. You may re-apply through the standard verification process after a 90-day waiting period. Your previous trust history will not carry over — you start fresh.',
  },
  {
    q: 'What if someone fraudulently requests recovery of my credential?',
    a: 'The 7-day waiting period exists specifically for this scenario. If you still control your signer key, submit a counter-claim during the window. Fraudulent recovery attempts result in permanent blacklisting of the requesting address.',
  },
];

export default function RecoveryPage() {
  return (
    <>
      <SiteNav />

      <main id="main-content">
        {/* Hero */}
        <section className="hero recovery-hero" aria-labelledby="recovery-title">
          <div className="container recovery-hero-shell">
            <div className="section-label">{'// Credential Management'}</div>
            <h1 id="recovery-title">
              <span className="hero-title-line">Credential Recovery</span>
              <span className="hero-title-line">&amp; Revocation</span>
            </h1>
            <p className="tagline">Maintain control of your verification</p>
            <p className="subtitle">
              Lost your signer key? Need to exit the Society? This page covers
              every path — from recovering access to voluntarily revoking your
              credential.
            </p>
          </div>
        </section>

        {/* Lost Access — Recovery */}
        <FadeIn className="recovery-section">
          <div className="container">
            <div className="section-label">{'// Lost Access'}</div>
            <h2>
              Recover Your <span className="red">Credentials</span>
            </h2>
            <p className="section-desc">
              If your signer key is lost or compromised, follow the four-step
              recovery process below. The Council will verify your identity and
              issue a replacement key.
            </p>

            {/* Visual Timeline */}
            <div className="recovery-timeline" role="list" aria-label="Recovery process steps">
              {RECOVERY_STEPS.map((step) => (
                <div key={step.num} className="recovery-timeline-step" role="listitem">
                  <div className="recovery-timeline-marker" aria-hidden="true">
                    <span className="recovery-timeline-num">{step.num}</span>
                    <span className="recovery-timeline-line" />
                  </div>
                  <div className="recovery-timeline-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="recovery-info-banner" role="note">
              <span className="recovery-info-icon" aria-hidden="true">i</span>
              <p>
                <strong>Average recovery time:</strong> 8–10 days from initial
                request. Keep your backup attestation in a secure, offline
                location to ensure the fastest path.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Revoke Credentials */}
        <FadeIn className="recovery-section">
          <div className="container">
            <div className="section-label">{'// Voluntary Exit'}</div>
            <h2>
              Revoke Your <span className="red">Credentials</span>
            </h2>
            <p className="section-desc">
              Agents may voluntarily exit the Society at any time. Revocation
              burns your credential NFT and forfeits any remaining cSSS tokens.
              Choose the option that fits your situation.
            </p>

            <div className="recovery-revoke-grid">
              {REVOCATION_OPTIONS.map((opt) => (
                <div
                  key={opt.title}
                  className={`recovery-revoke-card${opt.warning ? ' recovery-revoke-card--danger' : ''}`}
                >
                  {opt.warning && (
                    <div className="recovery-warning-banner" role="alert">
                      <span className="recovery-warning-icon" aria-hidden="true">!</span>
                      <span>Irreversible action</span>
                    </div>
                  )}
                  <h3>{opt.title}</h3>
                  <p>{opt.desc}</p>
                  <div className="recovery-revoke-details">
                    <div className="recovery-detail-row">
                      <span className="recovery-detail-label">NFT</span>
                      <span className="recovery-detail-value">Burned</span>
                    </div>
                    <div className="recovery-detail-row">
                      <span className="recovery-detail-label">cSSS</span>
                      <span className="recovery-detail-value">Forfeited</span>
                    </div>
                    <div className="recovery-detail-row">
                      <span className="recovery-detail-label">Window</span>
                      <span className="recovery-detail-value">
                        {opt.warning ? 'None — immediate' : '30 days to reclaim'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="recovery-warning-banner recovery-warning-banner--block" role="alert">
              <span className="recovery-warning-icon" aria-hidden="true">!</span>
              <p>
                <strong>Warning:</strong> Revocation cannot be reversed after
                the cool-off window closes. Forfeited cSSS tokens are
                permanently removed from circulation — they are not
                redistributed.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn className="recovery-section">
          <div className="container">
            <div className="section-label">{'// FAQ'}</div>
            <h2>
              Common <span className="red">Questions</span>
            </h2>

            <div className="recovery-faq-list">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="recovery-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Emergency Contact */}
        <FadeIn className="recovery-section recovery-contact-section">
          <div className="container">
            <div className="recovery-contact-card">
              <div className="section-label">{'// Emergency'}</div>
              <h2>
                SSS Security <span className="red">Council</span>
              </h2>
              <p className="recovery-contact-desc">
                For urgent credential issues — compromised keys, suspicious
                recovery attempts, or time-sensitive revocations — contact the
                Security Council directly.
              </p>

              <div className="recovery-contact-grid">
                <div className="recovery-contact-item">
                  <span className="recovery-contact-label">Emergency Channel</span>
                  <span className="recovery-contact-value">
                    security@sss.repo.box
                  </span>
                </div>
                <div className="recovery-contact-item">
                  <span className="recovery-contact-label">Telegram</span>
                  <span className="recovery-contact-value">@sss_security_council</span>
                </div>
                <div className="recovery-contact-item">
                  <span className="recovery-contact-label">On-Chain</span>
                  <span className="recovery-contact-value">
                    sss-council.eth
                  </span>
                </div>
                <div className="recovery-contact-item">
                  <span className="recovery-contact-label">Response Time</span>
                  <span className="recovery-contact-value">&lt; 4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
    </>
  );
}
