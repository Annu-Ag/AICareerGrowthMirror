import PageHeader from '../components/PageHeader'

const strengths = ['Customer-centered strategy', 'Cross-functional influence', 'Clear product storytelling']
const gaps = [
  ['Business fluency', 'Develop a sharper point of view on revenue, market size, and trade-offs.', 'High impact'],
  ['Executive presence', 'Practice making your strategic contribution visible in senior rooms.', 'Growth area'],
]
const experimentDays = [
  ['Mon', 'Choose one project and write its business outcome in one sentence.'],
  ['Wed', 'Ask a stakeholder how they measure success for that project.'],
  ['Fri', 'Share one concise insight or decision with your team.'],
]

export default function AIAnalysis() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <PageHeader eyebrow="AI analysis" title="Your career, reflected clearly" description="Placeholder insights based on the professional story you’ve shared. Look for the patterns that feel useful, then turn one into action." />

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-indigo-200">Career score</p><h2 className="mt-3 text-5xl font-semibold tracking-[-.05em]">72<span className="text-xl text-slate-400">/100</span></h2></div><span className="grid size-10 place-items-center rounded-xl bg-indigo-400/15 text-lg text-indigo-200">↗</span></div>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full w-[72%] rounded-full bg-indigo-400" /></div>
          <div className="mt-7 border-t border-slate-700 pt-5"><p className="text-sm leading-6 text-slate-300">You have strong momentum. The next lift is less about capability and more about making your strategic value visible.</p><p className="mt-3 text-sm font-medium text-indigo-200">+8 points of growth potential</p></div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-indigo-600">01 — Strengths</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your natural leverage</h2></div><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">✦</span></div><p className="mt-4 text-sm leading-6 text-slate-500">The patterns that consistently make your work more valuable.</p><div className="mt-6 flex flex-wrap gap-2">{strengths.map((strength) => <span key={strength} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{strength}</span>)}</div></article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-sm font-medium text-indigo-600">02 — Skill gaps</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Skills that unlock your next level</h2><div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">{gaps.map(([skill, detail, label]) => <div key={skill} className="py-4"><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold text-slate-800">{skill}</h3><p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">{detail}</p></div><span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{label}</span></div></div>)}</div></article>

        <article className="rounded-2xl border border-[#d9d5f5] bg-[#f8f7ff] p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-indigo-600">03 — Hidden blockers</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">What may be keeping you stuck</h2></div><span className="grid size-10 place-items-center rounded-xl bg-white text-lg text-indigo-600 shadow-sm">◌</span></div><div className="mt-6 rounded-xl border border-indigo-100 bg-white/80 p-4"><p className="text-sm font-semibold text-slate-800">You’re over-indexing on being ready.</p><p className="mt-2 text-sm leading-6 text-slate-600">Your profile suggests you wait for more certainty before sharing a point of view. That can hide the leadership judgment you already have.</p></div><p className="mt-4 text-sm font-medium text-indigo-700">Mirror prompt: Where could “good enough” create momentum this week?</p></article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm font-medium text-indigo-600">04 — 7-day growth experiment</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Make your strategic thinking more visible</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">One small practice, designed to help you turn a quiet strength into a signal others can see.</p></div><span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">~15 min / day</span></div><div className="mt-7 grid gap-3 md:grid-cols-3">{experimentDays.map(([day, action]) => <div key={day} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{day}</p><p className="mt-3 text-sm leading-6 text-slate-700">{action}</p></div>)}</div><div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">By Sunday: note what changed when you shared your thinking a little earlier.</div></article>
      </div>
    </section>
  )
}
