export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="section-eyebrow mb-2 flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-accent pulse-dot" />
            {eyebrow}
          </p>
        )}
        <h1
          className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[34px] text-fg"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-xl text-[15px] leading-6 text-fg-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
