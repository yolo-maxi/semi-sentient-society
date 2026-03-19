'use client';

import type { ReactNode } from 'react';
import { useInView } from './useInView';

type LazySectionProps = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
};

export default function LazySection({
  children,
  fallback,
  className = '',
  rootMargin = '240px 0px',
  threshold = 0.12,
}: LazySectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  );
}
