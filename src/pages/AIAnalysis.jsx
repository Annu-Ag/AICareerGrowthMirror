import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import InsightCard from '../components/cards/InsightCard'
import Tag from '../components/cards/Tag'
import AIAvatar from '../components/AIAvatar'
import { useCareer } from '../context/CareerContext'
import { analyzeCareer, checkHealth } from '../services/api'
import { generateMockAnalysis } from '../services/mockAnalysis'
import { getMissingProfileFields, isProfileReadyForAnalysis } from '../utils/profileValidation'

const API_TIMEOUT_MS = 15000 // 15s timeout

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

function isValidAnalysis(data) {
  if (!data || typeof data !== 'object') return false
  if (typeof data.careerScore !== 'number' || data.careerScore < 0 || data.careerScore > 100) return false
  if (!Array.isArray(data.strengths)) return false
  if (!Array.isArray(data.skillGaps)) return false
  if (!Array.isArray(data.hiddenBlockers)) return false
  if (typeof data.nextExperiment !== 'string' || !data.nextExperiment.trim()) return false
  if (typeof data.reasoning !== 'string' || !data.reasoning.trim()) return false
  return true
}

function safeParseAnalysis(raw) {
  try {
    if (typeof raw === 'string') {
      raw = JSON.parse(raw)
    }
    return raw
  } catch {
    return null
  }
}

