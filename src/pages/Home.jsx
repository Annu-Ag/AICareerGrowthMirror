const features = [
  ['Vite', 'Fast development, optimized production builds.'],
  ['React Router', 'A scalable routing foundation is ready to extend.'],
  ['Tailwind CSS', 'Responsive styling without leaving your components.'],
]

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Ready to build</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-6xl">A clean starting point for your next idea.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">A modern React application with routing, responsive design, quality checks, and deployment-ready scripts already in place.</p>
        <a href="#features" className="mt-8 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">Explore the setup</a>
      </div>
      <div id="features" className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, description], index) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-brand">0{index + 1}</span>
            <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
