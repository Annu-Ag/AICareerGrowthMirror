import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { useCareer } from '../context/CareerContext'

const metrics = [
  { label: 'Strategic influence', score: 76, change: '+12', color: 'bg-brand', trend: 'up' },
  { label: 'Craft & execution', score: 88, change: '+4', color: 'bg-success', trend: 'up' },
  { label: 'Leadership presence', score: 64, change: '+18', color: 'bg-info', trend: 'up' },
]

const chartData = [
  { week: 'W1', value: 45 },
  { week: 'W2', value: 53 },
  { week: 'W3', value: 48 },
  { week: 'W4', value: 61 },
  { week: 'W5', value: 66 },
  { week: 'W6', value: 63 },
  { week: 'W7', value: 74 },
]

const periods = [
  { label: 'May – July 2026', value: 'may-jul-2026' },
  { label: 'February – April 2026', value: 'feb-apr-2026' },
  { label: 'Last 30 days', value: 'last-30' },
  { label: 'Last 90 days', value: 'last-90' },
]

function BarChart({ data, animate }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-40" aria-label="Growth score trend">
      {data.map((d, i) => (
        <div key={d.week} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-fg chart-bar relative group cursor-pointer"
            style={{
              height: animate ? `${(d.value / max) * 100}%` : '0%',
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {/* Tooltip on hover */}
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

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const startTime = Date.now()
    const startVal = 0

    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(Math.round(startVal + (value - startVal) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return <>{display}</>
}

export default function GrowthReport() {
  const { checkIns } = useCareer()
  const [period, setPeriod] = useState('may-jul-2026')
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200)
  }, [])

  const overallScore = Math.round(
    metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length
  )

  const avgChange = metrics
    .filter((m) => m.trend === 'up')
    .reduce((acc, m) => acc + parseInt(m.change), 0)

  const hasCheckIns = checkIns.length > 0
  const moodDistribution = hasCheckIns
    ? checkIns.reduce((acc, c) => {
        if (c.mood) acc[c.mood] = (acc[c.mood] || 0) + 1
        return acc
      }, {})
    : null

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="Growth report"
        title="Your growth, in perspective"
        description="A simple record of the skills and habits you're building over time."
        action={
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value)
              setAnimate(false)
              setTimeout(() => setAnimate(true), 100)
            }}
            className="select-base w-auto min-w-[180px]"
            aria-label="Report period"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        }
      />

      {/* KPI bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Overall score</p>
          <p className="mt-1 text-2xl font-semibold text-fg">
            <AnimatedNumber value={overallScore} />
            <span className="text-sm font-normal text-fg-muted">/100</span>
          </p>
        </div>
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Growth change</p>
          <p className="mt-1 text-2xl font-semibold text-success">
            ↑<AnimatedNumber value={avgChange} />
          </p>
        </div>
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Check-ins</p>
          <p className="mt-1 text-2xl font-semibold text-fg">{checkIns.length}</p>
        </div>
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Strengths</p>
          <p className="mt-1 text-2xl font-semibold text-accent">{metrics.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Chart */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                Overall growth score
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-fg">
                <AnimatedNumber value={overallScore} />
                <span className="text-xl font-normal text-fg-muted">/100</span>
              </p>
            </div>
            <span className="badge-dot bg-success-bg text-success border border-success/20">
              <span>↑</span>
              +{avgChange} this quarter
            </span>
          </div>

          <div className="mt-8">
            <BarChart data={chartData} animate={animate} />
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-xs text-fg-muted">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-fg" /> Score
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-bg-subtle border border-border" /> Target
            </span>
          </div>
        </div>

        {/* Reflection sidebar */}
        <aside className="card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="section-eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              This month's reflection
            </p>
            <span className="text-2xl">💭</span>
          </div>
          <blockquote className="mt-4 text-base font-medium leading-7 text-fg-secondary italic border-l-2 border-accent pl-4">
            &ldquo;Your consistency is creating confidence. Keep making your thinking visible.&rdquo;
          </blockquote>
          <p className="mt-5 text-sm text-fg-muted flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent pulse-dot" />
            AI Career Growth Mirror
          </p>

          {/* Mood distribution */}
          {moodDistribution && Object.keys(moodDistribution).length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-fg-muted mb-3">Mood distribution</p>
              <div className="space-y-2">
                {Object.entries(moodDistribution).map(([mood, count]) => {
                  const total = checkIns.length
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={mood} className="flex items-center gap-2">
                      <span className="text-xs w-16 text-fg-secondary truncate">{mood}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-fg-muted w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Metrics grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <article
            key={m.label}
            className="card-hover-accent stagger-item p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-muted">{m.label}</p>
              <span className={`size-2 rounded-full ${m.color}`} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-semibold text-fg">
                <AnimatedNumber value={m.score} />
              </p>
              <span className="badge-dot bg-success-bg text-success border border-success/20">
                <span>↑</span> {m.change}
              </span>
            </div>
            {/* Mini progress */}
            <div className="mt-3 progress-bar">
              <div
                className={`progress-bar-fill ${m.color === 'bg-brand' ? '!bg-brand' : m.color === 'bg-success' ? '!bg-success' : '!bg-info'}`}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Action links */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/check-in"
          className="btn-outline"
        >
          <span>📝</span>
          New check-in
        </Link>
        <Link
          to="/analysis"
          className="btn-ghost"
        >
          View analysis
        </Link>
      </div>
    </section>
  )
}
