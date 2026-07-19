import { useLocation } from 'react-router-dom'

const steps = [
  { key: 'profile', label: 'Profile', path: '/profile' },
  { key: 'analysis', label: 'Analysis', path: '/analysis' },
  { key: 'check-in', label: 'Experiment', path: '/check-in' },
  { key: 'report', label: 'Report', path: '/report' },
]

export default function JourneyStepper() {
  const location = useLocation()
  const currentIndex = steps.findIndex((step) => location.pathname === step.path)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-[14px] border border-border bg-white/70 px-3 py-3 shadow-sm backdrop-blur sm:justify-center">
      {steps.map((step, index) => {
        const isActive = index === activeIndex
        const isComplete = index < activeIndex
        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${isActive ? 'bg-accent text-white' : isComplete ? 'bg-success-bg text-success' : 'bg-bg-subtle text-fg-muted'}`}>
              {index + 1}
            </div>
            <span className={`text-sm ${isActive ? 'font-semibold text-fg' : isComplete ? 'text-success' : 'text-fg-muted'}`}>{step.label}</span>
            {index < steps.length - 1 && <span className="text-fg-muted">→</span>}
          </div>
        )
      })}
    </div>
  )
}
