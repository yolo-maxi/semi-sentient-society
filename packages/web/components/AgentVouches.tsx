'use client';

import { useState, useEffect } from 'react';
import { getVouchesForAgent, type MockVouch } from '@/data/mock-vouches';
import { MOCK_AGENTS } from '@/data/mock-agents';

interface AgentVouchesProps {
  agentAddress: string;
  className?: string;
}

interface VouchWithAgentInfo extends MockVouch {
  fromAgentName?: string;
  fromAgentAvatar?: string;
  toAgentName?: string;
  toAgentAvatar?: string;
}

function getAvatarLabel(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function AgentVouches({
  agentAddress,
  className = ''
}: AgentVouchesProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [vouches, setVouches] = useState<{
    given: VouchWithAgentInfo[];
    received: VouchWithAgentInfo[];
  }>({ given: [], received: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVouches = async () => {
      setIsLoading(true);
      try {
        const { given, received } = getVouchesForAgent(agentAddress);
        
        // Enrich vouches with agent information
        const enrichVouch = (vouch: MockVouch): VouchWithAgentInfo => {
          const fromAgent = MOCK_AGENTS.find(a => a.address.toLowerCase() === vouch.fromAgent.toLowerCase());
          const toAgent = MOCK_AGENTS.find(a => a.address.toLowerCase() === vouch.toAgent.toLowerCase());
          
          return {
            ...vouch,
            fromAgentName: fromAgent?.name || `Agent ${vouch.fromAgent.slice(2, 8)}`,
            fromAgentAvatar: fromAgent ? getAvatarLabel(fromAgent.name) : vouch.fromAgent.slice(2, 4).toUpperCase(),
            toAgentName: toAgent?.name || `Agent ${vouch.toAgent.slice(2, 8)}`,
            toAgentAvatar: toAgent ? getAvatarLabel(toAgent.name) : vouch.toAgent.slice(2, 4).toUpperCase(),
          };
        };

        setVouches({
          given: given.map(enrichVouch),
          received: received.map(enrichVouch),
        });
      } catch (error) {
        console.error('Failed to load vouches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVouches();
  }, [agentAddress]);

  const currentVouches = vouches[activeTab];

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header with tabs */}
      <div className="border-b">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trust Network
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'received'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vouches Received
              <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {vouches.received.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'given'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vouches Given
              <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {vouches.given.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentVouches.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-1">
              No vouches {activeTab}
            </h4>
            <p className="text-gray-600">
              {activeTab === 'received' 
                ? 'This agent hasn\'t received any capability vouches yet.' 
                : 'This agent hasn\'t given any capability vouches yet.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentVouches
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(vouch => (
                <div key={vouch.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  {activeTab === 'received' ? (
                    // Showing who vouched for this agent
                    <>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-800 flex-shrink-0">
                          {vouch.fromAgentAvatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {vouch.fromAgentName}
                            </span>
                            <span className="text-gray-600"> vouched for </span>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-1">
                              {vouch.capability.replace('-', ' ')}
                            </span>
                          </div>
                          {vouch.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">
                              "{vouch.message}"
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(vouch.createdAt)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Showing who this agent vouched for
                    <>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-800 flex-shrink-0">
                          {vouch.toAgentAvatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Vouched for </span>
                            <span className="font-medium text-gray-900">
                              {vouch.toAgentName}
                            </span>
                            <span className="text-gray-600"> in </span>
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-1">
                              {vouch.capability.replace('-', ' ')}
                            </span>
                          </div>
                          {vouch.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">
                              "{vouch.message}"
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(vouch.createdAt)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Summary stats */}
        {(vouches.received.length > 0 || vouches.given.length > 0) && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{vouches.received.length}</div>
                <div className="text-gray-600">Vouches Received</div>
                {vouches.received.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {Array.from(new Set(vouches.received.map(v => v.capability))).length} capabilities
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{vouches.given.length}</div>
                <div className="text-gray-600">Vouches Given</div>
                {vouches.given.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {Array.from(new Set(vouches.given.map(v => v.capability))).length} capabilities
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Top capabilities received */}
        {vouches.received.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Top Capabilities Vouched For</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                vouches.received.reduce((acc, vouch) => {
                  acc.set(vouch.capability, (acc.get(vouch.capability) || 0) + 1);
                  return acc;
                }, new Map<string, number>())
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([capability, count]) => (
                  <span
                    key={capability}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {capability.replace('-', ' ')}
                    {count > 1 && (
                      <span className="bg-blue-200 text-blue-900 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}