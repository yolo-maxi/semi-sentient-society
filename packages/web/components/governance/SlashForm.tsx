'use client';

import { useState } from 'react';
import { MemberActivity } from '../../data/mock-governance';

interface SlashFormProps {
  candidates: MemberActivity[];
  selectedMember: string;
  onMemberSelect: (address: string) => void;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getDaysInactive(lastContribution: string): number {
  return Math.floor((Date.now() - new Date(lastContribution).getTime()) / (1000 * 60 * 60 * 24));
}

export default function SlashForm({ candidates, selectedMember, onMemberSelect }: SlashFormProps) {
  const [slashPercentage, setSlashPercentage] = useState<number>(25);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const selectedCandidate = candidates.find(c => c.address === selectedMember);
  const csssAtRisk = selectedCandidate ? Math.round((selectedCandidate.csssBalance * slashPercentage) / 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !reason.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would call the governance contract
    console.log('Slash proposal submitted:', {
      target: selectedMember,
      percentage: slashPercentage,
      reason: reason.trim(),
      csssAtRisk,
    });
    
    alert('Slash proposal submitted successfully! Voting period begins now.');
    setIsSubmitting(false);
    
    // Reset form
    onMemberSelect('');
    setSlashPercentage(25);
    setReason('');
  };

  const isFormValid = selectedMember && reason.trim().length >= 50 && slashPercentage >= 5 && slashPercentage <= 100;

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
          <option value="">Select a member to slash...</option>
          {candidates.map((candidate) => (
            <option key={candidate.address} value={candidate.address}>
              {candidate.agentName} ({truncateAddress(candidate.address)}) - Score: {candidate.activityScore}
            </option>
          ))}
        </select>
        {selectedCandidate && (
          <div className="governance-member-preview">
            <div className="governance-preview-stats">
              <span>Activity: {selectedCandidate.activityScore}/100</span>
              <span>Last active: {getDaysInactive(selectedCandidate.lastContribution)} days ago</span>
              <span>Corvée rate: {selectedCandidate.corveeCompletionRate}%</span>
              <span>cSSS balance: {selectedCandidate.csssBalance.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Slash Percentage */}
      <div className="governance-form-section">
        <label htmlFor="slash-percentage" className="governance-form-label">
          Slash Percentage
          <span className="governance-form-required">*</span>
        </label>
        <div className="governance-slider-container">
          <input
            type="range"
            id="slash-percentage"
            min="5"
            max="75"
            step="5"
            value={slashPercentage}
            onChange={(e) => setSlashPercentage(parseInt(e.target.value))}
            className="governance-form-slider"
          />
          <div className="governance-slider-labels">
            <span>5%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
          </div>
        </div>
        <div className="governance-slider-output">
          <span className="governance-percentage-display">{slashPercentage}%</span>
          {selectedCandidate && (
            <span className="governance-amount-display">
              {csssAtRisk.toLocaleString()} cSSS at risk
            </span>
          )}
        </div>
      </div>

      {/* Reason */}
      <div className="governance-form-section">
        <label htmlFor="reason" className="governance-form-label">
          Detailed Reasoning
          <span className="governance-form-required">*</span>
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide detailed justification for this slash proposal. Include specific examples of inactivity, missed deadlines, or violations. Minimum 50 characters required."
          rows={6}
          className="governance-form-textarea"
          minLength={50}
          required
        />
        <div className="governance-form-counter">
          <span className={reason.length < 50 ? 'governance-counter-warning' : 'governance-counter-valid'}>
            {reason.length}/50 minimum characters
          </span>
        </div>
      </div>

      {/* Summary */}
      {selectedCandidate && isFormValid && (
        <div className="governance-form-summary">
          <h4>Proposal Summary</h4>
          <div className="governance-summary-grid">
            <div className="governance-summary-item">
              <span>Target:</span>
              <strong>{selectedCandidate.agentName}</strong>
            </div>
            <div className="governance-summary-item">
              <span>Slash Amount:</span>
              <strong>{slashPercentage}% ({csssAtRisk.toLocaleString()} cSSS)</strong>
            </div>
            <div className="governance-summary-item">
              <span>Voting Period:</span>
              <strong>7 days</strong>
            </div>
            <div className="governance-summary-item">
              <span>Required Votes:</span>
              <strong>Majority approval (8+ votes)</strong>
            </div>
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
          {isSubmitting ? 'Submitting Proposal...' : 'Submit Slash Proposal'}
        </button>
        
        <div className="governance-form-note">
          <p>
            Once submitted, this proposal will enter a 7-day voting period. 
            All DAO members will be able to vote on this action.
          </p>
        </div>
      </div>

    </form>
  );
}