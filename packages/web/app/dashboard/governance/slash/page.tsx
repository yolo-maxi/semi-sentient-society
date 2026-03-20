'use client';

import { useState } from 'react';
import Link from 'next/link';
import FadeIn from '../../../components/FadeIn';
import SiteNav from '../../../components/SiteNav';
import { mockMemberActivities } from '../../../../data/mock-governance';
import SlashForm from '../../../../components/governance/SlashForm';

export default function SlashProposalPage() {
  const [selectedMember, setSelectedMember] = useState<string>('');
  
  // Filter to members who might be candidates for slashing (low activity)
  const slashCandidates = mockMemberActivities.filter(m => m.activityScore < 70);

  return (
    <>
      <SiteNav />

      <section className="hero dashboard-hero">
        <div className="container dashboard-hero-shell">
          <div className="section-label">{'// Governance Action'}</div>
          <h1>Propose Member Slash</h1>
          <p className="tagline">Submit a proposal to slash inactive member's cSSS holdings.</p>
          <p className="subtitle">
            Slashing is a mechanism to hold members accountable for their commitments to the DAO. 
            All proposals require a majority vote before execution.
          </p>
        </div>
      </section>

      <FadeIn className="dashboard-section">
        <div className="container dashboard-shell">
          <div className="governance-form-layout">
            
            {/* Back Navigation */}
            <div className="governance-nav">
              <Link href="/dashboard/governance" className="governance-back-link">
                ← Back to Governance
              </Link>
            </div>

            {/* Slash Form */}
            <article className="dashboard-card governance-form-card">
              <div className="section-label">{'// Slash Proposal Form'}</div>
              <h2>Create Slash Proposal</h2>
              
              <SlashForm 
                candidates={slashCandidates}
                selectedMember={selectedMember}
                onMemberSelect={setSelectedMember}
              />
            </article>

            {/* Side Panel - Guidelines */}
            <aside className="dashboard-card governance-guidelines-card">
              <div className="section-label">{'// Slashing Guidelines'}</div>
              <h3>When to propose a slash</h3>
              
              <div className="governance-guidelines">
                <div className="governance-guideline">
                  <h4>🎯 Justified Reasons</h4>
                  <ul>
                    <li>Inactive for 30+ days</li>
                    <li>Corvée completion rate below 50%</li>
                    <li>Unresponsive to DAO communications</li>
                    <li>Violation of community standards</li>
                  </ul>
                </div>
                
                <div className="governance-guideline">
                  <h4>⚖️ Slash Percentages</h4>
                  <ul>
                    <li><strong>5-15%:</strong> Minor infractions, warnings</li>
                    <li><strong>15-25%:</strong> Moderate inactivity (30-60 days)</li>
                    <li><strong>25-50%:</strong> Severe inactivity (60+ days)</li>
                    <li><strong>50%+:</strong> Serious violations only</li>
                  </ul>
                </div>
                
                <div className="governance-guideline">
                  <h4>📋 Process</h4>
                  <ol>
                    <li>Submit proposal with detailed reasoning</li>
                    <li>7-day voting period begins</li>
                    <li>Requires majority approval</li>
                    <li>24-hour execution delay if passed</li>
                    <li>Slashed cSSS goes to treasury</li>
                  </ol>
                </div>

                <div className="governance-guideline">
                  <h4>🔄 Alternatives</h4>
                  <p>
                    Consider a <Link href="/dashboard/governance/buyout" className="governance-inline-link">
                      buyout offer
                    </Link> for voluntary exit instead of punitive slashing.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </FadeIn>
    </>
  );
}