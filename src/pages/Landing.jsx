import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateMockAnalysis } from '../services/mockAnalysis'
import { useCareer } from '../context/CareerContext'

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

const demoProfile = {
  name: 'Alex Chen',
  currentRole: 'Senior Product Designer',
  yearsOfExperience: '6',
  currentSkills: 'User research, Figma, Design systems, Prototyping, UX strategy',
  targetRole: 'Design Lead',
  dreamCompany: 'Stripe',
  biggestCareerChallenge: 'Making my strategic impact visible to leadership — I do great work but get overlooked for promotions',
  resumeFileName: '',
}

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

function formatLastUpdated(timestamp) {
  if (!timestamp) return 'just now'

  const diffMs = Date.now() - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

export default function Landing() {
  const navigate = useNavigate()
  const { profile, analysis, checkIns, loadDemoData, setOnboardingChoice, onboardingChoice, lastUpdated, resetEverything } = useCareer()
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

  const hasExistingProfile = Boolean(
    profile.name || profile.currentRole || profile.currentSkills || profile.targetRole || profile.biggestCareerChallenge || profile.resumeFileName || profile.resumeText
  )
  const hasSavedProgress = hasExistingProfile || analysis.careerScore > 0 || checkIns.length > 0

  function handleDemo() {
    setOnboardingChoice('demo')
    const analysis = generateMockAnalysis(demoProfile)
    loadDemoData(analysis)
    navigate('/analysis')
  }

  function handleCreateProfile() {
    setOnboardingChoice('custom')
    setShowWelcomeModal(false)
    navigate('/profile')
  }

  function handleContinue() {
    if (analysis.careerScore > 0 || checkIns.length > 0) {
      navigate('/analysis')
    } else {
      navigate('/profile')
    }
  }

  function handleStartFresh() {
    resetEverything()
    setOnboardingChoice('custom')
    setShowWelcomeModal(false)
    navigate('/profile')
  }

  return (
    <div className="bg-fg text-bg-card">
      {/* ── Header ── */}
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Landing navigation">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-bg-card">
            <Logo />
            Career Growth Mirror
          </Link>
          <div className="hidden items-center gap-8 text-sm text-fg-muted md:flex">
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition hover:text-white">
              Why Mirror
            </a>
          </div>
          <Link
            to="/profile"
            className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-bg-card transition hover:border-accent hover:text-white"
          >
            Try now
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-40 sm:pb-28 sm:pt-48">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-50" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-fg-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Your career, seen more clearly
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Discover what's really
            <br />
            holding your career back.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-fg-muted sm:text-lg">
            A private AI mirror for the ambitious. See your patterns, uncover your leverage, and build the career
            you're capable of.
          </p>

          {hasSavedProgress && (
            <div className="mx-auto mt-8 max-w-2xl rounded-[20px] border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/10 backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Welcome back</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Continue your career growth journey</h2>
                  <p className="mt-2 text-sm text-fg-muted">
                    Last update: <span className="text-white">{formatLastUpdated(lastUpdated)}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 rounded-lg bg-bg-card px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-subtle"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={handleStartFresh}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-fg-muted transition hover:border-accent hover:text-white"
                  >
                    Start new analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleCreateProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-bg-card px-4 py-2.5 text-sm font-semibold text-fg shadow-sm transition hover:bg-bg-subtle"
            >
              Create my profile
              <span className="text-fg-muted">→</span>
            </button>
            <button
              type="button"
              onClick={handleDemo}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-fg-muted shadow-sm transition hover:border-accent hover:text-white"
            >
              <span>🚀</span>
              Explore the demo
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition hover:text-white"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full border border-white/10 text-[10px]">
                ↓
              </span>
              See how it works
            </a>
          </div>

          <div className="mt-5 text-sm text-fg-muted">
            {hasExistingProfile ? (
              <p>
                You already have a local profile saved. You can continue it or explore the demo first.
              </p>
            ) : (
              <p>
                No sign-in needed yet — this choice is saved locally on this device so you can return anytime.
              </p>
            )}
          </div>

          {showWelcomeModal && !hasSavedProgress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
              <div className="w-full max-w-xl rounded-[24px] border border-white/10 bg-[#111111] p-7 shadow-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Welcome to Career Growth Mirror</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">How would you like to start?</h2>
                <p className="mt-3 text-sm leading-6 text-fg-muted">
                  Choose a path that feels right for you. You can switch anytime and your progress stays on this device.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWelcomeModal(false)
                      handleDemo()
                    }}
                    className="rounded-[16px] border border-white/10 bg-white/5 p-4 text-left transition hover:border-accent hover:bg-white/10"
                  >
                    <div className="text-lg">🧪</div>
                    <p className="mt-3 text-base font-semibold text-white">Explore Demo</p>
                    <p className="mt-1 text-sm text-fg-muted">See a complete walkthrough with sample data and a polished analysis.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWelcomeModal(false)
                      handleCreateProfile()
                    }}
                    className="rounded-[16px] border border-white/10 bg-white/5 p-4 text-left transition hover:border-accent hover:bg-white/10"
                  >
                    <div className="text-lg">👤</div>
                    <p className="mt-3 text-base font-semibold text-white">Create My Profile</p>
                    <p className="mt-1 text-sm text-fg-muted">Get personalized AI insights based on your own journey and goals.</p>
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWelcomeModal(false)}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-fg-muted transition hover:border-accent hover:text-white"
                  >
                    Maybe later
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWelcomeModal(false)
                      handleCreateProfile()
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-bg-card px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-subtle"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Dashboard preview ── */}
        <div className="relative mx-auto mt-16 max-w-[960px] sm:mt-20">
          <div className="pointer-events-none absolute -inset-x-12 -bottom-10 h-24 bg-accent/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-4 shadow-2xl sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2 text-fg-muted">
                <span className="size-2 rounded-full bg-accent" />
                Career signal
              </div>
              <span className="rounded-md bg-white/5 px-2 py-1 text-fg-muted">Updated just now</span>
            </div>
            <div className="grid gap-4 pt-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-muted">
                      Your growth signal
                    </p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                      72
                      <span className="text-lg font-normal text-fg-muted">/100</span>
                    </p>
                  </div>
                  <div className="grid size-9 place-items-center rounded-full bg-white/5 text-sm text-fg-muted">
                    ↗
                  </div>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-accent" />
                </div>
                <p className="mt-4 text-sm leading-6 text-fg-muted">
                  You're stronger than your story lets on. Your next move is visibility, not more preparation.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-muted">
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
                        className={`mt-1 size-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-accent' : 'bg-white/20'}`}
                      />
                      <p className="text-sm leading-5 text-bg-card/90">{item}</p>
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
        className="border-y border-white/10 bg-[#0d0d0d] px-6 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              A better way to grow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The clarity you need
              <br />
              to move forward.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="bg-[#0d0d0d] p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-lg bg-white/5 text-fg-muted">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <span className="text-xs font-medium text-fg-muted">{feature.number}</span>
                </div>
                <h3 className="mt-10 text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-muted">{feature.copy}</p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                A clearer career starts
                <br />
                with an honest look.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-fg-muted">
              No generic advice. Just a thoughtful reflection on the career only you've lived.
            </p>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map(([num, title, copy]) => (
              <article key={num} className="border-t border-border pt-5">
                <p className="text-xs font-semibold text-fg-muted">{num}</p>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-fg-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Your next chapter is waiting
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          You're closer than you think.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-fg-muted">
          Take a moment to see what's possible when you understand the whole picture.
        </p>
        <Link
          to="/profile"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-bg-card px-4 py-2.5 text-sm font-semibold text-fg shadow-sm transition hover:bg-bg-subtle"
        >
          Start Analysis <span className="text-fg-muted">→</span>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-fg-muted">
          <Link to="/" className="flex items-center gap-2 text-fg-muted">
            <Logo />
            Career Growth Mirror
          </Link>
          <span>Built for your becoming.</span>
        </div>
      </footer>
    </div>
  )
}
