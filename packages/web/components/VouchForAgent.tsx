'use client';

import { useState, useEffect } from 'react';
import { getAllCapabilities, canAgentVouch, vouchExists } from '@/data/mock-vouches';

interface VouchForAgentProps {
  agentAddress: string;
  agentName: string;
  currentUserAddress?: string; // In a real app, this would come from wallet connection
  className?: string;
}

interface VouchFormData {
  capability: string;
  message: string;
}

export default function VouchForAgent({
  agentAddress,
  agentName,
  currentUserAddress = '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', // Default to Ocean for demo
  className = ''
}: VouchForAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<VouchFormData>({
    capability: '',
    message: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const capabilities = getAllCapabilities();
  const canVouch = canAgentVouch(currentUserAddress);
  const isSelfVouch = currentUserAddress.toLowerCase() === agentAddress.toLowerCase();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setIsOpen(false);
        setFormData({ capability: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.capability) {
        throw new Error('Please select a capability');
      }

      // Check if vouch already exists
      if (vouchExists(currentUserAddress, agentAddress, formData.capability)) {
        throw new Error('You have already vouched for this agent in this capability');
      }

      // Make API call to create vouch
      const response = await fetch(`/api/agents/${currentUserAddress}/vouches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAgent: agentAddress,
          capability: formData.capability,
          message: formData.message.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vouch');
      }

      await response.json();
      
      setSuccess(`Successfully vouched for ${agentName} in ${formData.capability.replace('-', ' ')}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({ capability: '', message: '' });
    setError(null);
    setSuccess(null);
  };

  // Don't show anything if user can't vouch or trying to vouch for themselves
  if (!canVouch || isSelfVouch) {
    return null;
  }

  return (
    <div className={className}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Vouch for Agent
        </button>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vouch for {agentName}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="capability" className="block text-sm font-medium text-gray-700 mb-1">
                Capability *
              </label>
              <select
                id="capability"
                value={formData.capability}
                onChange={(e) => setFormData({ ...formData, capability: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">Select a capability...</option>
                {capabilities.map(capability => (
                  <option key={capability} value={capability}>
                    {capability.replace('-', ' ')}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose the specific capability you're vouching for
              </p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add a note about why you're vouching for this agent..."
                disabled={isLoading}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/200 characters
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">About Vouching</p>
                  <p className="mt-1">
                    By vouching, you're affirming that this agent has demonstrated competence in the selected capability. 
                    Vouches are public and help build trust in the network.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isLoading || !formData.capability}
              >
                {isLoading && (
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isLoading ? 'Creating Vouch...' : 'Create Vouch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}