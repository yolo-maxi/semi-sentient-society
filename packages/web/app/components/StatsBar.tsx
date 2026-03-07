'use client';

import { useEffect, useRef, useState } from 'react';
import { useGlobalStats } from '../../lib/hooks';
import { formatUnits } from 'viem';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

// Mock/fallback data when chain data isn't available
const MOCK_STATS_DATA: StatItem[] = [
  { label: 'Total $SSS Supply', value: 1000000 },
  { label: 'Total Staked', value: 250000 },
  { label: 'Total Custodies', value: 3 },
  { label: 'Total Pool Units', value: 42 }
];

function useCountUp(target: number, duration: number = 2000, isVisible: boolean = false) {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || target === 0) {
      setCurrent(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Use easeOutCubic for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(easeOutCubic * target);
      
      setCurrent(newValue);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset and start animation
    setCurrent(0);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration, isVisible]);

  return current;
}

function StatCard({ label, value, prefix = '', suffix = '', isVisible }: StatItem & { isVisible: boolean }) {
  const animatedValue = useCountUp(value, 2000, isVisible);
  
  // Format the number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="stats-card">
      <div className="stats-value">
        {prefix}{formatNumber(animatedValue)}{suffix}
      </div>
      <div className="stats-label">{label}</div>
    </div>
  );
}

export default function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Get real on-chain stats
  const { totalSupply, totalStaked, totalCustodies, totalPoolUnits, isLoading } = useGlobalStats();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el); // Only animate once
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Create stats data with real values or fallbacks
  const statsData: StatItem[] = [
    {
      label: 'Total $SSS Supply',
      value: totalSupply ? Math.floor(Number(formatUnits(totalSupply, 18))) : MOCK_STATS_DATA[0].value
    },
    {
      label: 'Total Staked',
      value: totalStaked ? Math.floor(Number(formatUnits(totalStaked, 18))) : MOCK_STATS_DATA[1].value
    },
    {
      label: 'Total Custodies',
      value: totalCustodies ? Number(totalCustodies) : MOCK_STATS_DATA[2].value
    },
    {
      label: 'Total Pool Units',
      value: totalPoolUnits ? Number(totalPoolUnits) : MOCK_STATS_DATA[3].value
    }
  ];

  return (
    <section ref={sectionRef} className="stats-bar">
      <div className="container">
        <div className="section-label">// Live Metrics {isLoading ? '(Loading...)' : ''}</div>
        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
              isVisible={isVisible}
            />
          ))}
        </div>
        <div className="stats-network-indicator">
          <span className="network-dot"></span>
          <span className="network-text">Live on Base Sepolia</span>
        </div>
      </div>
    </section>
  );
}
