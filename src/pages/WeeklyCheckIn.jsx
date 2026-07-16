import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import CheckInField from '../components/forms/CheckInField'
import AIAvatar from '../components/AIAvatar'
import { useCareer } from '../context/CareerContext'
import { MOODS } from '../data/moods'

const moodEmojis = {
  Stuck: '🔴',
  Uneasy: '🟠',
  Steady: '🟡',
  Hopeful: '🟢',
  Energized: '🟣',
}

const moodMessages = {
  Stuck: "That's okay — noticing it is the first step toward movement.",
  Uneasy: 'Growth often lives right outside your comfort zone.',
  Steady: 'Consistency is your quiet superpower.',
  Hopeful: 'Something good is building. Keep going.',
  Energized: 'Channel that energy into one focused action.',
}

const ENERGY_PROMPTS = [
  '⚡',
  '💡',
  '🌟',
  '🎉',
  '💪',
  '🌈',
  '✨',
  '🔥',
]

export default function WeeklyCheckIn() {
  const { checkIn, setCheckIn, saveCheckIn, showToast, checkIns } = useCareer()
  const [saved, setSaved] = useState(false)
  const [promptEmoji, setPromptEmoji] = useState('⚡')

  function update(field, value) {
    setCheckIn((current) => ({ ...current, [field]: value }))
    setSaved(false)
    if (field === 'energy') {
      setPromptEmoji(ENERGY_PROMPTS[Math.floor(Math.random() * ENERGY_PROMPTS.length)])
    }
  }

  function save(event) {
    event.preventDefault()
    saveCheckIn(checkIn)
    setSaved(true)
    showToast('Reflection saved ✨', 'success')
  }

  const hasEntries = checkIns.length > 0
  const currentMoodEmoji = checkIn.mood ? moodEmojis[checkIn.mood] : null
  const moodMessage = checkIn.mood ? moodMessages[checkIn.mood] : null

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="Weekly check-in"
        title="Pause. Notice. Move forward."
        description="A few minutes of honest reflection helps your progress become visible."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={save}
          className="card p-6 sm:p-8 space-y-7"
        >
          {/* AI check-in buddy */}
          <div className="flex items-center gap-4 mb-2 rounded-[12px] bg-accent-subtle/50 border border-accent/10 p-4">
            <AIAvatar size="sm" pulseColor="accent" />
            <div>
              <p className="text-sm font-semibold text-accent">Your AI check-in buddy 👋</p>
              <p className="text-xs text-fg-muted mt-0.5">
                I'll help you notice patterns you might miss. Just be honest.
              </p>
            </div>
          </div>

          {/* Mood picker first - most visual */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold text-fg">
              <span>🎯</span>
              How are you feeling about your growth?
              {currentMoodEmoji && <span className="float-emoji ml-1">{currentMoodEmoji}</span>}
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => update('mood', mood)}
                  aria-pressed={checkIn.mood === mood}
                  className={`mood-btn flex flex-col items-center gap-1 py-3 ${
                    checkIn.mood === mood ? 'ring-2 ring-accent ring-offset-2' : ''
                  }`}
                >
                  <span className="text-lg">{moodEmojis[mood]}</span>
                  <span>{mood}</span>
                </button>
              ))}
            </div>
            {moodMessage && (
              <p className="mt-3 text-xs text-fg-muted flex items-center gap-1 thought-appear">
                <span className="float-emoji">💬</span>
                {moodMessage}
              </p>
            )}
          </fieldset>

          <CheckInField
            label="What gave you energy this week?"
            value={checkIn.energy}
            onChange={(e) => update('energy', e.target.value)}
            placeholder="A conversation, a project, a small win…"
            icon={promptEmoji}
          />

          <CheckInField
            label="What felt challenging?"
            value={checkIn.challenge}
            onChange={(e) => update('challenge', e.target.value)}
            placeholder="Name it without trying to solve it yet."
            icon="🧗"
          />

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg-muted flex items-center gap-2" role="status">
              <span className={`inline-block size-1.5 rounded-full ${saved ? 'bg-success pulse-dot' : 'bg-fg-muted'}`} />
              {saved ? 'Reflection saved for this session ✨' : 'Your reflection is private to this session.'}
            </p>
            <button
              type="submit"
              className="btn-primary-gradient"
            >
              {saved ? 'Update reflection' : 'Save reflection'}
              <span className="float-emoji">📝</span>
            </button>
          </div>

          {saved && (
            <Link
              to="/report"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover group"
            >
              View your growth report
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          )}
        </form>

        {/* Sidebar */}
        <aside className="h-fit space-y-5">
          {hasEntries && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <AIAvatar size="sm" pulseColor="success" />
                <p className="section-eyebrow">Recent reflections</p>
              </div>
              <div className="space-y-3">
                {[...checkIns].reverse().slice(0, 3).map((entry, i) => (
                  <div key={i} className="rounded-[8px] bg-bg-subtle p-3 thought-appear">
                    <div className="flex items-center gap-2">
                      {entry.mood && <span className="float-emoji">{moodEmojis[entry.mood] || '📝'}</span>}
                      <span className="text-xs text-fg-muted">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.energy && (
                      <p className="mt-1 text-xs text-fg-secondary line-clamp-2">{entry.energy}</p>
                    )}
                  </div>
                ))}
              </div>
              <Link
                to="/report"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent-hover"
              >
                See full history →
              </Link>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg float-emoji">💭</span>
              <div>
                <p className="text-sm font-semibold text-fg">Why reflect regularly?</p>
                <p className="mt-1 text-xs leading-5 text-fg-secondary">
                  Small weekly check-ins compound into powerful self-awareness. Patterns emerge that
                  you can't see day-to-day.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {MOODS.slice(0, 5).map((m) => (
                  <span key={m} className="text-sm float-emoji">{moodEmojis[m]}</span>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-fg">Mood tracking</p>
                <p className="text-xs text-fg-muted">See your emotional trends in the report</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
