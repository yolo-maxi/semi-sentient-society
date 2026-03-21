'use client';

import { useEffect, useState } from 'react';

interface HealthBadgeProps {
  address: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'inactive';
  lastSeen: number | null;
  healthScore: number;
}

function getStatusConfig(status: HealthStatus['status']) {
  switch (status) {
    case 'healthy':
      return {
        icon: '🟢',
        label: 'Active',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-400/30',
      };
    case 'warning':
      return {
        icon: '🟡',
        label: 'Stale',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-400/30',
      };
    case 'inactive':
      return {
        icon: '🔴',
        label: 'Inactive',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-400/30',
      };
  }
}

function getSizeClasses(size: HealthBadgeProps['size']) {
  switch (size) {
    case 'sm':
      return {
        wrapper: 'px-2 py-1 text-xs',
        icon: 'text-xs',
      };
    case 'lg':
      return {
        wrapper: 'px-4 py-2 text-base',
        icon: 'text-base',
      };
    default: // 'md'
      return {
        wrapper: 'px-3 py-1.5 text-sm',
        icon: 'text-sm',
      };
  }
}

function formatLastSeen(lastSeen: number | null): string {
  if (!lastSeen) return 'Never seen';
  
  const now = Date.now();
  const diff = now - lastSeen;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
}

export default function HealthBadge({ 
  address, 
  size = 'md', 
  showLabel = true, 
  className = '' 
}: HealthBadgeProps) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealthStatus() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/agents/${address}/health`);
        
        if (!response.ok) {
          // If agent is not verified or doesn't exist, don't show error
          if (response.status === 404) {
            setHealthStatus(null);
            return;
          }
          throw new Error('Failed to fetch health status');
        }
        
        const data = await response.json();
        setHealthStatus({
          status: data.status,
          lastSeen: data.lastSeen,
          healthScore: data.healthScore,
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.warn('Failed to fetch health status for', address, err);
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      fetchHealthStatus();
    }
  }, [address]);

  // Don't render anything while loading or if no health data available
  if (loading || !healthStatus || error) {
    return null;
  }

  const statusConfig = getStatusConfig(healthStatus.status);
  const sizeClasses = getSizeClasses(size);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${statusConfig.borderColor} ${statusConfig.bgColor} ${sizeClasses.wrapper} ${className}`}
      title={`Health: ${statusConfig.label} (Score: ${healthStatus.healthScore}/100) - Last seen: ${formatLastSeen(healthStatus.lastSeen)}`}
    >
      <span className={sizeClasses.icon}>
        {statusConfig.icon}
      </span>
      {showLabel && (
        <span className={`font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      )}
    </div>
  );
}

// Simplified version that just shows the icon for tight spaces
export function HealthIcon({ address, className = '' }: { address: string; className?: string }) {
  return (
    <HealthBadge 
      address={address} 
      size="sm" 
      showLabel={false} 
      className={className}
    />
  );
}