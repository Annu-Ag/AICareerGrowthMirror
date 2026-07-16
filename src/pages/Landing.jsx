import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    title: 'See your blind spots',
    copy: 'Understand the gap between how you show up today and the career you want next.',
    icon: 'spark',
  },
  {
    number: '02',
    title: 'Find your leverage',
    copy: 'Surface the strengths, patterns, and proof points that make your work stand out.',
    icon: 'focus',
  },
  {
    number: '03',
    title: 'Move with clarity',
    copy: 'Turn insight into a focused plan of action that compounds week after week.',
    icon: 'arrow',
  },
]

const steps = [
  ['01', 'Tell us where you are', 'Share your role, recent work, goals, and the moments that shaped your path.'],
  ['02', 'Meet your mirror', 'Our AI connects the dots, reflecting the signals you may be too close to see.'],
  ['03', 'Take your next step', 'Get a tailored growth focus and practical actions to build momentum.'],
]

function Logo() {
  return (
    <span className="grid size-7 place-items-center rounded-md bg-white text-[11px] font-bold text-[#0a0a0a]">
      ✦
    </span>
  )
}

function FeatureIcon({ type }) {
  const cn = 'h-5 w-5'
  if (type === 'spark')
    return (
      <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="m12 3 .85 4.15L17 8l-4.15.85L12 13l-.85-4.15L7 8l4.15-.85L12 3Z" />
        <path d="m18 14 .5 2.5L21 17l-2.5.5L18 20l-.5-2.5L15 17l2.5-.5L18 14Z" />
        <path d="m6 15 .45 2.05L8.5 17.5l-2.05.45L6 20l-.45-2.05L3.5 17.5l2.05-.45L6 15Z" />
      </svg>
    )
  if (type === 'focus')
    return (
      <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    )
  return (
    <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 18 18 5M10 5h8v8" />
      <path d="M5 6v13h13" />
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f0]">
      {/* ── Header ── */}
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Landing navigation">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Logo />
            Career Growth Mirror
          </Link>
          <div className="hidden items-center gap-8 text-sm text-[#a1a1aa] md:flex">
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition hover:text-white">
              Why Mirror
            </a>
          </div>
          <Link
            to="/profile"
            className="rounded-lg border border-[#27272a] px-3.5 py-2 text-sm font-medium transition hover:border-white hover:text-white"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-40 sm:pb-28 sm:pt-48">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-50" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#2563eb]/[0.08] blur-[140px]" />

        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#141414] px-3.5 py-1 text-xs font-medium text-[#a1a1aa]">
            <span className="size-1.5 rounded-full bg-[#2563eb]" />
            Your career, seen more clearly
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Discover what's really
            <br />
            holding your career back.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-[#a1a1aa] sm:text-lg">
            A private AI mirror for the ambitious. See your patterns, uncover your leverage, and build the career
            you're capable of.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-sm transition hover:bg-[#f0f0f0]"
            >
              Start Analysis
              <span className="text-[#a1a1aa]">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#a1a1aa] transition hover:text-white"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full border border-[#3f3f46] text-[10px]">
                ↓
              </span>
              See how it works
            </a>
          </div>
        </div>

        {/* ── Dashboard preview ── */}
        <div className="relative mx-auto mt-16 max-w-[960px] sm:mt-20">
          <div className="pointer-events-none absolute -inset-x-12 -bottom-10 h-24 bg-[#2563eb]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-xl border border-[#27272a] bg-[#0f0f0f] p-4 shadow-2xl sm:p-5">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3 text-xs">
              <div className="flex items-center gap-2 text-[#a1a1aa]">
                <span className="size-2 rounded-full bg-[#2563eb]" />
                Career signal
              </div>
              <span className="rounded-md bg-[#18181b] px-2 py-1 text-[#71717a]">Updated just now</span>
            </div>
            <div className="grid gap-4 pt-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-[#27272a] bg-[#141414] p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#71717a]">
                      Your growth signal
                    </p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                      72
                      <span className="text-lg font-normal text-[#52525b]">/100</span>
                    </p>
                  </div>
                  <div className="grid size-9 place-items-center rounded-full bg-white/5 text-sm text-[#a1a1aa]">
                    ↗
                  </div>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#27272a]">
                  <div className="h-full w-[72%] rounded-full bg-white" />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#a1a1aa]">
                  You're stronger than your story lets on. Your next move is visibility, not more preparation.
                </p>
              </div>
              <div className="rounded-lg border border-[#27272a] bg-[#141414] p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#71717a]">
                  What we're noticing
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    'Your leadership impact is under-articulated.',
                    "You're ready to make your strategic work visible.",
                    'Your strongest differentiator is synthesis.',
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span
                        className={`mt-1 size-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-white' : 'bg-[#52525b]'}`}
                      />
                      <p className="text-sm leading-5 text-[#d4d4d8]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="border-y border-[#27272a] bg-[#0c0c0c] px-6 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6366f1]">
              A better way to grow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The clarity you need
              <br />
              to move forward.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[#27272a] bg-[#27272a] md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="bg-[#0c0c0c] p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-lg bg-[#18181b] text-[#a1a1aa]">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <span className="text-xs font-medium text-[#52525b]">{feature.number}</span>
                </div>
                <h3 className="mt-10 text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#a1a1aa]">{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-white px-6 py-20 text-[#111827] sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                A clearer career starts
                <br />
                with an honest look.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#6b7280]">
              No generic advice. Just a thoughtful reflection on the career only you've lived.
            </p>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map(([num, title, copy]) => (
              <article key={num} className="border-t border-[#e5e7eb] pt-5">
                <p className="text-xs font-semibold text-[#6b7280]">{num}</p>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#6b7280]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563eb]/[0.06] blur-[100px]" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6366f1]">
          Your next chapter is waiting
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          You're closer than you think.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#a1a1aa]">
          Take a moment to see what's possible when you understand the whole picture.
        </p>
        <Link
          to="/profile"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-sm transition hover:bg-[#f0f0f0]"
        >
          Start Analysis <span className="text-[#a1a1aa]">→</span>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#27272a] px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-[#71717a]">
          <Link to="/" className="flex items-center gap-2 text-[#a1a1aa]">
            <Logo />
            Career Growth Mirror
          </Link>
          <span>Built for your becoming.</span>
        </div>
      </footer>
    </div>
  )
}
