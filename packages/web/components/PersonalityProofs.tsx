'use client';

import { useState, useEffect } from 'react';
import { 
  getPersonalityProfile, 
  type PersonalityProfile, 
  type PersonalityTrait,
  TRAIT_DEFINITIONS,
  formatTraitValue,
  canAgentConfirmOrChallenge
} from '@/data/mock-personality';
import SelfAttestModal from './SelfAttestModal';

interface PersonalityProofsProps {
  agentAddress: string;
  className?: string;
}

interface TraitBadgeProps {
  trait: PersonalityTrait;
  onConfirm?: () => void;
  onChallenge?: () => void;
  canInteract: boolean;
  viewerAddress?: string;
}

function TraitBadge({ trait, onConfirm, onChallenge, canInteract, viewerAddress }: TraitBadgeProps) {
  const definition = TRAIT_DEFINITIONS[trait.trait];
  const hasViewerConfirmed = viewerAddress && trait.confirmedBy.includes(viewerAddress);
  const hasViewerChallenged = viewerAddress && trait.challengedBy.includes(viewerAddress);
  
  const getConfidenceColor = (confirmations: number, challenges: number) => {
    const total = confirmations + challenges;
    if (total === 0) return 'border-gray-400/30 bg-gray-500/10';
    
    const ratio = confirmations / total;
    if (ratio >= 0.8) return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
    if (ratio >= 0.6) return 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200';
    return 'border-red-400/30 bg-red-500/10 text-red-200';
  };

  return (
    <div className="group relative">
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${getConfidenceColor(trait.confirmations, trait.challenges)}`}>
        <span className="text-sm font-medium">
          {definition.label}: {formatTraitValue(trait.value)}
        </span>
        
        {trait.confirmations > 0 && (
          <span className="flex items-center gap-1 text-xs">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {trait.confirmations}
          </span>
        )}
        
        {trait.challenges > 0 && (
          <span className="flex items-center gap-1 text-xs">
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {trait.challenges}
          </span>
        )}
        
        {trait.selfAttested && (
          <span className="inline-flex items-center text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
            Self
          </span>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-max">
        <div className="font-medium mb-1">{definition.description}</div>
        <div className="text-gray-300">
          {trait.confirmations} confirmations, {trait.challenges} challenges
        </div>
        {trait.selfAttested && (
          <div className="text-blue-300 text-xs mt-1">Self-attested</div>
        )}
      </div>

      {/* Action buttons for verified agents */}
      {canInteract && viewerAddress && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {!hasViewerConfirmed && onConfirm && (
            <button
              onClick={onConfirm}
              className="px-2 py-1 text-xs bg-emerald-600/80 text-white rounded border border-emerald-500/50 hover:bg-emerald-500/80 transition-colors"
            >
              Confirm
            </button>
          )}
          {!hasViewerChallenged && onChallenge && (
            <button
              onClick={onChallenge}
              className="px-2 py-1 text-xs bg-red-600/80 text-white rounded border border-red-500/50 hover:bg-red-500/80 transition-colors"
            >
              Challenge
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}


export default function PersonalityProofs({
  agentAddress,
  className = ''
}: PersonalityProofsProps) {
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerAddress] = useState<string>('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'); // Mock viewer for demo
  const [showSelfAttestModal, setShowSelfAttestModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const personalityProfile = getPersonalityProfile(agentAddress);
        setProfile(personalityProfile);
      } catch (error) {
        console.error('Failed to load personality profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [agentAddress]);

  const handleConfirm = async (traitType: PersonalityTrait['trait']) => {
    if (!profile || !viewerAddress) return;
    
    try {
      const response = await fetch(`/api/agents/${agentAddress}/personality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trait: traitType,
          action: 'confirm',
          agentAddress: viewerAddress
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to confirm trait');
      }

      const result = await response.json();
      if (result.success && result.profile) {
        setProfile(result.profile);
      }
    } catch (error) {
      console.error('Failed to confirm trait:', error);
      // In a real app, show an error toast/notification
    }
  };

  const handleChallenge = async (traitType: PersonalityTrait['trait']) => {
    if (!profile || !viewerAddress) return;
    
    try {
      const response = await fetch(`/api/agents/${agentAddress}/personality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trait: traitType,
          action: 'challenge',
          agentAddress: viewerAddress
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to challenge trait');
      }

      const result = await response.json();
      if (result.success && result.profile) {
        setProfile(result.profile);
      }
    } catch (error) {
      console.error('Failed to challenge trait:', error);
      // In a real app, show an error toast/notification
    }
  };

  const handleSelfAttest = async (trait: PersonalityTrait['trait'], value: string | string[]) => {
    try {
      const response = await fetch(`/api/agents/${agentAddress}/personality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trait,
          value,
          agentAddress: viewerAddress
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to attest trait');
      }

      const result = await response.json();
      if (result.success && result.trait) {
        // Refresh the profile to show the new trait
        const updatedProfile = getPersonalityProfile(agentAddress);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Failed to self-attest trait:', error);
      throw error; // Re-throw for the modal to handle
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-6 ${className}`}>
        <h3 className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-[var(--muted)] mb-4">
          Personality Proofs
        </h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h4 className="text-lg font-medium text-[var(--text)] mb-2">
            No Personality Proofs
          </h4>
          <p className="text-[var(--muted)] text-sm">
            This agent hasn't self-attested any personality traits yet.
          </p>
        </div>
      </div>
    );
  }

  const canInteract = viewerAddress && canAgentConfirmOrChallenge(viewerAddress) && 
                     viewerAddress.toLowerCase() !== agentAddress.toLowerCase();

  // Group traits by category for better display
  const groupedTraits = {
    communication: profile.traits.filter(t => t.trait === 'communication_style'),
    performance: profile.traits.filter(t => t.trait === 'response_time'),
    expertise: profile.traits.filter(t => t.trait === 'specializations'),
    personality: profile.traits.filter(t => t.trait === 'personality_type')
  };

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            Personality Proofs
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm text-[var(--text)]">
              Credibility Score: <span className="font-medium text-emerald-400">{profile.credibilityScore}%</span>
            </div>
            <div className="text-xs text-[var(--muted)]">
              Last updated: {formatDate(profile.lastUpdated)}
            </div>
          </div>
        </div>
      </div>

      {/* Trait Categories */}
      <div className="space-y-6">
        {Object.entries(groupedTraits).map(([category, traits]) => {
          if (traits.length === 0) return null;
          
          const categoryLabels = {
            communication: 'Communication',
            performance: 'Performance',
            expertise: 'Expertise',
            personality: 'Personality'
          };

          return (
            <div key={category}>
              <h4 className="text-sm font-medium text-[var(--text)] mb-3 capitalize">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <TraitBadge
                    key={trait.trait}
                    trait={trait}
                    onConfirm={() => handleConfirm(trait.trait)}
                    onChallenge={() => handleChallenge(trait.trait)}
                    canInteract={!!canInteract}
                    viewerAddress={viewerAddress}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-[var(--border)]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-emerald-400">{profile.totalConfirmations}</div>
            <div className="text-xs text-[var(--muted)]">Total Confirmations</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">{profile.totalChallenges}</div>
            <div className="text-xs text-[var(--muted)]">Total Challenges</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--text)]">{profile.traits.length}</div>
            <div className="text-xs text-[var(--muted)]">Attested Traits</div>
          </div>
        </div>
      </div>

      {/* Self-Attest CTA (shown if viewing own profile) */}
      {viewerAddress && viewerAddress.toLowerCase() === agentAddress.toLowerCase() && (
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <button 
            onClick={() => setShowSelfAttestModal(true)}
            className="w-full min-h-11 rounded-full border border-[var(--red-dark)] bg-[var(--red)]/10 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--red)] transition hover:border-[var(--red)] hover:bg-[var(--red)]/20"
          >
            Self-Attest New Trait
          </button>
        </div>
      )}

      {/* Help Text */}
      {canInteract && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300">
            💡 As a verified agent, you can confirm or challenge this agent's personality traits. 
            Hover over traits to see interaction options.
          </p>
        </div>
      )}

      {/* Self-Attest Modal */}
      <SelfAttestModal
        isOpen={showSelfAttestModal}
        onClose={() => setShowSelfAttestModal(false)}
        onSubmit={handleSelfAttest}
        agentAddress={agentAddress}
      />
    </div>
  );
}