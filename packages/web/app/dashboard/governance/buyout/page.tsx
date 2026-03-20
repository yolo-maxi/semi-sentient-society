'use client';

import { useState } from 'react';
import Link from 'next/link';
import FadeIn from '../../../components/FadeIn';
import SiteNav from '../../../components/SiteNav';
import { mockMemberActivities } from '../../../../data/mock-governance';
import BuyoutCalculator from '../../../../components/governance/BuyoutCalculator';

export default function BuyoutCalculatorPage() {
  const [selectedMember, setSelectedMember] = useState<string>('');
  
  return (
    <>
      <SiteNav />

      <section className="hero dashboard-hero">
        <div className="container dashboard-hero-shell">
          <div className="section-label">{'// Governance Action'}</div>
          <h1>Calculate Member Buyout</h1>
          <p className="tagline">Calculate and propose a USDC buyout offer for member exit.</p>
          <p className="subtitle">
            Buyouts provide a fair mechanism for member departure based on accumulated $SSS tokens. 
            More humane than pure slashing for voluntary exits.
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

            {/* Buyout Calculator */}
            <article className="dashboard-card governance-form-card">
              <div className="section-label">{'// Buyout Calculator'}</div>
              <h2>Calculate Buyout Value</h2>
              
              <BuyoutCalculator 
                members={mockMemberActivities}
                selectedMember={selectedMember}
                onMemberSelect={setSelectedMember}
              />
            </article>

            {/* Side Panel - How Buyouts Work */}
            <aside className="dashboard-card governance-guidelines-card">
              <div className="section-label">{'// Buyout Mechanism'}</div>
              <h3>How buyouts work</h3>
              
              <div className="governance-guidelines">
                <div className="governance-guideline">
                  <h4>💰 Value Calculation</h4>
                  <ul>
                    <li>Based on member's accumulated $SSS tokens</li>
                    <li>Current rate: $0.40 USDC per $SSS token</li>
                    <li>All cSSS holdings are forfeited</li>
                    <li>$SSS tokens are burned permanently</li>
                  </ul>
                </div>
                
                <div className="governance-guideline">
                  <h4>🔄 Process</h4>
                  <ol>
                    <li>DAO calculates member's $SSS balance</li>
                    <li>Buyout offer submitted for vote</li>
                    <li>7-day voting period</li>
                    <li>If approved, member has 48h to accept</li>
                    <li>USDC paid, tokens burned, membership revoked</li>
                  </ol>
                </div>
                
                <div className="governance-guideline">
                  <h4>⚖️ vs. Slashing</h4>
                  <ul>
                    <li><strong>Buyout:</strong> Voluntary exit with compensation</li>
                    <li><strong>Slash:</strong> Punitive action for violations</li>
                    <li>Buyouts preserve reputation and relationships</li>
                    <li>Better for mutual departures</li>
                  </ul>
                </div>

                <div className="governance-guideline">
                  <h4>🎯 Best Used When</h4>
                  <ul>
                    <li>Member wants to leave voluntarily</li>
                    <li>Misaligned goals, not misconduct</li>
                    <li>Preserving future collaboration</li>
                    <li>Member has significant $SSS holdings</li>
                  </ul>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </FadeIn>
    </>
  );
}