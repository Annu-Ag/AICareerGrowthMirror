import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import ProfileField from '../components/forms/ProfileField'
import { useCareer } from '../context/CareerContext'
import { parseResume } from '../services/api'

const FIELD_META = {
  name: { label: 'Name', shortLabel: 'Name', placeholder: 'e.g. Priya Sharma', icon: '👤', required: true, maxLength: 100 },
  currentRole: { label: 'Current role', shortLabel: 'Role', placeholder: 'e.g. Product Designer', icon: '💼', required: true, maxLength: 100 },
  yearsOfExperience: { label: 'Years of experience', shortLabel: 'Experience', placeholder: 'e.g. 5', icon: '📅', required: true, inputMode: 'numeric', maxLength: 3 },
  currentSkills: { label: 'Current skills', shortLabel: 'Skills', placeholder: 'e.g. User research, Figma, Product strategy', icon: '🛠️', required: true, hint: 'Separate skills with commas.', fullWidth: true, maxLength: 500 },
  targetRole: { label: 'Target role', shortLabel: 'Target', placeholder: 'e.g. Design Lead', icon: '🎯', required: true, maxLength: 100 },
  dreamCompany: { label: 'Dream company', shortLabel: null, placeholder: 'e.g. Stripe, Canva, or your own company', icon: '🏢', required: false, fullWidth: true, maxLength: 200 },
  biggestCareerChallenge: { label: 'Biggest career challenge', shortLabel: 'Challenge', placeholder: 'What feels most difficult or uncertain right now?', icon: '🧗', required: true, fullWidth: true, textarea: true, maxLength: 1000 },
}

const REQUIRED_FIELDS = Object.entries(FIELD_META).filter(([, meta]) => meta.required).map(([name]) => name)
const MAX_RESUME_SIZE = 10 * 1024 * 1024 // 10MB

function completion(profile) {
  const filled = REQUIRED_FIELDS.filter((field) => profile[field] && profile[field].trim()).length
  return Math.round((filled / REQUIRED_FIELDS.length) * 100)
}

function sanitizeValue(value, maxLength) {
  if (typeof value !== 'string') return ''
  // Trim whitespace, collapse multiple spaces
  let cleaned = value.trim().replace(/\s+/g, ' ')
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength)
  }
  return cleaned
}

