import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import ProfileField from '../components/forms/ProfileField'
import { useCareer } from '../context/CareerContext'

const REQUIRED_FIELDS = ['name', 'currentRole', 'yearsOfExperience', 'currentSkills', 'targetRole', 'biggestCareerChallenge']

function completion(profile) {
  const filled = REQUIRED_FIELDS.filter((field) => profile[field].trim()).length
  return Math.round((filled / REQUIRED_FIELDS.length) * 100)
}

const fieldIcons = {
  name: '👤',
  currentRole: '💼',
  yearsOfExperience: '📅',
  currentSkills: '🛠️',
  targetRole: '🎯',
  dreamCompany: '🏢',
  biggestCareerChallenge: '🧗',
}

export default function CareerProfile() {
  const { profile, setProfile, showToast } = useCareer()
  const [isSaved, setIsSaved] = useState(false)
  const [animatingScore, setAnimatingScore] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setProfile((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSaved(true)
    setAnimatingScore(true)
    setTimeout(() => setAnimatingScore(false), 800)
    showToast('Profile saved successfully!', 'success')
    setTimeout(() => navigate('/analysis'), 800)
  }

  const pct = completion(profile)

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

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(fieldIcons).map(([name, icon]) => {
              // Dream company is optional, show it with an indicator
              const isOptional = name === 'dreamCompany'
              if (name === 'biggestCareerChallenge') {
                return (
                  <div key={name} className="sm:col-span-2">
                    <ProfileField
                      label={getLabel(name)}
                      name={name}
                      value={profile[name]}
                      onChange={handleChange}
                      placeholder={getPlaceholder(name)}
                      textarea
                      required
                    />
                  </div>
                )
              }
              if (name === 'dreamCompany') {
                return (
                  <div key={name} className="sm:col-span-2">
                    <ProfileField
                      label={getLabel(name)}
                      name={name}
                      value={profile[name]}
                      onChange={handleChange}
                      placeholder={getPlaceholder(name)}
                    />
                  </div>
                )
              }
              if (name === 'currentSkills') {
                return (
                  <div key={name} className="sm:col-span-2">
                    <ProfileField
                      label={getLabel(name)}
                      name={name}
                      value={profile[name]}
                      onChange={handleChange}
                      placeholder={getPlaceholder(name)}
                      hint="Separate skills with commas."
                      required
                    />
                  </div>
                )
              }
              return (
                <ProfileField
                  key={name}
                  label={getLabel(name)}
                  name={name}
                  value={profile[name]}
                  onChange={handleChange}
                  placeholder={getPlaceholder(name)}
                  inputMode={name === 'yearsOfExperience' ? 'numeric' : undefined}
                  required={!isOptional}
                />
              )
            })}
          </div>

          {/* Form footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-fg-muted">
              <span className="inline-block size-1.5 rounded-full bg-warning" /> Your profile lives in this session only.
            </p>
            <button
              type="submit"
              className="btn-primary-gradient"
            >
              Save & view analysis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
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
                const filled = profile[field].trim().length > 0
                return (
                  <div key={field} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        filled
                          ? 'bg-success-bg text-success'
                          : 'bg-bg-subtle text-fg-muted'
                      }`}
                    >
                      {filled ? '✓' : fieldIcons[field]}
                    </span>
                    <span className={filled ? 'text-fg font-medium' : 'text-fg-muted'}>
                      {getShortLabel(field)}
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
            {!isSaved && (
              <Link
                to="/analysis"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
              >
                Explore an example analysis →
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

function getLabel(name) {
  const labels = {
    name: 'Name',
    currentRole: 'Current role',
    yearsOfExperience: 'Years of experience',
    currentSkills: 'Current skills',
    targetRole: 'Target role',
    dreamCompany: 'Dream company',
    biggestCareerChallenge: 'Biggest career challenge',
  }
  return labels[name] || name
}

function getShortLabel(name) {
  const labels = {
    name: 'Name',
    currentRole: 'Role',
    yearsOfExperience: 'Experience',
    currentSkills: 'Skills',
    targetRole: 'Target',
    biggestCareerChallenge: 'Challenge',
  }
  return labels[name] || name
}

function getPlaceholder(name) {
  const placeholders = {
    name: 'e.g. Priya Sharma',
    currentRole: 'e.g. Product Designer',
    yearsOfExperience: 'e.g. 5',
    currentSkills: 'e.g. User research, Figma, Product strategy',
    targetRole: 'e.g. Design Lead',
    dreamCompany: 'e.g. Stripe, Canva, or your own company',
    biggestCareerChallenge: 'What feels most difficult or uncertain right now?',
  }
  return placeholders[name] || ''
}
