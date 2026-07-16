import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const skills = ['Product strategy', 'User research', 'Data storytelling', 'Team leadership', 'Figma']

export default function CareerProfile() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <PageHeader eyebrow="Career profile" title="Your professional mirror" description="A living snapshot of what you do well, what energizes you, and where you want to grow." action={<button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm">Edit profile</button>} />
      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-2xl bg-indigo-100 text-xl font-semibold text-indigo-700">AM</div><div><h2 className="text-xl font-semibold">Aarav Mehta</h2><p className="mt-1 text-slate-500">Senior Product Designer · Bengaluru</p></div></div>
          <div className="my-8 h-px bg-slate-100" />
          <h3 className="font-semibold">Career direction</h3><p className="mt-3 leading-7 text-slate-600">I’m growing toward design leadership while staying close to complex product problems and the people who use them.</p>
          <h3 className="mt-8 font-semibold">Strengths I bring</h3><div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{skill}</span>)}</div>
        </div>
        <aside className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8"><p className="text-sm font-medium text-indigo-300">Mirror completeness</p><p className="mt-4 text-5xl font-semibold tracking-tight">82%</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full w-[82%] rounded-full bg-indigo-400" /></div><p className="mt-6 leading-7 text-slate-300">Add your recent wins and a growth goal to unlock a richer AI analysis.</p><Link to="/analysis" className="mt-8 inline-block text-sm font-semibold text-white underline decoration-indigo-400 underline-offset-4">View AI analysis →</Link></aside>
      </div>
    </section>
  )
}
