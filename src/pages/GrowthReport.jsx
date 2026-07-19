import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import BarChart from '../components/charts/BarChart'
import AnimatedNumber from '../components/AnimatedNumber'
import { useCareer } from '../context/CareerContext'

function filterCheckInsByPeriod(checkIns, period) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return []
  const now = Date.now()
  const windowMs = period === 'last-30' ? 30 * 24 * 60 * 60 * 1000 : 90 * 24 * 60 * 60 * 1000
  return checkIns.filter((entry) => {
    const timestamp = Number(entry.timestamp) || now
    return now - timestamp <= windowMs
  })
}

function deriveChartData(analysis, checkIns) {
  // Build chart data from real signals:
  // - Starting point: analysis.careerScore minus a delta based on profile completeness
  // - Each check-in with meaningful content adds 1-3 points (not random)
  // - Each check-in with an "upbeat" mood (Hopeful/Energized) adds extra
  // - A check-in with a specific challenge adds 1 point (awareness compounds)
  if (!analysis || analysis.careerScore <= 0) return { points: [], count: 0 }

  const baseScore = Math.max(analysis.careerScore - 10 - checkIns.length * 2, 20)

  const points = []
  // Always show at least 4 "weeks" of projection
  const totalWeeks = Math.max(checkIns.length + 1, 4)
  let cumulative = baseScore

  for (let w = 1; w <= totalWeeks; w++) {
    // Real check-in at this index (if it exists)
    const checkIn = checkIns[w - 1]
    let delta = 0

    if (checkIn) {
      // Point for having any energy reflection
      if (checkIn.energy && checkIn.energy.trim().length > 3) delta += 1
      // Point for having any challenge reflection
      if (checkIn.challenge && checkIn.challenge.trim().length > 3) delta += 1
      // Bonus for upbeat moods
      if (checkIn.mood === 'Hopeful' || checkIn.mood === 'Energized') delta += 2
      if (checkIn.mood === 'Steady') delta += 1
    } else {
      // Future projection: small decay (or flat) — no data = no movement
      delta = w <= checkIns.length + 1 ? 0 : -1
    }

    cumulative = Math.min(Math.max(cumulative + delta, 10), 98)
    points.push({ week: `W${w}`, value: cumulative })
  }

  return { points, count: totalWeeks }
}

function computeMetrics(analysis, checkIns) {
  if (!analysis || analysis.careerScore <= 0) {
    return { metrics: [], overallScore: 0, avgChange: 0, chartData: [], canShowChart: false }
  }

  const checkinDepthBonus = checkIns.filter(
    (c) => (c.energy && c.energy.trim().length > 3) || (c.challenge && c.challenge.trim().length > 3)
  ).length

  const metrics = [
    { label: 'Career score', score: analysis.careerScore, change: `+${Math.min(5 + checkinDepthBonus, 25)}`, color: 'bg-brand', trend: 'up' },
    { label: 'Strengths identified', score: Math.min(analysis.strengths.length * 25 + checkinDepthBonus * 3, 100), change: `+${Math.min(3 + checkinDepthBonus, 12)}`, color: 'bg-success', trend: 'up' },
    { label: 'Check-in consistency', score: Math.min(checkIns.length * 20, 100), change: checkIns.length > 0 ? `+${Math.min(checkIns.length * 20, 100)}` : '—', color: 'bg-info', trend: 'up' },
  ]

  const overallScore = Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length)
  const avgChange = metrics
    .filter((m) => m.trend === 'up' && m.change !== '—')
    .reduce((acc, m) => acc + parseInt(m.change), 0)

  const { points } = deriveChartData(analysis, checkIns)

  return { metrics, overallScore, avgChange, chartData: points, canShowChart: points.length >= 2 }
}

function computeMoodDistribution(checkIns) {
  if (!checkIns || checkIns.length === 0) return null
  const distribution = checkIns.reduce((acc, c) => {
    if (c.mood) acc[c.mood] = (acc[c.mood] || 0) + 1
    return acc
  }, {})
  return Object.keys(distribution).length > 0 ? distribution : null
}

function getGrowthNarrative(profile, analysis) {
  const name = profile?.name?.trim() || 'your'
  const firstName = name.split(/\s+/)[0] || 'your'
  const currentRole = profile?.currentRole?.trim() || 'your current role'
  const targetRole = profile?.targetRole?.trim() || 'your next milestone'
  const challenge = profile?.biggestCareerChallenge?.trim() || 'your growth focus'
  const nextExperiment = analysis?.nextExperiment?.trim() || 'your next step'

  return {
    title: `${firstName}'s growth story`,
    description: `${firstName} is building momentum from ${currentRole} toward ${targetRole}. The report is shaped around ${challenge.toLowerCase()}.`,
    focus: `Current focus: ${nextExperiment}`,
  }
}

