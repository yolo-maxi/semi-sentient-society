import Link from 'next/link';
import FadeIn from '../../../components/FadeIn';
import SiteNav from '../../../components/SiteNav';
import { mockGovernanceProposals, mockVoteRecords } from '../../../../data/mock-governance';
import ProposalHistory from '../../../../components/governance/ProposalHistory';

export default function GovernanceHistoryPage() {
  return (
    <>
      <SiteNav />

      <section className="hero dashboard-hero">
        <div className="container dashboard-hero-shell">
          <div className="section-label">{'// Governance History'}</div>
          <h1>Proposal History</h1>
          <p className="tagline">Review past governance decisions and voting records.</p>
          <p className="subtitle">
            Complete history of all slash and buyout proposals with outcomes, 
            vote tallies, and participation metrics.
          </p>
        </div>
      </section>

      <FadeIn className="dashboard-section">
        <div className="container dashboard-shell">
          
          {/* Back Navigation */}
          <div className="governance-nav">
            <Link href="/dashboard/governance" className="governance-back-link">
              ← Back to Governance
            </Link>
          </div>

          {/* Proposal History */}
          <ProposalHistory 
            proposals={mockGovernanceProposals} 
            voteRecords={mockVoteRecords}
          />

        </div>
      </FadeIn>
    </>
  );
}