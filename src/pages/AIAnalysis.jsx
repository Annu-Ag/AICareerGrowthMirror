import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import InsightCard from '../components/cards/InsightCard'
import Tag from '../components/cards/Tag'
import AIAvatar from '../components/AIAvatar'
import { useCareer } from '../context/CareerContext'
import { generateMockAnalysis } from '../services/mockAnalysis'

const analysisApiUrl = 'http://localhost:3001/analyze'

const FUN_REACTIONS = ['✨', '🧠', '🚀', '💡', '⭐', '🔮', '🎯', '🌈']

const LOADING_MESSAGES = [
  'Reading your career signals…',
  'Mapping your hidden strengths…',
  'Identifying blind spots…',
  'Connecting the dots…',
  'Analyzing growth patterns…',
  'Consulting the career oracle…',
  'Polishing the mirror…',
  'Almost there…',
]

const LOADING_EMOJIS = ['🔍', '🧪', '🔬', '🤖', '💭', '🔮', '⚡', '🧩']

export default function AIAnalysis() {
  const { profile, analysis, setAnalysis, showToast } = useCareer()
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadMessage, setLoadMessage] = useState('')
  const [loadEmoji, setLoadEmoji] = useState('')
  const [apiMode, setApiMode] = useState(false)
  const [hoverReaction, setHoverReaction] = useState('')
  const [showSparkle, setShowSparkle] = useState(false)

  const name = profile.name || 'your'
  const hasProfile = profile.name.trim().length > 0

  useEffect(() => {
    let interval
    if (isLoading) {
      interval = setInterval(() => {
        setLoadMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
        setLoadEmoji(LOADING_EMOJIS[Math.floor(Math.random() * LOADING_EMOJIS.length)])
      }, 1800)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  async function runAnalysis() {
    setIsLoading(true)
    setLoadMessage(LOADING_MESSAGES[0])
    setLoadEmoji(LOADING_EMOJIS[0])
    setStatus('')

    try {
      if (process.env.NODE_ENV === 'development' && apiMode) {
        const res = await fetch(analysisApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setAnalysis(data)
        setStatus('✨ Analysis refreshed via AI.')
        showToast('Analysis updated!', 'success')
      } else {
        // Simulate varied delay
        const delay = 1800 + Math.random() * 1600
        await new Promise((r) => setTimeout(r, delay))
        const fresh = generateMockAnalysis(profile)
        setAnalysis(fresh)
        setStatus('✨ Your analysis has been refreshed.')
        showToast('Analysis refreshed!', 'success')
      }
    } catch (err) {
      await new Promise((r) => setTimeout(r, 600))
      const fresh = generateMockAnalysis(profile)
      setAnalysis(fresh)
      setStatus('🔮 Used local analysis (AI server unavailable).')
      showToast('Using local analysis mode', 'info')
    }

    setIsLoading(false)
  }

  const reactionEmoji = FUN_REACTIONS[Math.floor(Math.random() * FUN_REACTIONS.length)]

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="AI analysis"
        title={`A clearer view of ${name} career`}
        description="A practical reflection designed to help you focus your energy where it can make the biggest difference."
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={runAnalysis}
              disabled={isLoading}
              className={`btn-primary-gradient relative overflow-hidden ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              onMouseEnter={() => setHoverReaction(reactionEmoji)}
              onMouseLeave={() => setHoverReaction('')}
            >
              {isLoading ? (
                <>
                  <AIAvatar size="sm" isThinking pulseColor="accent" />
                  <span className="ml-1">Analyzing</span>
                </>
              ) : (
                <>
                  <span className="float-emoji">{hoverReaction || '🔮'}</span>
                  Refresh analysis
                </>
              )}
            </button>
          </div>
        }
      />

      {/* AI loading experience */}
      {isLoading && (
        <div className="mb-8 glass-card rounded-[14px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <AIAvatar size="xl" isThinking pulseColor="accent" />
            <div className="mt-8">
              <p className="text-2xl animate-pulse">{loadEmoji}</p>
              <p className="mt-3 text-base font-medium text-fg-secondary thought-appear">
                {loadMessage}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-fg-muted">
                <span className="size-1.5 rounded-full bg-accent pulse-dot" />
                AI is processing your career data
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status banner */}
      {status && !isLoading && (
        <p
          role="status"
          className="mb-6 glass-card rounded-[12px] px-4 py-3 text-sm text-fg-secondary flex items-center gap-2 thought-appear"
        >
          <span>{status}</span>
        </p>
      )}

      {/* Empty state */}
      {!hasProfile && !isLoading && (
        <div className="mb-6 card p-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-sm text-fg-muted flex items-center gap-2">
            <span className="text-lg float-emoji">👤</span>
            Complete your profile for insights tailored to your goals.
          </span>
          <Link
            to="/profile"
            className="btn-outline text-xs px-3 py-1.5"
          >
            Build profile →
          </Link>
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Score card — hero */}
          <article
            className="card-hover-accent stagger-item p-6 sm:p-7 lg:col-span-2 relative overflow-hidden"
            onMouseEnter={() => setShowSparkle(true)}
            onMouseLeave={() => setShowSparkle(false)}
          >
            {showSparkle && (
              <div className="absolute -top-6 -right-6 text-6xl opacity-10 rotate-12 select-none pointer-events-none">
                {FUN_REACTIONS.join(' ')}
              </div>
            )}

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                {/* Circular gauge */}
                <div className="relative size-24 shrink-0">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-bg-subtle)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - analysis.careerScore / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-fg">{analysis.careerScore}</span>
                  </div>
                </div>

                <div>
                  <p className="section-eyebrow flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent pulse-dot" />
                    Career score
                  </p>
                  <p className="mt-1 text-sm leading-6 text-fg-secondary max-w-md">
                    You have momentum. The next lift is making your strategic value easier for others to see.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="badge-dot bg-accent-subtle text-accent border border-accent/20 text-xs">
                  {analysis.strengths.length} strengths
                </span>
                <span className="badge-dot bg-warning-bg text-warning border border-warning/20 text-xs">
                  {analysis.skillGaps.length} gaps
                </span>
              </div>
            </div>

            {/* Progress bar underneath */}
            <div className="mt-5 progress-bar-gradient">
              <div
                className="progress-bar-fill"
                style={{ width: `${analysis.careerScore}%` }}
                role="progressbar"
                aria-valuenow={analysis.careerScore}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Career score ${analysis.careerScore} out of 100`}
              />
            </div>
          </article>

          {/* Strengths */}
          <InsightCard number="01" title="Strengths" icon="✨" accent>
            <div className="flex flex-wrap gap-2">
              {analysis.strengths.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
            <p className="mt-3 text-xs text-fg-muted flex items-center gap-1">
              <span className="float-emoji">💪</span>
              These are your leverage points — lean into them.
            </p>
          </InsightCard>

          {/* Skill gaps */}
          <InsightCard number="02" title="Skill gaps" icon="🎯">
            <div className="space-y-2">
              {analysis.skillGaps.map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-[8px] bg-bg-subtle px-3.5 py-2.5 text-sm font-medium text-fg">
                  <span className="size-1.5 rounded-full bg-warning shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-fg-muted flex items-center gap-1">
              <span className="float-emoji">📈</span>
              Focus on one gap at a time — progress compounds.
            </p>
          </InsightCard>

          {/* Hidden blockers */}
          <InsightCard number="03" title="Hidden blockers" icon="🔍">
            <div className="rounded-[8px] border border-border bg-bg-subtle/50 p-4 space-y-3">
              {analysis.hiddenBlockers.map((item) => (
                <p key={item} className="text-sm leading-6 text-fg-secondary flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-danger shrink-0 mt-2" />
                  {item}
                </p>
              ))}
            </div>
          </InsightCard>

          {/* 7-day experiment */}
          <article className="card-hover-accent stagger-item p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-eyebrow flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-success" />
                  04 — 7-day growth experiment
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-fg">
                  Make a small, meaningful move
                </h2>
              </div>
              <span className="badge-dot bg-success-bg text-success border border-success/20 text-xs">
                <span className="size-1.5 rounded-full bg-success pulse-dot" />
                This week
              </span>
            </div>
            <div className="mt-5 rounded-[9px] bg-accent-subtle/50 border border-accent/10 p-4 text-sm leading-7 text-fg flex items-start gap-3">
              <span className="float-emoji text-lg shrink-0 mt-0.5">🧪</span>
              {analysis.nextExperiment}
            </div>
            <Link
              to="/check-in"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover group"
            >
              Set up your weekly check-in
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      )}

      {/* Bottom CTA */}
      {!isLoading && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/profile"
            className="btn-outline"
          >
            <span className="float-emoji">✏️</span>
            Edit profile
          </Link>
          <Link
            to="/report"
            className="btn-ghost"
          >
            View growth report →
          </Link>
        </div>
      )}
    </section>
  )
}