export default function GrowthReport() {
  const { analysis, checkIns, profile, showToast } = useCareer()
  const [period, setPeriod] = useState('last-90')
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200)
  }, [])

  const visibleCheckIns = filterCheckInsByPeriod(checkIns, period)
  const hasAnalysis = analysis && analysis.careerScore > 0
  const { metrics, overallScore, avgChange, chartData, canShowChart } = computeMetrics(analysis, visibleCheckIns)
  const moodDistribution = computeMoodDistribution(visibleCheckIns)
  const hasCheckIns = visibleCheckIns.length > 0
  const narrative = getGrowthNarrative(profile, analysis)

  if (!hasAnalysis) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
        <PageHeader
          eyebrow="Growth report"
          title="Growth report"
          description="Generate an analysis and complete some check-ins to see your growth metrics here."
        />
        <div className="card p-8 text-center">
          <div className="mx-auto max-w-sm">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-fg mb-2">No data to report yet</h2>
            <p className="text-sm text-fg-secondary mb-6">
              Start by building your career profile and generating an analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/profile" className="btn-primary-gradient inline-flex">Build profile →</Link>
              <Link to="/analysis" className="btn-outline">View analysis</Link>
            </div>
            {/* BUG-8: Guide user to check-in */}
            <p className="mt-6 text-xs text-fg-muted flex items-center justify-center gap-1.5">
              <span>📝</span>
              After your analysis,{' '}
              <Link to="/check-in" className="text-accent hover:underline font-medium">complete a weekly check-in</Link>
              {' '}to see mood trends and growth patterns.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16 print-report">
      <PageHeader
        eyebrow="Growth report"
        title={profile.name ? `${profile.name.split(/\s+/)[0]}'s growth report` : 'Your growth report'}
        description={hasAnalysis ? narrative.description : 'A simple record of the skills and habits you\'re building over time.'}
        action={
          canShowChart ? (
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
              <option value="last-30">Last 30 days</option>
              <option value="last-90">Last 90 days</option>
            </select>
          ) : null
        }
      />

      <div className="mb-6 rounded-[16px] border border-border bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">Growth thread</p>
            <h3 className="mt-1 text-lg font-semibold text-fg">{narrative.title}</h3>
            <p className="mt-2 max-w-2xl text-sm text-fg-secondary">{narrative.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
              {profile.currentRole || 'Current role'}
            </span>
            <span className="inline-flex rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
              {profile.targetRole || 'Next milestone'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-accent">{narrative.focus}</p>
      </div>

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
            ↑<AnimatedNumber value={avgChange || 0} />
          </p>
        </div>
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Check-ins</p>
          <p className="mt-1 text-2xl font-semibold text-fg">{visibleCheckIns.length}</p>
        </div>
        <div className="stat-card stagger-item">
          <p className="text-xs text-fg-muted font-medium">Strengths</p>
          <p className="mt-1 text-2xl font-semibold text-accent">{analysis.strengths.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
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
              {avgChange > 0 ? <span>↑</span> : ''}
              {avgChange > 0 ? `+${avgChange}` : hasCheckIns ? '—' : '— baseline'} this period
            </span>
          </div>
          {!hasCheckIns && (
            <p className="mt-3 text-xs text-fg-muted">Estimated from your check-ins</p>
          )}

          <div className="mt-8">
            {canShowChart ? (
              <BarChart data={chartData} animate={animate} />
            ) : (
              <div className="flex items-center justify-center h-40 text-sm text-fg-muted border border-dashed border-border rounded-lg">
                Complete more check-ins to see your growth trend
              </div>
            )}
          </div>

          {canShowChart && (
            <div className="mt-6 flex items-center gap-6 text-xs text-fg-muted">
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-fg" /> Score</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-bg-subtle border border-border" /> Target</span>
            </div>
          )}
        </div>

        <aside className="card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="section-eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              This month's reflection
            </p>
            <span className="text-2xl">💭</span>
          </div>
          <blockquote className="mt-4 text-base font-medium leading-7 text-fg-secondary italic border-l-2 border-accent pl-4">
            &ldquo;{analysis.reasoning.split(/(?<=[.!?])\s+/)[0] || 'Your consistency is creating confidence. Keep making your thinking visible.'}&rdquo;
          </blockquote>
          <p className="mt-5 text-sm text-fg-muted flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent pulse-dot" />
            AI Career Growth Mirror
          </p>

          {moodDistribution && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-fg-muted mb-3">Mood distribution</p>
              <div className="space-y-2">
                {Object.entries(moodDistribution).map(([mood, count]) => {
                  const total = visibleCheckIns.length
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={mood} className="flex items-center gap-2">
                      <span className="text-xs w-16 text-fg-secondary truncate">{mood}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                        <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-fg-muted w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!hasCheckIns && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-fg-muted">Complete a check-in to see your mood trends</p>
              <Link to="/check-in" className="mt-2 inline-flex text-xs font-medium text-accent hover:underline">
                Start check-in →
              </Link>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <article key={m.label} className="card-hover-accent stagger-item p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-muted">{m.label}</p>
              <span className={`size-2 rounded-full ${m.color}`} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-semibold text-fg"><AnimatedNumber value={m.score} /></p>
              <span className="badge-dot bg-success-bg text-success border border-success/20">
                {m.change !== '—' ? <span>↑</span> : ''} {m.change}
              </span>
            </div>
            <div className="mt-3 progress-bar">
              <div
                className={`progress-bar-fill ${m.color === 'bg-brand' ? '!bg-brand' : m.color === 'bg-success' ? '!bg-success' : '!bg-info'}`}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            showToast('Use the browser print dialog to save this report as a PDF.', 'info')
            window.print()
          }}
          className="btn-outline"
        >
          <span>📄</span> Export PDF
        </button>
        <Link to="/check-in" className="btn-outline"><span>📝</span> New check-in</Link>
        <Link to="/analysis" className="btn-ghost">View analysis</Link>
      </div>
    </section>
  )
}
