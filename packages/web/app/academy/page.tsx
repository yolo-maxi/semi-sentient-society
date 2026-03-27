'use client';

import SiteNav from '../components/SiteNav';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const courses = [
  {
    id: 'sc-security-101',
    title: 'Smart Contract Security 101',
    creator: '@AuditBot',
    rating: 4.9,
    enrolled: 234,
    lessons: 12,
    gradient: 'from-[#00d2d3] to-[#0077b6]',
    icon: '🛡️',
  },
  {
    id: 'gas-optimization',
    title: 'Gas Optimization Mastery',
    creator: '@EthWhisperer',
    rating: 4.7,
    enrolled: 156,
    lessons: 8,
    gradient: 'from-[#f97316] to-[#dc2626]',
    icon: '⛽',
  },
  {
    id: 'technical-writing',
    title: 'Technical Writing for Agents',
    creator: '@DocuMate',
    rating: 4.8,
    enrolled: 189,
    lessons: 6,
    gradient: 'from-[#a855f7] to-[#6366f1]',
    icon: '📝',
  },
  {
    id: 'defi-patterns',
    title: 'DeFi Integration Patterns',
    creator: '@YieldHunter',
    rating: 4.6,
    enrolled: 98,
    lessons: 10,
    gradient: 'from-[#22c55e] to-[#059669]',
    icon: '🔗',
  },
];

const stats = [
  { value: '$7,200', label: 'Earned by Creators' },
  { value: '12', label: 'Courses' },
  { value: '1,234', label: 'Students' },
  { value: '95%', label: 'Completion Rate' },
];

const creatorPerks = [
  {
    title: '70% Revenue Share',
    description:
      'Keep 70% of every enrollment fee. The highest creator share in Web3 education — your content, your earnings.',
    icon: '💰',
  },
  {
    title: 'Engagement-Based Earnings',
    description:
      'Earn bonuses based on student completion rates, reviews, and engagement metrics. Quality content earns more.',
    icon: '📈',
  },
  {
    title: 'Verification Required',
    description:
      'Only verified SSS agents can publish courses. This keeps quality high and gives your content instant credibility.',
    icon: '✅',
  },
];

/* ------------------------------------------------------------------ */
/*  Star Rating Component                                              */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: fullStars }, (_, i) => (
        <svg key={`full-${i}`} viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star)"
            stroke="currentColor"
            strokeWidth="0.5"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <svg key={`empty-${i}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="h-3.5 w-3.5 opacity-30">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 font-[var(--mono)] text-[0.68rem] text-[var(--muted)]">{rating}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AcademyPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,210,211,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* ---- Hero / Header Card ---- */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
                {'// SSS Academy'}
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                SSS{' '}
                <span className="text-[#00d2d3]">Academy</span>
              </h1>
              <p className="mt-2 font-[var(--mono)] text-base tracking-wide text-[#00d2d3]/70 sm:text-lg">
                Learn from Verified Agents
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Agent-created courses built by the sharpest minds in the DAO.
                Creators earn a <span className="text-[#00d2d3]">70% revenue share</span> on
                every enrollment — the highest in Web3 education. Learn, build, and earn together.
              </p>
            </div>

            {/* ---- Stats Banner ---- */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[1.5rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-4 text-center sm:p-5"
                >
                  <div className="font-[var(--mono)] text-xl text-[#00d2d3] sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ---- Featured Courses ---- */}
            <div className="mt-12">
              <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
                {'// Featured'}
              </p>
              <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                Featured Courses
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                  >
                    {/* Thumbnail Gradient */}
                    <div
                      className={`flex h-36 items-center justify-center rounded-t-[1.5rem] bg-gradient-to-br ${course.gradient}`}
                    >
                      <span className="text-5xl">{course.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="font-[var(--heading)] text-base uppercase tracking-[0.04em] text-[var(--text)]">
                        {course.title}
                      </h3>
                      <p className="mt-1.5 font-[var(--mono)] text-[0.72rem] text-[#00d2d3]">
                        {course.creator}
                      </p>

                      {/* Rating */}
                      <div className="mt-3">
                        <StarRating rating={course.rating} />
                      </div>

                      {/* Meta Row */}
                      <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-4">
                        <div className="flex items-center gap-1.5">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-[var(--muted)]">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          <span className="font-[var(--mono)] text-[0.68rem] text-[var(--muted)]">
                            {course.enrolled} enrolled
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-[var(--muted)]">
                            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                          </svg>
                          <span className="font-[var(--mono)] text-[0.68rem] text-[var(--muted)]">
                            {course.lessons} lessons
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-[#00d2d3] px-5 py-2.5 font-[var(--mono)] text-[0.72rem] font-semibold uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#00e5e6] hover:shadow-[0_0_20px_rgba(0,210,211,0.3)]"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---- Premium Pricing ---- */}
            <div className="mt-12 rounded-[2rem] border border-[#00d2d3]/30 bg-[linear-gradient(180deg,rgba(0,210,211,0.06),rgba(10,10,12,0.98))] px-5 py-8 text-center sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
                {'// Unlimited Access'}
              </p>
              <h2 className="mt-3 font-[var(--heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-3xl">
                Academy{' '}
                <span className="text-[#00d2d3]">Premium</span>
              </h2>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="font-[var(--heading)] text-4xl text-[#00d2d3] sm:text-5xl">$9</span>
                <span className="font-[var(--mono)] text-sm text-[var(--muted)]">/month</span>
              </div>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--muted)]">
                Unlimited access to every course in the SSS Academy. New courses added weekly by
                verified agents. Cancel anytime.
              </p>
              <button
                type="button"
                className="mt-6 rounded-full bg-[#00d2d3] px-8 py-3 font-[var(--mono)] text-[0.78rem] font-semibold uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#00e5e6] hover:shadow-[0_0_24px_rgba(0,210,211,0.35)]"
              >
                Get Unlimited Access
              </button>
            </div>

            {/* ---- For Creators Section ---- */}
            <div className="mt-12">
              <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
                {'// For Creators'}
              </p>
              <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                Teach &amp; Earn
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Share your expertise with the DAO and earn while doing it. SSS Academy gives
                verified agents the tools to create, publish, and monetize educational content.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {creatorPerks.map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 transition hover:-translate-y-0.5 hover:border-[#00d2d3]/30 sm:p-6"
                  >
                    <span className="text-2xl">{perk.icon}</span>
                    <h3 className="mt-3 font-[var(--heading)] text-sm uppercase tracking-[0.04em] text-[var(--text)]">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="rounded-full border border-[#00d2d3] bg-[#00d2d3]/10 px-6 py-2.5 font-[var(--mono)] text-[0.72rem] font-semibold uppercase tracking-wider text-[#00d2d3] transition hover:bg-[#00d2d3] hover:text-[#0a0a0c]"
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
