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
  return <span className="grid size-8 place-items-center rounded-lg bg-[#e8ff59] text-base font-bold text-[#0b0d0b]">✦</span>
}

function FeatureIcon({ type }) {
  if (type === 'spark') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m12 3 .85 4.15L17 8l-4.15.85L12 13l-.85-4.15L7 8l4.15-.85L12 3Z" /><path d="m18 14 .5 2.5L21 17l-2.5.5L18 20l-.5-2.5L15 17l2.5-.5L18 14Z" /><path d="m6 15 .45 2.05L8.5 17.5l-2.05.45L6 20l-.45-2.05L3.5 17.5l2.05-.45L6 15Z" /></svg>
  if (type === 'focus') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 18 18 5M10 5h8v8" /><path d="M5 6v13h13" /></svg>
}

export default function Landing() {
  return (
    <div className="landing bg-[#0b0d0b] text-[#f5f5f0]">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8" aria-label="Landing navigation">
          <Link to="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.03em]"><Logo /> Career Growth Mirror</Link>
          <div className="hidden items-center gap-8 text-sm text-[#a8aca2] md:flex"><a href="#how-it-works" className="transition hover:text-white">How it works</a><a href="#features" className="transition hover:text-white">Why Mirror</a></div>
          <Link to="/profile" className="rounded-full border border-[#383c36] px-4 py-2 text-sm font-medium transition hover:border-[#e8ff59] hover:text-[#e8ff59]">Sign in</Link>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden px-5 pb-16 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
        <div className="hero-grid absolute inset-0 -z-20 opacity-70" />
        <div className="absolute left-1/2 top-[17%] -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#b4d52a]/[0.10] blur-[120px]" />
        <div className="mx-auto max-w-[1040px] text-center">
          <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#30342e] bg-[#151815]/80 px-3.5 py-1.5 text-xs font-medium text-[#cdd1c7]"><span className="size-1.5 rounded-full bg-[#e8ff59]" />Your career, seen more clearly</p>
          <h1 className="mt-7 text-balance text-[3.25rem] font-medium leading-[.97] tracking-[-0.065em] text-white sm:text-7xl lg:text-[5.6rem]">Discover what&apos;s really<br className="hidden sm:block" /> holding your career back.</h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-7 text-[#adb1a8] sm:text-lg">A private AI mirror for the ambitious. See your patterns, uncover your leverage, and build the career you&apos;re capable of.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/profile" className="group inline-flex items-center gap-3 rounded-full bg-[#e8ff59] px-5 py-3 text-sm font-semibold text-[#0b0d0b] transition hover:bg-[#f2ff93]">Start Analysis <span className="transition group-hover:translate-x-0.5">→</span></Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-medium text-[#c7cbc1] transition hover:text-white"><span className="grid size-5 place-items-center rounded-full border border-[#5a5e56] text-[10px]">↓</span> See how it works</a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-[960px] sm:mt-20">
          <div className="absolute -inset-x-12 -bottom-10 h-24 bg-[#b7d92e]/20 blur-3xl" />
          <div className="dashboard relative overflow-hidden rounded-2xl border border-[#363a34] bg-[#121512] p-4 shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:p-5">
            <div className="flex items-center justify-between border-b border-[#2b2f2a] pb-4 text-xs"><div className="flex items-center gap-2 text-[#c7cbc1]"><span className="size-2 rounded-full bg-[#e8ff59]" />Career signal</div><span className="rounded-full bg-[#22261f] px-2.5 py-1 text-[#aeb3a7]">Updated just now</span></div>
            <div className="grid gap-4 pt-4 md:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-xl border border-[#2d312b] bg-[#191d18] p-5 sm:p-6">
                <div className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-[.14em] text-[#8c9288]">Your growth signal</p><p className="mt-3 text-4xl font-medium tracking-[-.06em] text-white">72<span className="text-lg text-[#969c91]">/100</span></p></div><div className="grid size-10 place-items-center rounded-full bg-[#e8ff59] text-[#11130f]">↗</div></div>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#343930]"><div className="h-full w-[72%] rounded-full bg-[#e8ff59]" /></div>
                <p className="mt-5 text-sm leading-6 text-[#adb1a8]">You&apos;re stronger than your story lets on. Your next move is visibility, not more preparation.</p>
              </div>
              <div className="rounded-xl border border-[#2d312b] bg-[#191d18] p-5 sm:p-6"><p className="text-xs font-medium uppercase tracking-[.14em] text-[#8c9288]">What we&apos;re noticing</p><div className="mt-5 space-y-4"><div className="flex gap-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-[#e8ff59]" /><p className="text-sm leading-5 text-[#e1e4dc]">Your leadership impact is under-articulated.</p></div><div className="flex gap-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-[#8d9686]" /><p className="text-sm leading-5 text-[#e1e4dc]">You&apos;re ready to make your strategic work visible.</p></div><div className="flex gap-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-[#8d9686]" /><p className="text-sm leading-5 text-[#e1e4dc]">Your strongest differentiator is synthesis.</p></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#2a2e29] bg-[#101310] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1120px]"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#e8ff59]">A better way to grow</p><h2 className="mt-4 text-4xl font-medium leading-[1.02] tracking-[-.055em] text-white sm:text-5xl">The clarity you need<br />to move forward.</h2></div><div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#30342e] bg-[#30342e] md:grid-cols-3">{features.map((feature) => <article key={feature.number} className="bg-[#101310] p-7 sm:p-8"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-lg bg-[#21261f] text-[#e8ff59]"><FeatureIcon type={feature.icon} /></div><span className="text-xs font-medium text-[#747b70]">{feature.number}</span></div><h3 className="mt-12 text-xl font-medium tracking-[-.035em] text-white">{feature.title}</h3><p className="mt-3 max-w-[17rem] text-sm leading-6 text-[#a6aba1]">{feature.copy}</p></article>)}</div></div>
      </section>

      <section id="how-it-works" className="bg-[#f1f1eb] px-5 py-20 text-[#11130f] sm:px-8 sm:py-28"><div className="mx-auto max-w-[1120px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#698000]">How it works</p><h2 className="mt-4 text-4xl font-medium leading-[1.02] tracking-[-.055em] sm:text-5xl">A clearer career starts<br />with an honest look.</h2></div><p className="max-w-xs text-sm leading-6 text-[#62665e]">No generic advice. Just a thoughtful reflection on the career only you&apos;ve lived.</p></div><div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-14">{steps.map(([num, title, copy]) => <article key={num} className="border-t border-[#cdd0c7] pt-5"><p className="text-xs font-semibold text-[#758800]">{num}</p><h3 className="mt-9 text-xl font-medium tracking-[-.035em]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#62665e]">{copy}</p></article>)}</div></div></section>

      <section className="relative overflow-hidden px-5 py-24 text-center sm:px-8 sm:py-32"><div className="absolute left-1/2 top-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b7d92e]/[.12] blur-[100px]" /><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#e8ff59]">Your next chapter is waiting</p><h2 className="mx-auto mt-5 max-w-2xl text-4xl font-medium leading-[1.02] tracking-[-.06em] text-white sm:text-6xl">You&apos;re closer than you think.</h2><p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#a8ada3]">Take a moment to see what&apos;s possible when you understand the whole picture.</p><Link to="/profile" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#e8ff59] px-5 py-3 text-sm font-semibold text-[#0b0d0b] transition hover:bg-[#f2ff93]">Start Analysis <span>→</span></Link></section>

      <footer className="border-t border-[#2a2e29] px-5 py-6 sm:px-8"><div className="mx-auto flex max-w-[1240px] items-center justify-between text-xs text-[#7e847a]"><Link to="/" className="flex items-center gap-2 text-[#cdd1c7]"><Logo /> Career Growth Mirror</Link><span>Built for your becoming.</span></div></footer>
    </div>
  )
}
