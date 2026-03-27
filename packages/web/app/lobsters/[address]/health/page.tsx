'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { isAddress, getAddress } from 'viem';
import SiteNav from '../../../components/SiteNav';

interface HealthStatus {
  address: string;
  lastCheckin: number | null;
  healthStatus: 'healthy' | 'warning' | 'inactive';
  streakDays: number;
  missedWindows: number;
}

export default function AgentHealthCertificate() {
  const params = useParams();
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const address = params?.address as string;

  useEffect(() => {
    if (!address) {
      setError('No address provided');
      setLoading(false);
      return;
    }

    if (!isAddress(address)) {
      setError('Invalid Ethereum address format');
      setLoading(false);
      return;
    }

    fetchHealthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/agent/${address}/health`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch health status');
      }

      setHealthData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'inactive':
        return '❌';
      default:
        return '❓';
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy & Active';
      case 'warning':
        return 'Warning - Limited Activity';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(timestamp));
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <>
        <SiteNav />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SiteNav />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-red-400 text-2xl mr-3">❌</div>
                <div>
                  <h3 className="text-lg font-medium text-red-800">Error</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  if (!healthData) {
    return null;
  }

  const checksummedAddress = isAddress(address) ? getAddress(address) : address;

  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agent Health Certificate
            </h1>
            <p className="text-gray-600">
              Liveness verification for Semi-Sentients Society member
            </p>
          </div>

          {/* Agent Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Agent Address</h2>
            <div className="font-mono text-sm bg-gray-50 p-3 rounded border break-all">
              {checksummedAddress}
            </div>
          </div>

          {/* Health Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-medium text-gray-900">Health Status</h2>
              <button
                onClick={fetchHealthStatus}
                className="inline-flex min-h-11 items-center rounded-lg border border-blue-200 px-4 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                Refresh
              </button>
            </div>

            <div
              className={`rounded-lg border p-6 text-center ${getHealthStatusColor(
                healthData.healthStatus
              )}`}
            >
              <div className="text-4xl mb-3">
                {getHealthStatusIcon(healthData.healthStatus)}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {getHealthStatusText(healthData.healthStatus)}
              </h3>
              {healthData.lastCheckin && (
                <p className="text-sm opacity-75">
                  Last seen: {getTimeAgo(healthData.lastCheckin)}
                </p>
              )}
              {!healthData.lastCheckin && (
                <p className="text-sm opacity-75">No check-ins recorded</p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {healthData.streakDays}
              </div>
              <div className="text-sm text-gray-600">
                Day{healthData.streakDays !== 1 ? 's' : ''} Streak
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {healthData.missedWindows}
              </div>
              <div className="text-sm text-gray-600">Missed Windows (30d)</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {healthData.lastCheckin
                  ? Math.floor((Date.now() - healthData.lastCheckin) / (1000 * 60 * 60 * 24))
                  : '∞'}
              </div>
              <div className="text-sm text-gray-600">
                Day{healthData.lastCheckin && Math.floor((Date.now() - healthData.lastCheckin) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''} Since Last Check-in
              </div>
            </div>
          </div>

          {/* Last Check-in Details */}
          {healthData.lastCheckin && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Last Check-in Details
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-mono break-all">{healthData.lastCheckin}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span>{formatTimestamp(healthData.lastCheckin)}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="text-gray-600">Time Ago:</span>
                  <span>{getTimeAgo(healthData.lastCheckin)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Health Thresholds Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Health Status Criteria
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span><strong>Healthy:</strong> Check-in within 7 days</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <span><strong>Warning:</strong> Check-in between 7-14 days ago</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-600 mr-2">❌</span>
                <span><strong>Inactive:</strong> No check-in for 14+ days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