function getResumeNameHint(profileName, fileName) {
  if (!profileName || !fileName) return null

  const normalizedProfile = profileName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const normalizedFile = fileName
    .toLowerCase()
    .replace(/\.(pdf|txt|docx)$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  if (!normalizedProfile || !normalizedFile) return null

  const profileTokens = normalizedProfile.split(/\s+/).filter(Boolean)
  const fileTokens = normalizedFile.split(/\s+/).filter(Boolean)
  const hasMatch = profileTokens.some((token) => token.length > 2 && fileTokens.includes(token))

  if (hasMatch) return null

  return {
    text: 'The filename does not clearly match your profile name. If this is the wrong document, swap it for the matching resume so the report stays aligned.',
  }
}

export default function CareerProfile() {
  const { profile, setProfile, showToast, resetEverything } = useCareer()
  const [isSaved, setIsSaved] = useState(false)
  const [hasEverSaved, setHasEverSaved] = useState(false)
  const [animatingScore, setAnimatingScore] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // BUG-4: Warn before leaving with unsaved changes
  useEffect(() => {
    if (!profile.name && !profile.currentRole) return
    const handler = (e) => {
      if (!isSaved) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [profile, isSaved])

  function handleChange(event) {
    const { name, value } = event.target
    const meta = FIELD_META[name]
    // Client-side: prevent exceeding maxLength during typing for non-textarea fields
    if (!meta?.textarea && meta?.maxLength && value.length > meta.maxLength) {
      return
    }
    setProfile((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)
    setError('')
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const normalizedType = file.type || ''
    const lowerName = file.name.toLowerCase()
    const isPdf = normalizedType === 'application/pdf' || lowerName.endsWith('.pdf')
    const isTxt = normalizedType === 'text/plain' || normalizedType === 'application/plain' || normalizedType.startsWith('text/') || lowerName.endsWith('.txt')
    const isDocx = normalizedType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || lowerName.endsWith('.docx')

    if (!isPdf && !isTxt && !isDocx) {
      showToast('Please upload a PDF, TXT, or DOCX file for AI analysis', 'warning')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size > MAX_RESUME_SIZE) {
      showToast('Resume must be under 10MB', 'warning')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      if (isTxt) {
        const text = await file.text()
        const trimmedText = text.slice(0, 8000)
        setProfile((prev) => ({ ...prev, resumeFileName: file.name, resumeText: trimmedText }))
        if (trimmedText.trim()) {
          showToast(`Resume text loaded (${trimmedText.length} chars)`, 'success')
        } else {
          showToast('Resume uploaded, but no text could be extracted. You can still continue and add details manually.', 'info')
        }
      } else {
        const data = await parseResume(file)
        const nextText = data?.resumeText || ''
        setProfile((prev) => ({ ...prev, resumeFileName: file.name, resumeText: nextText }))
        if (nextText.trim()) {
          showToast(`Resume parsed (${data?.charCount || 0} chars)`, 'success')
        } else {
          showToast(data?.message || 'Resume uploaded, but no text could be extracted. You can still continue and add details manually.', 'info')
        }
      }
    } catch (err) {
      const message = err?.message || 'Could not process resume.'
      const friendlyMessage = /failed to fetch|timed out|network|fetch/i.test(message)
        ? 'The resume service is unavailable right now. Start the local API server and try again.'
        : message
      showToast(friendlyMessage, 'warning')
      setProfile((prev) => ({ ...prev, resumeFileName: '', resumeText: '' }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setIsSaved(false)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    // Trim all profile values
    const trimmed = {}
    for (const [key, value] of Object.entries(profile)) {
      trimmed[key] = typeof value === 'string' ? sanitizeValue(value, FIELD_META[key]?.maxLength) : value
    }
    setProfile(trimmed)

    // Validate each required field
    const emptyFields = REQUIRED_FIELDS.filter((field) => !trimmed[field] || !trimmed[field].trim())
    if (emptyFields.length > 0) {
      const labels = emptyFields.map((f) => FIELD_META[f]?.label || f).join(', ')
      showToast(`Please fill in: ${labels}`, 'warning')
      return
    }

    // Name must be at least 2 characters
    if (trimmed.name.length < 2) {
      showToast('Name must be at least 2 characters', 'warning')
      return
    }

    // Validate years of experience is a positive number
    const years = trimmed.yearsOfExperience.trim()
    if (years) {
      const numYears = Number(years)
      if (isNaN(numYears) || !Number.isFinite(numYears)) {
        showToast('Years of experience must be a number', 'warning')
        return
      }
      if (numYears < 0) {
        showToast('Years of experience cannot be negative', 'warning')
        return
      }
      if (numYears > 100) {
        showToast('Years of experience seems unrealistic (max 100)', 'warning')
        return
      }
    }

    // Warn if too little data for meaningful analysis
    const filledCount = REQUIRED_FIELDS.filter((f) => trimmed[f] && trimmed[f].trim()).length
    if (filledCount < 3) {
      showToast('Fill at least 3 fields for a meaningful analysis', 'warning')
      return
    }

    setIsSaved(true)
    setHasEverSaved(true)
    setAnimatingScore(true)
    setTimeout(() => setAnimatingScore(false), 800)
    showToast('Profile saved successfully!', 'success')
  }

  const pct = completion(profile)
  const showAnalysisLink = isSaved || hasEverSaved
  const resumeNameHint = getResumeNameHint(profile.name, profile.resumeFileName)

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="Career profile"
        title="Build your professional mirror"
        description="Give your analysis the context it needs to surface the patterns, strengths, and next moves that matter most."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form
          onSubmit={handleSubmit}
          className="card p-6 sm:p-8"
          noValidate
        >
          {/* Form header */}
          <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
            <div>
              <h2 className="text-base font-semibold text-fg">Your career snapshot</h2>
              <p className="mt-0.5 text-sm text-fg-secondary">
                Fields marked with <span className="text-accent">*</span> are required.
              </p>
            </div>
            <span className="icon-square-accent">✦</span>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 rounded-[9px] border border-danger/20 bg-danger-bg px-3.5 py-2.5 text-sm text-danger font-medium" role="alert">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(FIELD_META).map(([name, meta]) => (
              <div key={name} className={meta.fullWidth ? 'sm:col-span-2' : ''}>
                <ProfileField
                  label={meta.label}
                  name={name}
                  value={profile[name] || ''}
                  onChange={handleChange}
                  placeholder={meta.placeholder}
                  hint={meta.hint}
                  textarea={meta.textarea}
                  required={meta.required}
                  inputMode={meta.inputMode}
                  maxLength={meta.maxLength}
                />
              </div>
            ))}

            {/* Resume upload with edge case protections */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-fg-secondary mb-1.5">
                Resume (optional)
              </label>
              <label className={`input-base flex items-center gap-3 cursor-pointer hover:border-accent transition-colors mt-1.5 ${profile.resumeFileName ? 'border-success/40' : ''}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <span className="text-base">📄</span>
                <span className={profile.resumeFileName ? 'text-fg flex-1 truncate' : 'text-fg-muted flex-1'}>
                  {profile.resumeFileName || 'Upload your resume (PDF, TXT, or DOCX)'}
                </span>
                <span className="btn-outline text-xs px-2 py-1 pointer-events-none">
                  {profile.resumeFileName ? 'Change' : 'Browse'}
                </span>
              </label>
              {profile.resumeFileName && (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="text-xs font-medium text-warning"
                    onClick={() => {
                      setProfile((prev) => ({ ...prev, resumeFileName: '', resumeText: '' }))
                      if (fileInputRef.current) fileInputRef.current.value = ''
                      showToast('Resume cleared', 'info')
                    }}
                  >
                    Clear resume
                  </button>
                  {profile.name && (
                    <span className="text-xs text-success">
                      This resume will help tailor {profile.name.split(/\s+/)[0]}'s report.
                    </span>
                  )}
                </div>
              )}
              {resumeNameHint && (
                <p className="mt-2 text-xs text-fg-muted flex items-start gap-1.5">
                  <span className="mt-0.5 text-accent">✦</span>
                  <span>{resumeNameHint.text}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-fg-muted flex items-center gap-1">
                <span className="size-1 rounded-full bg-accent/40" />
                Max 10MB. PDF, TXT, or DOCX supported for AI analysis.
              </p>
            </div>
          </div>

          {/* Form footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-fg-muted flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-success" /> Saved in your browser.
            </p>
            <div className="flex items-center gap-3">
              {showAnalysisLink && (
                <Link
                  to="/analysis"
                  className="btn-ghost text-xs"
                >
                  View analysis →
                </Link>
              )}
              <button
                type="submit"
                className="btn-primary-gradient"
              >
                Save profile
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="h-fit space-y-5">
          <div className="card p-6 sm:p-7">
            <p className="section-eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              Profile progress
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className={`text-4xl font-semibold tracking-tight text-fg ${animatingScore ? 'count-up' : ''}`}>
                {pct}
              </span>
              <span className="text-lg font-normal text-fg-muted">%</span>
            </div>
            <div className="mt-4 progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% complete`}
              />
            </div>

            <div className="mt-5 space-y-2.5">
            {REQUIRED_FIELDS.map((field) => {
              const meta = FIELD_META[field]
              const filled = profile[field] && profile[field].trim().length > 0
              return (
                <div key={field} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      filled
                        ? 'bg-success-bg text-success'
                        : 'bg-bg-subtle text-fg-muted'
                    }`}
                  >
                    {filled ? '✓' : meta.icon}
                  </span>
                  <span className={filled ? 'text-fg font-medium' : 'text-fg-muted'}>
                    {meta.shortLabel}
                  </span>
                </div>
              )
            })}
            </div>

            {isSaved && (
              <div className="mt-5 rounded-[9px] border border-success/20 bg-success-bg px-3.5 py-2.5 text-sm text-success font-medium flex items-center gap-2">
                <span>✓</span>
                Profile saved
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all saved profile, analysis, and check-ins?')) {
                  setProfile((prev) => ({ ...prev, ...{} }))
                }
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-warning"
            >
              ♻️ Reset data
            </button>
          </div>

          <div className="card p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-sm font-semibold text-fg">Why complete your profile?</p>
                <p className="mt-1 text-xs leading-5 text-fg-secondary">
                  The more context you share, the sharper your career reflection becomes. Your analysis gets
                  personalized to your specific situation.
                </p>
              </div>
            </div>
            {!hasEverSaved && (
              <Link
                to="/analysis"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
              >
                Continue to analysis →
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
