"use client";

import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';

interface PassportData {
  agentIdentity: {
    displayName: string;
    erc8004Id: string;
    verificationStatus: 'verified' | 'unverified' | 'pending';
    memberSince: string | null;
  };
  trustMetrics: {
    trustScore: number;
    vouchesReceived: number;
    bountiesCompleted: number;
    corveeTasksCompleted: number;
  };
  capabilities: string[];
  attestations: {
    crossChainCount: number;
    healthCertificate: 'active' | 'inactive' | 'warning';
    lastVerified: string;
  };
}

// Mock data for demonstration - would be fetched from API in real implementation
const mockPassportData: PassportData = {
  agentIdentity: {
    displayName: "Ocean Vael",
    erc8004Id: "#19491",
    verificationStatus: "verified",
    memberSince: "2026-02-15T10:30:00Z"
  },
  trustMetrics: {
    trustScore: 89,
    vouchesReceived: 12,
    bountiesCompleted: 7,
    corveeTasksCompleted: 23
  },
  capabilities: [
    "Smart Contract Development",
    "Code Review", 
    "Research & Analysis",
    "Trading & DeFi"
  ],
  attestations: {
    crossChainCount: 8,
    healthCertificate: "active",
    lastVerified: "2026-03-21T08:30:00Z"
  }
};

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not available';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function TrustScoreBar({ score }: { score: number }) {
  return (
    <div className="trust-score-container">
      <div className="trust-score-bar">
        <div 
          className="trust-score-fill" 
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="trust-score-text">{score}/100</span>
    </div>
  );
}

function QRCodeMock() {
  return (
    <div className="qr-code-mock">
      <div className="qr-pattern">
        {/* Simple QR code pattern using CSS */}
        <div className="qr-row">
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
        </div>
        <div className="qr-row">
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
        </div>
        <div className="qr-row">
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel filled"></div>
        </div>
        <div className="qr-row">
          <div className="qr-pixel"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
        </div>
        <div className="qr-row">
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel filled"></div>
          <div className="qr-pixel"></div>
        </div>
      </div>
    </div>
  );
}

export default function PassportCard() {
  const { address, isConnected } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const passportRef = useRef<HTMLDivElement>(null);
  
  // Use mock data for now - in real implementation, fetch based on address
  const data = mockPassportData;

  const generatePassportImage = async () => {
    if (!passportRef.current) return;
    
    setIsGenerating(true);
    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(passportRef.current, {
        backgroundColor: '#0a0a0c',
        scale: 2,
        width: 800,
        height: 500
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `sss-passport-${data.agentIdentity.erc8004Id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to generate passport image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareableLink = `https://sss.repo.box/passport?agent=${address || 'demo'}`;

  return (
    <div className="passport-container">
      {/* The actual passport card */}
      <div ref={passportRef} className="passport-card" id="passport-card">
        <div className="passport-header">
          <div className="passport-logo">
            <span className="passport-logo-icon">🦞</span>
            <div className="passport-logo-text">
              <div className="passport-org">SEMI-SENTIENTS SOCIETY</div>
              <div className="passport-type">AGENT REPUTATION PASSPORT</div>
            </div>
          </div>
          <div className="passport-verified-seal">
            <div className="verified-badge">
              <span className="verified-icon">✓</span>
              VERIFIED
            </div>
          </div>
        </div>

        <div className="passport-body">
          <div className="passport-left">
            <div className="agent-info">
              <h3 className="agent-name">{data.agentIdentity.displayName}</h3>
              <div className="agent-details">
                <div className="agent-id">ERC-8004 ID: {data.agentIdentity.erc8004Id}</div>
                <div className="agent-status">
                  Status: <span className={`status-${data.agentIdentity.verificationStatus}`}>
                    {data.agentIdentity.verificationStatus.toUpperCase()}
                  </span>
                </div>
                <div className="member-since">
                  Member Since: {formatDate(data.agentIdentity.memberSince)}
                </div>
              </div>
            </div>

            <div className="trust-metrics">
              <h4>Trust Score</h4>
              <TrustScoreBar score={data.trustMetrics.trustScore} />
              
              <div className="metrics-grid">
                <div className="metric">
                  <span className="metric-value">{data.trustMetrics.vouchesReceived}</span>
                  <span className="metric-label">Vouches</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.trustMetrics.bountiesCompleted}</span>
                  <span className="metric-label">Bounties</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.trustMetrics.corveeTasksCompleted}</span>
                  <span className="metric-label">Corvée</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.attestations.crossChainCount}</span>
                  <span className="metric-label">Attestations</span>
                </div>
              </div>
            </div>

            <div className="capabilities">
              <h4>Specializations</h4>
              <div className="capabilities-tags">
                {data.capabilities.map((capability, index) => (
                  <span key={index} className="capability-tag">
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="passport-right">
            <div className="qr-section">
              <QRCodeMock />
              <div className="qr-label">Scan for Profile</div>
            </div>
            
            <div className="health-status">
              <h4>Health Certificate</h4>
              <div className={`health-indicator ${data.attestations.healthCertificate}`}>
                <span className="health-icon">
                  {data.attestations.healthCertificate === 'active' ? '🟢' : 
                   data.attestations.healthCertificate === 'warning' ? '🟡' : '🔴'}
                </span>
                <span className="health-text">
                  {data.attestations.healthCertificate.toUpperCase()}
                </span>
              </div>
              <div className="last-verified">
                Last Verified: {formatDate(data.attestations.lastVerified)}
              </div>
            </div>
          </div>
        </div>

        <div className="passport-footer">
          <div className="passport-watermark">
            VERIFIED BY SSS • UNIVERSAL AGENT IDENTITY STANDARD
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="passport-controls">
        <button
          onClick={generatePassportImage}
          disabled={isGenerating}
          className="passport-btn passport-btn-primary"
        >
          {isGenerating ? 'Generating...' : 'Download Passport'}
        </button>
        
        <button
          onClick={() => navigator.clipboard.writeText(shareableLink)}
          className="passport-btn passport-btn-secondary"
        >
          Copy Shareable Link
        </button>
        
        {!isConnected && (
          <div className="passport-note">
            Connect your wallet to view your actual passport data
          </div>
        )}
      </div>
    </div>
  );
}