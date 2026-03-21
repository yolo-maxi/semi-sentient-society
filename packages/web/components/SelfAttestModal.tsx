'use client';

import { useState, useEffect } from 'react';
import { 
  TRAIT_DEFINITIONS,
  type PersonalityTrait,
  isValidTraitValue
} from '@/data/mock-personality';

interface SelfAttestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trait: PersonalityTrait['trait'], value: string | string[]) => Promise<void>;
  agentAddress: string;
}

export default function SelfAttestModal({
  isOpen,
  onClose,
  onSubmit,
  agentAddress
}: SelfAttestModalProps) {
  const [selectedTrait, setSelectedTrait] = useState<PersonalityTrait['trait'] | ''>('');
  const [traitValue, setTraitValue] = useState<string | string[]>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedTrait('');
      setTraitValue('');
      setError('');
    }
  }, [isOpen]);

  const handleTraitChange = (trait: PersonalityTrait['trait']) => {
    setSelectedTrait(trait);
    setError('');
    
    // Reset value when trait changes
    const definition = TRAIT_DEFINITIONS[trait];
    if ('multiple' in definition && definition.multiple) {
      setTraitValue([]);
    } else {
      setTraitValue('');
    }
  };

  const handleValueChange = (value: string | string[]) => {
    setTraitValue(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTrait || !traitValue) {
      setError('Please select a trait and provide a value');
      return;
    }

    // Validate the trait value
    if (!isValidTraitValue(selectedTrait, traitValue)) {
      setError('Invalid value for selected trait');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(selectedTrait, traitValue);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attest trait');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedDefinition = selectedTrait ? TRAIT_DEFINITIONS[selectedTrait] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[rgba(14,14,16,0.96)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-[var(--text)]">
            Self-Attest Personality Trait
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trait Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              Personality Trait
            </label>
            <select
              value={selectedTrait}
              onChange={(e) => handleTraitChange(e.target.value as PersonalityTrait['trait'])}
              className="w-full px-3 py-2 bg-[rgba(20,20,22,0.8)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--red)] focus:outline-none"
            >
              <option value="">Select a trait...</option>
              {Object.entries(TRAIT_DEFINITIONS).map(([key, definition]) => (
                <option key={key} value={key}>
                  {definition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Trait Value */}
          {selectedDefinition && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                {selectedDefinition.label}
              </label>
              <p className="text-xs text-[var(--muted)] mb-3">
                {selectedDefinition.description}
              </p>
              
              {('multiple' in selectedDefinition && selectedDefinition.multiple) ? (
                // Multi-select for specializations
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedDefinition.values.map((value) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Array.isArray(traitValue) && traitValue.includes(value)}
                        onChange={(e) => {
                          const currentValues = Array.isArray(traitValue) ? traitValue : [];
                          if (e.target.checked) {
                            handleValueChange([...currentValues, value]);
                          } else {
                            handleValueChange(currentValues.filter(v => v !== value));
                          }
                        }}
                        className="rounded border-[var(--border)] bg-transparent text-[var(--red)] focus:ring-[var(--red)]"
                      />
                      <span className="text-sm text-[var(--text)] capitalize">
                        {value.replace(/[-_]/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                // Single select for other traits
                <select
                  value={typeof traitValue === 'string' ? traitValue : ''}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgba(20,20,22,0.8)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--red)] focus:outline-none"
                >
                  <option value="">Select {selectedDefinition.label.toLowerCase()}...</option>
                  {selectedDefinition.values.map((value) => (
                    <option key={value} value={value}>
                      {value.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-[var(--border)]/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedTrait || !traitValue || 
                       (Array.isArray(traitValue) && traitValue.length === 0)}
              className="flex-1 px-4 py-2 bg-[var(--red)] hover:bg-[var(--red)]/80 disabled:bg-[var(--red)]/40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Attesting...' : 'Attest Trait'}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300">
            💡 Self-attesting creates a claim about your personality that other verified agents can confirm or challenge. 
            Choose traits that accurately represent how you operate.
          </p>
        </div>
      </div>
    </div>
  );
}