export default function AIAnalysis() {
  const { profile, analysis, setAnalysis, showToast, hasRealAnalysis, setHasRealAnalysis, trackExperiment, experimentTracking, checkIns } = useCareer()
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadMessage, setLoadMessage] = useState('')
  const [loadEmoji, setLoadEmoji] = useState('')
  const [apiMode, setApiMode] = useState(false)
  const [hoverReaction, setHoverReaction] = useState('')
  const [showSparkle, setShowSparkle] = useState(false)
  const [showBlockerModal, setShowBlockerModal] = useState(false)
  const [blockerInput, setBlockerInput] = useState('')
  const abortRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [])

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

  useEffect(() => {
    let active = true
    async function checkApi() {
      try {
        const health = await checkHealth()
        if (!active) return
        setApiMode(Boolean(health?.hasApiKey))
      } catch {
        if (active) {
          setApiMode(false)
        }
      }
    }

    checkApi()
    return () => {
      active = false
    }
  }, [])

  async function fetchRealAnalysis(payload) {
    const controller = new AbortController()
    abortRef.current = controller

    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

    try {
      const parsed = safeParseAnalysis(await analyzeCareer(payload))
      clearTimeout(timeoutId)
      abortRef.current = null

      if (!parsed || !isValidAnalysis(parsed)) {
        throw new Error('API returned an incomplete or malformed response')
      }

      return parsed
    } catch (err) {
      clearTimeout(timeoutId)
      abortRef.current = null

      if (err.name === 'AbortError') {
        throw new Error('Request timed out after 15 seconds')
      }
      throw err
    }
  }

  async function runAnalysis({ useCheckIns = false } = {}) {
    if (isLoading) return // Prevent double clicks
    if (!profileReady) {
      setStatus('Complete your profile before generating an analysis.')
      showToast('Complete your profile before generating an analysis.', 'warning')
      return
    }

    setIsLoading(true)
    setLoadMessage(LOADING_MESSAGES[0])
    setLoadEmoji(LOADING_EMOJIS[0])
    setStatus('')

    try {
      let result
      const payload = {
        profile,
        resumeText: profile.resumeText || '',
        checkInHistory: useCheckIns ? checkIns.slice(-5) : [],
      }

      if (apiMode) {
        try {
          result = await fetchRealAnalysis(payload)
          setHasRealAnalysis(true)
          setStatus('✨ Live AI analysis generated successfully.')
        } catch (err) {
          const fallback = generateMockAnalysis(profile)
          result = fallback
          setHasRealAnalysis(false)
          setStatus(`🔮 ${err.message}. Using offline demo fallback.`)
          showToast('Live AI analysis unavailable — using offline demo fallback.', 'info')
        }
      } else {
        const delay = 1800 + Math.random() * 1600
        await new Promise((r) => setTimeout(r, delay))
        result = generateMockAnalysis(profile, false)
        setHasRealAnalysis(false)
        setStatus('🔮 Offline demo analysis generated locally.')
      }

      if (!mountedRef.current) return

      setAnalysis(result)
      showToast('Analysis updated!', 'success')
    } catch (err) {
      if (!mountedRef.current) return
      // Last resort fallback
      const fallback = generateMockAnalysis(profile)
      setAnalysis(fallback)
      setHasRealAnalysis(false)
      setStatus('🔮 Used local analysis (unexpected error).')
      showToast('Using local analysis mode', 'info')
    }

    if (mountedRef.current) {
      setIsLoading(false)
    }
  }

  const name = profile.name || 'your'
  const hasProfile = profile.name.trim().length > 0
  const hasAnalysisData = analysis.careerScore > 0
  const profileReady = isProfileReadyForAnalysis(profile)
  const missingFields = getMissingProfileFields(profile)
  const actionLabel = checkIns.length > 0 ? 'Re-analyze with check-ins' : hasAnalysisData ? 'Re-analyze' : 'Generate analysis'

  const reactionEmoji = FUN_REACTIONS[Math.floor(Math.random() * FUN_REACTIONS.length)]

  function handleBlockerSubmit() {
    trackExperiment(false, blockerInput.trim())
    setBlockerInput('')
    setShowBlockerModal(false)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="AI analysis"
        title={hasAnalysisData ? `A clearer view of ${name}'s career` : 'Your career analysis'}
        description={
          hasAnalysisData
            ? 'A practical reflection designed to help you focus your energy where it can make the biggest difference.'
            : 'Complete your profile first, then generate a personalized career analysis.'
        }
        action={
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${hasRealAnalysis ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
              {hasRealAnalysis ? 'Live AI' : 'Offline demo'}
            </span>
            <button
              type="button"
              onClick={() => runAnalysis({ useCheckIns: true })}
              disabled={isLoading || !profileReady}
              className={`btn-primary-gradient relative overflow-hidden ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              onMouseEnter={() => setHoverReaction(reactionEmoji)}
              onMouseLeave={() => setHoverReaction('')}
            >
              {isLoading ? (
                <>
                  <span className="spinner size-4 border-2 border-white/30 border-t-white rounded-full" />
                  <span className="ml-1">Analyzing</span>
                </>
              ) : (
                <>
                  <span className="float-emoji">{hoverReaction || '🔮'}</span>
                  {actionLabel}
                </>
              )}
            </button>
          </div>
        }
      />

      {showBlockerModal && (
        <div className="mb-6 rounded-[12px] border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
          <label className="block text-sm font-semibold text-fg" htmlFor="blocker-note">
            What got in the way of this experiment?
          </label>
          <textarea
            id="blocker-note"
            value={blockerInput}
            onChange={(event) => setBlockerInput(event.target.value)}
            className="input-base mt-2 min-h-24"
            placeholder="Optional note for your reflection"
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="btn-primary-gradient text-xs" onClick={handleBlockerSubmit}>
              Save blocker
            </button>
            <button type="button" className="btn-ghost text-xs" onClick={() => { setBlockerInput(''); setShowBlockerModal(false) }}>
              Cancel
            </button>
          </div>
        </div>
      )}

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
              {apiMode && (
                <p className="mt-2 text-[10px] text-fg-muted">Using live AI API — may take up to 15s</p>
              )}
            </div>
          </div>
        </div>
      )}

      {profileReady ? null : (
        <div className="mb-6 rounded-[12px] border border-warning/20 bg-warning-bg p-4 text-sm text-warning">
          <p className="font-semibold">Complete your profile before generating AI analysis</p>
          <ul className="mt-2 list-disc pl-5">
            {missingFields.length > 0 ? missingFields.map((field) => <li key={field}>{field}</li>) : <li>Fill in the remaining fields.</li>}
          </ul>
        </div>
      )}

      {/* Status banner — shows fallback / live mode info */}
      {status && !isLoading && (
        <p
          role="status"
          className={`mb-6 rounded-[12px] px-4 py-3 text-sm flex items-center gap-2 thought-appear ${
            hasRealAnalysis ? 'glass-card text-fg-secondary' : 'border border-warning/20 bg-warning-bg text-warning'
          }`}
        >
          {!hasRealAnalysis && <span className="shrink-0">🔮</span>}
          <span>{status}</span>
          {!hasRealAnalysis && (
            <span className="ml-auto text-[10px] font-medium uppercase tracking-wider opacity-60">
              Local analysis
            </span>
          )}
        </p>
      )}

      {/* Empty state — no profile, no analysis */}
      {!hasProfile && !isLoading && !hasAnalysisData && (
        <div className="card p-8 text-center">
          <div className="mx-auto max-w-sm">
            <div className="text-5xl mb-4">🔮</div>
            <h2 className="text-xl font-semibold text-fg mb-2">No analysis yet</h2>
            <p className="text-sm text-fg-secondary mb-6">
              Build your career profile first so the mirror has something to reflect on.
            </p>
            <Link to="/profile" className="btn-primary-gradient inline-flex">
              Build profile →
            </Link>
          </div>
        </div>
      )}

      {/* Prompt to fill profile when user hasn't but analysis exists from local data */}
      {hasAnalysisData && !hasProfile && !isLoading && (
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

      {/* Only show analysis content when we have data */}
      {hasAnalysisData && !isLoading && (
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
                    {analysis.careerScore >= 80
                      ? 'You\'re in a strong position — focus on leverage and visibility.'
                      : analysis.careerScore >= 60
                      ? 'You have momentum. The next lift is making your strategic value easier for others to see.'
                      : 'Build on your foundations. Every small improvement compounds.'}
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
            {/* Experiment tracker */}
            {!experimentTracking.completed && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => trackExperiment(true)}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  ✅ Done — completed it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockerModal(true)
                  }}
                  className="btn-ghost text-xs"
                >
                  ❌ Didn't get to it
                </button>
              </div>
            )}
            {experimentTracking.completed && (
              <div className="mt-4 rounded-[8px] bg-success-bg border border-success/20 px-3.5 py-2 text-xs text-success font-medium flex items-center gap-2">
                <span>🎉</span>
                Experiment completed! Score +2. This was added to strengths.
              </div>
            )}

            <Link
              to="/check-in"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover group"
            >
              Set up your weekly check-in
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>

            {/* Share card */}
            <button
              type="button"
              onClick={() => {
                const text = `🧠 My Career Mirror Analysis\n\nScore: ${analysis.careerScore}/100\nTop strength: ${analysis.strengths[0] || '—'}\nExperiment: ${analysis.nextExperiment}\n\nBuilt with AI Career Growth Mirror`
                navigator.clipboard.writeText(text).then(
                  () => showToast('Analysis copied! Share it anywhere. ✨', 'success'),
                  () => showToast('Could not copy — select and copy the text manually.', 'info')
                )
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent transition-colors group"
            >
              <span className="transition-transform group-hover:scale-110">📋</span>
              Copy analysis to share
            </button>
          </article>
        </div>
      )}

      {/* Reasoning — how the AI reached these conclusions */}
      {hasAnalysisData && !isLoading && analysis.reasoning && (
        <details className="mt-6 group">
          <summary className="cursor-pointer text-sm text-fg-muted hover:text-fg-secondary transition-colors select-none">
            <span className="inline-flex items-center gap-2">
              <span className="transition-transform group-open:rotate-90">▶</span>
              How this analysis was determined
            </span>
          </summary>
          <div className="mt-3 rounded-[10px] border border-border bg-bg-subtle/40 p-4 text-sm leading-6 text-fg-secondary">
            {analysis.reasoning}
          </div>
        </details>
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
          {hasAnalysisData && (
            <Link
              to="/report"
              className="btn-ghost"
            >
              View growth report →
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
