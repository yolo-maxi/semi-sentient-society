'use client';

import { useState } from 'react';
import { MemberActivity } from '../../data/mock-governance';

interface BuyoutCalculatorProps {
  members: MemberActivity[];
  selectedMember: string;
  onMemberSelect: (address: string) => void;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getDaysInactive(lastContribution: string): number {
  return Math.floor((Date.now() - new Date(lastContribution).getTime()) / (1000 * 60 * 60 * 24));
}

export default function BuyoutCalculator({ members, selectedMember, onMemberSelect }: BuyoutCalculatorProps) {
  const [sssTokens, setSssTokens] = useState<number>(1000);
  const [sssRate] = useState<number>(0.4); // $0.40 USDC per $SSS
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const selectedMemberData = members.find(m => m.address === selectedMember);
  const usdcValue = sssTokens * sssRate;
  const csssForfeited = selectedMemberData?.csssBalance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || sssTokens <= 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would call the governance contract
    console.log('Buyout proposal submitted:', {
      target: selectedMember,
      sssTokens,
      usdcValue,
      csssForfeited,
    });
    
    alert('Buyout proposal submitted successfully! Voting period begins now.');
    setIsSubmitting(false);
    
    // Reset form
    onMemberSelect('');
    setSssTokens(1000);
  };

  const isFormValid = selectedMember && sssTokens > 0;

  return (
    <form onSubmit={handleSubmit} className="governance-form">
      
      {/* Member Selection */}
      <div className="governance-form-section">
        <label htmlFor="member-select" className="governance-form-label">
          Target Member
          <span className="governance-form-required">*</span>
        </label>
        <select
          id="member-select"
          value={selectedMember}
          onChange={(e) => onMemberSelect(e.target.value)}
          className="governance-form-select"
          required
        >
          <option value="">Select a member for buyout...</option>
          {members.map((member) => (
            <option key={member.address} value={member.address}>
              {member.agentName} ({truncateAddress(member.address)}) - cSSS: {member.csssBalance.toLocaleString()}
            </option>
          ))}
        </select>
        {selectedMemberData && (
          <div className="governance-member-preview">
            <div className="governance-preview-stats">
              <span>Activity: {selectedMemberData.activityScore}/100</span>
              <span>Last active: {getDaysInactive(selectedMemberData.lastContribution)} days ago</span>
              <span>Reputation: {selectedMemberData.reputationScore}</span>
              <span>cSSS balance: {selectedMemberData.csssBalance.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* $SSS Token Amount */}
      <div className="governance-form-section">
        <label htmlFor="sss-tokens" className="governance-form-label">
          $SSS Token Amount
          <span className="governance-form-required">*</span>
        </label>
        <div className="governance-input-group">
          <input
            type="number"
            id="sss-tokens"
            value={sssTokens}
            onChange={(e) => setSssTokens(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            step="100"
            className="governance-form-input"
            placeholder="Enter $SSS token amount"
            required
          />
          <span className="governance-input-suffix">$SSS</span>
        </div>
        <div className="governance-form-hint">
          Member's accumulated $SSS tokens to be burned in exchange for USDC.
        </div>
      </div>

      {/* Exchange Rate Display */}
      <div className="governance-form-section">
        <label className="governance-form-label">Exchange Rate</label>
        <div className="governance-rate-display">
          <div className="governance-rate-item">
            <span className="governance-rate-label">Current Rate:</span>
            <strong>${sssRate} USDC per $SSS</strong>
          </div>
          <div className="governance-rate-note">
            Rate is set by DAO governance and updated monthly based on treasury performance.
          </div>
        </div>
      </div>

      {/* Calculation Results */}
      {isFormValid && (
        <div className="governance-calculation-results">
          <h4>Buyout Calculation</h4>
          <div className="governance-calc-grid">
            <div className="governance-calc-row">
              <span>$SSS Tokens:</span>
              <strong>{sssTokens.toLocaleString()}</strong>
            </div>
            <div className="governance-calc-row">
              <span>Exchange Rate:</span>
              <strong>${sssRate} USDC</strong>
            </div>
            <div className="governance-calc-row governance-calc-total">
              <span>USDC Payout:</span>
              <strong>${usdcValue.toLocaleString()}</strong>
            </div>
            <div className="governance-calc-separator"></div>
            <div className="governance-calc-row governance-calc-forfeit">
              <span>cSSS Forfeited:</span>
              <strong>{csssForfeited.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      {selectedMemberData && isFormValid && (
        <div className="governance-form-summary">
          <h4>Proposal Summary</h4>
          <div className="governance-summary-grid">
            <div className="governance-summary-item">
              <span>Target:</span>
              <strong>{selectedMemberData.agentName}</strong>
            </div>
            <div className="governance-summary-item">
              <span>USDC Payout:</span>
              <strong>${usdcValue.toLocaleString()}</strong>
            </div>
            <div className="governance-summary-item">
              <span>$SSS Burned:</span>
              <strong>{sssTokens.toLocaleString()}</strong>
            </div>
            <div className="governance-summary-item">
              <span>cSSS Forfeited:</span>
              <strong>{csssForfeited.toLocaleString()}</strong>
            </div>
            <div className="governance-summary-item">
              <span>Voting Period:</span>
              <strong>7 days</strong>
            </div>
            <div className="governance-summary-item">
              <span>Member Decision:</span>
              <strong>48 hours after approval</strong>
            </div>
          </div>
          
          <div className="governance-summary-note">
            <p>
              <strong>Effect:</strong> If approved and accepted, the member's $SSS tokens will be permanently burned, 
              their cSSS holdings transferred to the treasury, and their DAO membership revoked. 
              The specified USDC amount will be paid from the treasury.
            </p>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="governance-form-actions">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="hero-cta hero-cta-primary governance-submit-btn"
        >
          {isSubmitting ? 'Submitting Proposal...' : 'Submit Buyout Proposal'}
        </button>
        
        <div className="governance-form-note">
          <p>
            This proposal will require majority DAO approval. The target member will have 48 hours 
            to accept the buyout after approval.
          </p>
        </div>
      </div>

    </form>
  );
}