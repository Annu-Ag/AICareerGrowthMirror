import PageHeader from '../components/PageHeader'

export default function WeeklyCheckIn() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8"><PageHeader eyebrow="Weekly check-in" title="Pause. Notice. Move forward." description="A few minutes of honest reflection helps your progress become visible." />
      <form className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><label className="block"><span className="font-semibold">What gave you energy this week?</span><textarea className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" placeholder="A conversation, a project, a small win…" /></label><label className="block"><span className="font-semibold">What felt challenging?</span><textarea className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" placeholder="Name it without trying to solve it yet." /></label><div><p className="font-semibold">How are you feeling about your growth?</p><div className="mt-3 grid grid-cols-5 gap-2">{['Stuck', 'Uneasy', 'Steady', 'Hopeful', 'Energized'].map((mood) => <button key={mood} type="button" className="rounded-xl border border-slate-200 px-2 py-3 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">{mood}</button>)}</div></div><button type="button" className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Save reflection</button></form>
    </section>
  )
}
