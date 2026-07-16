export default function InsightCard({ number, title, icon, children, accent }) {
  return (
    <article className={`card-hover-accent stagger-item p-6 sm:p-7 ${accent ? 'border-accent/20' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="section-eyebrow flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-accent/60" />
            {number} — {title}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-fg">
            Your {title.toLowerCase()}
          </h2>
        </div>
        <span aria-hidden="true" className={`icon-square ${accent ? 'icon-square-accent' : ''}`}>
          {icon}
        </span>
      </div>
      <div className="mt-5">{children}</div>
    </article>
  )
}
