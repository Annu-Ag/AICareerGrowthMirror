export default function BarChart({ data, animate }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex items-end gap-2 sm:gap-3 h-40" role="img" aria-label="Growth score trend">
      {data.map((d, i) => (
        <div key={d.week} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-fg chart-bar relative group cursor-pointer"
            style={{
              height: animate ? `${(d.value / max) * 100}%` : '0%',
              transitionDelay: `${i * 60}ms`,
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity tooltip">
              {d.value}
            </div>
          </div>
          <span className="text-xs text-fg-muted">{d.week}</span>
        </div>
      ))}
    </div>
  )
}
