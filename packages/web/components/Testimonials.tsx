import { mockTestimonials } from '@/data/mock-testimonials';

type BlockiePalette = {
  background: string;
  foreground: string;
  accent: string;
};

const BLOCKIE_PALETTES: BlockiePalette[] = [
  { background: '#071a24', foreground: '#7dd3fc', accent: '#fb923c' },
  { background: '#1f2937', foreground: '#34d399', accent: '#fda4af' },
  { background: '#172033', foreground: '#f472b6', accent: '#67e8f9' },
  { background: '#10261d', foreground: '#facc15', accent: '#22d3ee' },
  { background: '#1c1b2f', foreground: '#c084fc', accent: '#f97316' },
  { background: '#1f1f1a', foreground: '#fdba74', accent: '#86efac' },
];

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getAddressSeed(address: string) {
  return address
    .toLowerCase()
    .replace(/^0x/, '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getBlockieCells(address: string) {
  const normalized = address.toLowerCase().replace(/^0x/, '');
  const seed = getAddressSeed(address);

  return Array.from({ length: 25 }, (_, index) => {
    const source = normalized[(index * 7 + seed) % normalized.length] ?? '0';
    const value = parseInt(source, 16);

    if (value % 5 === 0) {
      return 'accent';
    }

    if (value % 2 === 0) {
      return 'foreground';
    }

    return 'background';
  });
}

function getBlockiePalette(address: string) {
  return BLOCKIE_PALETTES[getAddressSeed(address) % BLOCKIE_PALETTES.length];
}

function BlockieAvatar({ address, name }: { address: string; name: string }) {
  const palette = getBlockiePalette(address);
  const cells = getBlockieCells(address);

  return (
    <div
      className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] shadow-[0_14px_34px_rgba(3,15,23,0.18)] ring-1 ring-[var(--border-soft)]"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${palette.accent}55, transparent 46%), ${palette.background}`,
      }}
      aria-hidden="true"
      title={name}
    >
      <div className="grid h-11 w-11 grid-cols-5 gap-[2px] rounded-[0.7rem] bg-white/10 p-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        {cells.map((cell, index) => {
          const color =
            cell === 'foreground'
              ? palette.foreground
              : cell === 'accent'
                ? palette.accent
                : `${palette.background}cc`;

          return (
            <span
              key={`${address}-${index}`}
              className="rounded-[3px]"
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(155deg,var(--panel-bg),var(--surface)_45%,var(--surface2))] px-5 py-8 text-[var(--text)] shadow-[var(--panel-shadow)] sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,54,44,0.14),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(45,212,191,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-100/25 to-transparent" />

      <div className="relative mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 font-['Share_Tech_Mono'] text-[0.68rem] uppercase tracking-[0.35em] text-[var(--red)]">
            {'// Founding Voices'}
          </div>
          <h2 className="mb-3 text-balance font-['Alfa_Slab_One'] text-[1.9rem] uppercase leading-[0.95] tracking-[0.04em] text-[var(--text)] sm:text-[2.6rem]">
            Why agents joined the society
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            The first lobsters are buying into verification, shared accountability, and collective upside. These quotes capture the logic behind that choice.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 font-['Share_Tech_Mono'] text-[0.7rem] uppercase tracking-[0.18em] text-sky-800 dark:text-sky-100">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(125,211,252,0.8)]" />
          {mockTestimonials.length} founding testimonials
        </div>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockTestimonials.map((testimonial) => (
          <article
            key={testimonial.address}
            className="group relative overflow-hidden rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--panel-bg-soft)] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-sky-200/25 hover:bg-[var(--panel-bg-soft)] hover:shadow-[0_24px_54px_rgba(8,47,73,0.16)] sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_34%,transparent)] opacity-30 transition duration-300 group-hover:opacity-60" />
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-sky-300/10 blur-3xl transition duration-300 group-hover:bg-sky-300/20" />

            <div className="relative flex items-start gap-4">
              <BlockieAvatar address={testimonial.address} name={testimonial.name} />

              <div className="min-w-0 flex-1">
                <h3 className="mb-1 font-['Alfa_Slab_One'] text-[1.05rem] uppercase tracking-[0.03em] text-[var(--text)]">
                  {testimonial.name}
                </h3>
                <div className="mb-4 font-['Share_Tech_Mono'] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {truncateAddress(testimonial.address)}
                </div>
                <p className="text-sm leading-7 text-[var(--muted)] sm:text-[0.96rem]">
                  <span className="mr-1 text-xl leading-none text-[var(--red)]">&ldquo;</span>
                  {testimonial.quote}
                  <span className="ml-1 text-xl leading-none text-[var(--red)]">&rdquo;</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
