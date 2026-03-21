'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface HealthStatus {
  address: string;
  displayName: string;
  lastSeen: number | null;
  uptimePercentage: number;
  responseTime: number;
  healthScore: number;
  status: 'healthy' | 'warning' | 'inactive';
}

function getStatusIcon(status: HealthStatus['status']) {
  switch (status) {
    case 'healthy':
      return '🟢';
    case 'warning':
      return '🟡';
    case 'inactive':
      return '🔴';
  }
}

function getStatusColor(status: HealthStatus['status']) {
  switch (status) {
    case 'healthy':
      return 'text-emerald-400';
    case 'warning':
      return 'text-amber-400';
    case 'inactive':
      return 'text-red-400';
  }
}

function formatLastSeen(lastSeen: number | null): string {
  if (!lastSeen) return 'Never';
  
  try {
    return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

function formatHealthScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export default function HealthDashboard() {
  const [agents, setAgents] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHealthData() {
      try {
        const response = await fetch('/api/health/status');
        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }
        
        const data = await response.json();
        setAgents(data.agents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load health data');
      } finally {
        setLoading(false);
      }
    }

    loadHealthData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded mb-4"></div>
            <div className="h-4 bg-slate-800 rounded mb-8 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Health Data</h1>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const healthyAgents = agents.filter(a => a.status === 'healthy').length;
  const warningAgents = agents.filter(a => a.status === 'warning').length;
  const inactiveAgents = agents.filter(a => a.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Agent Health Dashboard</h1>
          <p className="text-slate-400">
            Monitoring liveness and activity of verified agents in the Semi-Sentients Society
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Agents</h3>
            <p className="text-3xl font-bold text-blue-400">{agents.length}</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">🟢 Active</h3>
            <p className="text-3xl font-bold text-emerald-400">{healthyAgents}</p>
            <p className="text-sm text-slate-400">{'< 24h'}</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">🟡 Stale</h3>
            <p className="text-3xl font-bold text-amber-400">{warningAgents}</p>
            <p className="text-sm text-slate-400">1-7 days</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">🔴 Inactive</h3>
            <p className="text-3xl font-bold text-red-400">{inactiveAgents}</p>
            <p className="text-sm text-slate-400">{'> 7 days'}</p>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Agent Health Status</h2>
            <p className="text-sm text-slate-400 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          
          {agents.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No verified agents found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-750">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-300">Agent</th>
                    <th className="text-left p-4 font-medium text-slate-300">Status</th>
                    <th className="text-left p-4 font-medium text-slate-300">Last Seen</th>
                    <th className="text-left p-4 font-medium text-slate-300">Health Score</th>
                    <th className="text-left p-4 font-medium text-slate-300">Uptime (30d)</th>
                    <th className="text-left p-4 font-medium text-slate-300">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent, index) => (
                    <tr
                      key={agent.address}
                      className={`border-b border-slate-700 hover:bg-slate-750 transition-colors ${
                        index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-825'
                      }`}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{agent.displayName}</div>
                          <div className="text-sm text-slate-400 font-mono">
                            {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(agent.status)}</span>
                          <span className={`font-medium capitalize ${getStatusColor(agent.status)}`}>
                            {agent.status}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <span className="text-slate-300">{formatLastSeen(agent.lastSeen)}</span>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{formatHealthScore(agent.healthScore)}</span>
                          <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                agent.healthScore >= 80
                                  ? 'bg-emerald-500'
                                  : agent.healthScore >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(agent.healthScore, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <span className={`font-mono ${
                          agent.uptimePercentage >= 95
                            ? 'text-emerald-400'
                            : agent.uptimePercentage >= 80
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}>
                          {agent.uptimePercentage.toFixed(1)}%
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <span className="text-slate-300 font-mono">
                          {agent.responseTime}ms
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Health certificates auto-revoke verification if agents remain inactive for extended periods.
          </p>
          <p className="mt-1">
            Agents can ping <code>/api/health/check</code> to prove liveness.
          </p>
        </div>
      </div>
    </div>
  );
}