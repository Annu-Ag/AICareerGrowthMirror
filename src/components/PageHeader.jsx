export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold text-indigo-600">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 leading-7 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}
