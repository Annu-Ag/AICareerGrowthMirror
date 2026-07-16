import { Link } from 'react-router-dom'

const steps = [
  ['01', 'Build your mirror', 'Capture the skills, work, and ambitions that make your career unique.'],
  ['02', 'Find your edge', 'Turn reflection into precise insights with an AI-guided career analysis.'],
  ['03', 'Grow with intent', 'Check in weekly and see the small actions that compound over time.'],
]

export default function Landing() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <div className="absolute left-1/2 top-0 -z-10 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto w-fit rounded-full border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm">Your career, reflected clearly</p>
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-7xl">See where you are.<br /><span className="text-indigo-600">Shape what’s next.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">AI Career Growth Mirror helps you turn your experience into meaningful direction, one thoughtful check-in at a time.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/profile" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">Create your mirror</Link>
            <Link to="/analysis" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">See an example</Link>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(([number, title, text]) => <div key={number}><p className="text-sm font-semibold text-indigo-600">{number}</p><h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2><p className="mt-3 leading-7 text-slate-500">{text}</p></div>)}
        </div>
      </section>
    </>
  )
}
