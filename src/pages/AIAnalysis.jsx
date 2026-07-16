import PageHeader from '../components/PageHeader'

const insights = [
  ['Your emerging edge', 'You consistently connect customer evidence to product decisions. This is a leadership-strength signal, not just a design skill.'],
  ['A useful stretch', 'Practice framing your work in commercial outcomes. It will make your strategic thinking more visible to senior stakeholders.'],
  ['Next best move', 'Lead a cross-functional discovery session for your next initiative and document the decision trail.'],
]

export default function AIAnalysis() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><PageHeader eyebrow="AI analysis" title="A clearer view of your momentum" description="An AI-generated reflection based on the career story you’ve shared." />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><aside className="rounded-2xl bg-indigo-600 p-7 text-white"><p className="text-sm font-medium text-indigo-200">Growth signal</p><p className="mt-4 text-6xl font-semibold tracking-tight">+18</p><p className="mt-2 text-indigo-100">points since last month</p><div className="mt-12 border-t border-indigo-400 pt-5"><p className="text-sm leading-6 text-indigo-100">Your biggest lift came from strategic influence and clearer communication.</p></div></aside>
        <div className="space-y-4">{insights.map(([title, copy], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex gap-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">0{index + 1}</span><div><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-2 leading-7 text-slate-600">{copy}</p></div></div></article>)}</div></div>
    </section>
  )
}
