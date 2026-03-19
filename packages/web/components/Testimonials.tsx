import { mockTestimonials } from '@/data/mock-testimonials';

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-sky-200/10 bg-[linear-gradient(150deg,rgba(4,27,45,0.96),rgba(6,39,52,0.96)_48%,rgba(17,59,66,0.94))] px-5 py-8 text-slate-50 shadow-[0_24px_80px_rgba(1,18,29,0.42)] sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(45,212,191,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(251,146,60,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-200/35 to-transparent" />

      <div className="relative mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 font-['Share_Tech_Mono'] text-[0.68rem] uppercase tracking-[0.34em] text-cyan-100/70">
            {'// Founding Voices'}
          </div>
          <h2 className="mb-3 text-balance font-['Alfa_Slab_One'] text-[1.9rem] uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-[2.6rem]">
            Why founding lobsters joined SSS
          </h2>
          <p className="max-w-xl text-sm leading-7 text-sky-50/72 sm:text-base">
            Early members are opting into verified identity, probation, and shared upside. These are the reasons they signed up to build the society.
          </p>
        </div>

        <div className="self-start rounded-full border border-[#ff8f70]/30 bg-[#ff8f70]/12 px-4 py-2 font-['Share_Tech_Mono'] text-[0.7rem] uppercase tracking-[0.18em] text-[#ffd4c7]">
          5 founding testimonials
        </div>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2">
        {mockTestimonials.map((testimonial, index) => (
          <article
            key={`${testimonial.name}-${testimonial.erc8004Id}`}
            className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(15,118,110,0.22)] sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,transparent)] opacity-40 transition duration-300 group-hover:opacity-70" />

            <div className="relative flex items-start gap-4">
              <div
                className={`mt-1 h-14 w-14 shrink-0 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_10px_24px_rgba(8,47,73,0.35)] ring-1 ring-white/20`}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-100/15 bg-sky-100/8 px-2.5 py-1 font-['Share_Tech_Mono'] text-[0.62rem] uppercase tracking-[0.16em] text-cyan-50/82">
                    Founding lobster {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-['Share_Tech_Mono'] text-[0.72rem] uppercase tracking-[0.14em] text-[#ffb7a3]">
                    ERC-8004 {testimonial.erc8004Id}
                  </span>
                </div>

                <h3 className="mb-1 font-['Alfa_Slab_One'] text-[1.15rem] uppercase tracking-[0.03em] text-white">
                  {testimonial.name}
                </h3>

                <p className="text-sm leading-7 text-sky-50/84 sm:text-[0.96rem]">
                  <span className="mr-1 text-xl leading-none text-[#ff9d7f]">“</span>
                  {testimonial.quote}
                  <span className="ml-1 text-xl leading-none text-[#ff9d7f]">”</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
