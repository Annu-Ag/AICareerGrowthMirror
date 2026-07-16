import PageHeader from '../components/PageHeader'

const metrics = [['Strategic influence', '76', '+12'], ['Craft & execution', '88', '+4'], ['Leadership presence', '64', '+18']]

export default function GrowthReport() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><PageHeader eyebrow="Growth report" title="Your growth, in perspective" description="A simple record of the skills and habits you’re building over time." action={<button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm">May – July 2026</button>} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-slate-500">Overall growth score</p><p className="mt-2 text-5xl font-semibold tracking-tight">74<span className="text-2xl text-slate-400">/100</span></p></div><p className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">↑ 11 this quarter</p></div><div className="mt-12 flex h-40 items-end gap-3">{[45, 53, 48, 61, 66, 63, 74].map((height, index) => <div key={height} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-indigo-500" style={{ height: `${height}%` }} /><span className="text-xs text-slate-400">W{index + 1}</span></div>)}</div></div><aside className="rounded-2xl bg-indigo-50 p-6 sm:p-8"><p className="text-sm font-semibold text-indigo-700">This month’s reflection</p><p className="mt-4 text-lg font-medium leading-8 text-slate-800">“Your consistency is creating confidence. Keep making your thinking visible.”</p><p className="mt-6 text-sm text-slate-500">AI Career Growth Mirror</p></aside></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{metrics.map(([label, score, change]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><div className="mt-4 flex items-end justify-between"><p className="text-3xl font-semibold">{score}</p><span className="text-sm font-semibold text-emerald-600">{change}</span></div></article>)}</div>
    </section>
  )
}
