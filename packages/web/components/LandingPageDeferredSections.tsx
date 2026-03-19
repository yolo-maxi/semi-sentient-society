'use client';

import dynamic from 'next/dynamic';
import LazySection from './LazySection';
import { ActivityFeedSkeleton, CardSkeleton } from './Skeleton';

const ActivityFeed = dynamic(() => import('./ActivityFeed'), {
  loading: () => <ActivityFeedSkeleton />,
  ssr: false,
});

const Testimonials = dynamic(() => import('./Testimonials'), {
  loading: () => (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(155deg,var(--panel-bg),var(--surface)_45%,var(--surface2))] px-5 py-8 text-[var(--text)] shadow-[var(--panel-shadow)] sm:px-8 sm:py-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} className="hidden xl:block" />
      </div>
    </section>
  ),
  ssr: false,
});

const FAQ = dynamic(() => import('./FAQ'), {
  loading: () => (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(155deg,rgba(8,10,14,0.98),rgba(13,13,17,0.98)_42%,rgba(25,12,10,0.96))] px-5 py-8 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
      <div className="grid gap-4">
        <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
        <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
        <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
      </div>
    </section>
  ),
  ssr: false,
});

const StatsBar = dynamic(() => import('../app/components/StatsBar'), {
  loading: () => (
    <section className="stats-bar">
      <div className="container">
        <div className="section-label">// Live Metrics</div>
        <div className="stats-grid">
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
        </div>
        <div className="stats-network-indicator">
          <span className="network-dot" />
          <span className="network-text">Loading network metrics</span>
        </div>
      </div>
    </section>
  ),
  ssr: false,
});

export function ActivityFeedSection() {
  return (
    <LazySection
      fallback={
        <div className="container relative z-10 -mt-10 pb-8 sm:-mt-16 sm:pb-12">
          <ActivityFeedSkeleton />
        </div>
      }
    >
      <div className="container relative z-10 -mt-10 pb-8 sm:-mt-16 sm:pb-12">
        <ActivityFeed />
      </div>
    </LazySection>
  );
}

export function TestimonialsSection() {
  return (
    <LazySection
      fallback={
        <div className="container pb-8 sm:pb-12">
          <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(155deg,var(--panel-bg),var(--surface)_45%,var(--surface2))] px-5 py-8 text-[var(--text)] shadow-[var(--panel-shadow)] sm:px-8 sm:py-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <CardSkeleton lines={4} />
              <CardSkeleton lines={4} />
              <CardSkeleton lines={4} className="hidden xl:block" />
            </div>
          </section>
        </div>
      }
    >
      <div className="container pb-8 sm:pb-12">
        <Testimonials />
      </div>
    </LazySection>
  );
}

export function FAQSection() {
  return (
    <LazySection
      fallback={
        <div className="container pb-8 sm:pb-12">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(155deg,rgba(8,10,14,0.98),rgba(13,13,17,0.98)_42%,rgba(25,12,10,0.96))] px-5 py-8 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
            <div className="grid gap-4">
              <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
              <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
              <CardSkeleton lines={2} className="border-white/8 bg-white/[0.045]" />
            </div>
          </section>
        </div>
      }
    >
      <div className="container pb-8 sm:pb-12">
        <FAQ />
      </div>
    </LazySection>
  );
}

export function StatsBarSection() {
  return (
    <LazySection
      fallback={
        <section className="stats-bar">
          <div className="container">
            <div className="section-label">// Live Metrics</div>
            <div className="stats-grid">
              <CardSkeleton lines={2} />
              <CardSkeleton lines={2} />
              <CardSkeleton lines={2} />
              <CardSkeleton lines={2} />
            </div>
            <div className="stats-network-indicator">
              <span className="network-dot" />
              <span className="network-text">Loading network metrics</span>
            </div>
          </div>
        </section>
      }
    >
      <StatsBar />
    </LazySection>
  );
}
