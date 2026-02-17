'use client';

import { useRef, useEffect, useState } from 'react';
import ParticleEmitter from './ParticleEmitter';

interface SectionHeadingProps {
  label: string;
  children: React.ReactNode;
  particles?: boolean;
}

/** Section heading with particle underline on the .red keyword. */
export default function SectionHeading({ label, children, particles = true }: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [redMetrics, setRedMetrics] = useState<{ width: number; left: number } | null>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const measure = () => {
      const h2 = headingRef.current;
      const el = h2?.querySelector('.red') as HTMLElement | null;
      if (el && h2) {
        const h2Rect = h2.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setRedMetrics({
          width: elRect.width,
          left: elRect.left - h2Rect.left,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <>
      <div className="section-label">{label}</div>
      <h2 ref={headingRef} style={{ position: 'relative' }}>
        {children}
        {/* Tight underline + particles right beneath the .red word */}
        {/*particles && redMetrics && (
          <span style={{
            position: 'absolute',
            left: redMetrics.left,
            bottom: 6,
            width: redMetrics.width,
            height: 5,
            background: 'var(--red)',
            opacity: 0.7,
            borderRadius: 1,
          }} />
        )}*/}
        {particles && redMetrics && (
          <span style={{
            position: 'absolute',
            left: redMetrics.left,
            bottom: -12,
            width: redMetrics.width,
            height: 36,
            pointerEvents: 'none',
          }}>
            <ParticleEmitter
              shape="underline"
              width={Math.round(redMetrics.width)-5}
              height={56}
              count={850}
              spread={28}
              intensity={2}
            />
          </span>
        )}
      </h2>
    </>
  );
}
