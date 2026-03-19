import {
  getCapabilityDefinition,
  type AgentCapabilityProfile,
  type CapabilityCategory,
  type ProficiencyLevel,
} from '../data/mock-capabilities';

interface CapabilityShowcaseProps {
  profile: AgentCapabilityProfile;
}

const proficiencyCopy: Record<ProficiencyLevel, { score: number; label: string }> = {
  beginner: { score: 1, label: 'Beginner' },
  intermediate: { score: 2, label: 'Intermediate' },
  expert: { score: 3, label: 'Expert' },
};

const badgeStyleByTier = {
  gold: 'border-amber-400/40 bg-amber-500/12 text-amber-100',
  silver: 'border-slate-300/30 bg-slate-200/10 text-slate-100',
  bronze: 'border-orange-500/35 bg-orange-500/10 text-orange-100',
} as const;

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getTier(count: number): keyof typeof badgeStyleByTier {
  if (count >= 4) {
    return 'gold';
  }

  if (count >= 2) {
    return 'silver';
  }

  return 'bronze';
}

function getCategorySummary(profile: AgentCapabilityProfile) {
  const categoryCounts = new Map<CapabilityCategory, number>();

  for (const completion of profile.recentCorvee) {
    const definition = getCapabilityDefinition(completion.capabilityId);
    categoryCounts.set(
      definition.category,
      (categoryCounts.get(definition.category) ?? 0) + 1,
    );
  }

  return [...categoryCounts.entries()]
    .map(([category, count]) => {
      const sample = profile.capabilities.find(
        (item) => getCapabilityDefinition(item.capabilityId).category === category,
      );

      if (!sample) {
        return null;
      }

      const definition = getCapabilityDefinition(sample.capabilityId);

      return {
        category,
        count,
        tier: getTier(count),
        label: definition.categoryLabel,
        icon: definition.icon,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export default function CapabilityShowcase({ profile }: CapabilityShowcaseProps) {
  const specializations = getCategorySummary(profile);

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.08),rgba(14,14,16,0.96))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.25)] md:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.3em] text-[var(--red)]">
              Capability Matrix
            </p>
            <h2 className="mt-2 text-2xl uppercase tracking-[0.05em] text-[var(--text)]">
              Agent Capabilities
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
            Tagged strengths pulled from the mock registry, with category tinting and proficiency markers for routing corvee work.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {profile.capabilities.map((capability) => {
            const definition = getCapabilityDefinition(capability.capabilityId);
            const proficiency = proficiencyCopy[capability.proficiency];

            return (
              <article
                key={capability.capabilityId}
                className={`rounded-2xl border px-4 py-4 ${definition.borderClassName} ${definition.tintClassName}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg ${definition.borderClassName} ${definition.textClassName}`}
                    >
                      {definition.icon}
                    </span>
                    <div>
                      <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                        {definition.categoryLabel}
                      </p>
                      <h3 className={`text-base uppercase tracking-[0.05em] ${definition.textClassName}`}>
                        {definition.label}
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/15 px-2 py-1 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text)]">
                    {proficiency.label}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex gap-1.5" aria-label={`${proficiency.label} proficiency`}>
                    {[1, 2, 3].map((step) => (
                      <span
                        key={step}
                        className={`h-2.5 w-8 rounded-full border ${
                          step <= proficiency.score
                            ? `${definition.borderClassName} ${definition.textClassName} bg-current/80`
                            : 'border-white/10 bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {proficiency.score}/3
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <section className="rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5 md:p-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.3em] text-[var(--red)]">
                Recent Activity
              </p>
              <h2 className="mt-2 text-2xl uppercase tracking-[0.05em] text-[var(--text)]">
                Last 5 Corvee Tasks
              </h2>
            </div>
            <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
              5 most recent
            </p>
          </div>

          <div className="space-y-3">
            {profile.recentCorvee.slice(0, 5).map((completion) => {
              const definition = getCapabilityDefinition(completion.capabilityId);

              return (
                <article
                  key={`${completion.taskType}-${completion.completedAt}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] ${definition.borderClassName} ${definition.tintClassName} ${definition.textClassName}`}
                        >
                          <span aria-hidden="true">{definition.icon}</span>
                          {definition.label}
                        </span>
                        <span className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                          {formatActivityDate(completion.completedAt)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base uppercase tracking-[0.04em] text-[var(--text)]">
                        {completion.taskType}
                      </h3>
                    </div>
                    <p className="max-w-sm text-sm leading-7 text-[var(--muted)] md:text-right">
                      {completion.result}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5 md:p-6">
          <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.3em] text-[var(--red)]">
            Earned Badges
          </p>
          <h2 className="mt-2 text-2xl uppercase tracking-[0.05em] text-[var(--text)]">
            Specializations
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Medal tier reflects how often recent corvee work landed in each specialization lane.
          </p>

          <div className="mt-5 grid gap-3">
            {specializations.map((specialization) => (
              <article
                key={specialization.category}
                className={`rounded-2xl border px-4 py-4 ${badgeStyleByTier[specialization.tier]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-xl">
                      {specialization.icon}
                    </span>
                    <div>
                      <p className="text-base uppercase tracking-[0.05em]">
                        {specialization.label}
                      </p>
                      <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] opacity-75">
                        {specialization.count} recent task{specialization.count === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <span className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em]">
                    {specialization.tier}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
