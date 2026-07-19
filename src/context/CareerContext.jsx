import { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { createCloudSyncId, loadCloudSnapshot, saveCloudSnapshot } from '../services/api'

const CareerContext = createContext(null)

const STORAGE_KEY = 'career-mirror-state'

const initialProfile = {
  name: '',
  currentRole: '',
  yearsOfExperience: '',
  currentSkills: '',
  targetRole: '',
  dreamCompany: '',
  biggestCareerChallenge: '',
  resumeFileName: '',
  resumeText: '',
}

const emptyAnalysis = {
  careerScore: 0,
  strengths: [],
  skillGaps: [],
  hiddenBlockers: [],
  nextExperiment: '',
  reasoning: '',
}

const emptyExperimentTracking = {
  experiment: '',
  startedAt: null,
  completedAt: null,
  completed: false,
  blockedBy: '',
}

const initialOnboardingChoice = null

const demoProfile = {
  name: 'Alex Chen',
  currentRole: 'Senior Product Designer',
  yearsOfExperience: '6',
  currentSkills: 'User research, Figma, Design systems, Prototyping, UX strategy',
  targetRole: 'Design Lead',
  dreamCompany: 'Stripe',
  biggestCareerChallenge: 'Making my strategic impact visible to leadership — I do great work but get overlooked for promotions',
  resumeFileName: '',
  resumeText: '',
}

const demoCheckIns = [
  { energy: 'Finally shipped the new onboarding flow after 3 months of iteration. Got great feedback from beta users.', challenge: 'Had a tough conversation with my manager about scope creep on the design system project. Felt underprepared.', mood: 'Hopeful', timestamp: Date.now() - 42 * 86400000 },
  { energy: 'Led a cross-functional workshop that actually resulted in clear next steps. People said it was the most productive meeting we had all quarter.', challenge: 'Still struggling to say no to low-impact requests from stakeholders who don\'t understand design priorities.', mood: 'Energized', timestamp: Date.now() - 35 * 86400000 },
  { energy: 'Mentored a junior designer through their first end-to-end project. Seeing them grow has been the highlight of my week.', challenge: 'Feeling invisible in leadership meetings. I have ideas but hesitate to share them in a room of senior stakeholders.', mood: 'Steady', timestamp: Date.now() - 28 * 86400000 },
  { energy: 'Got recognised in the company all-hands for the design system migration. That visibility felt good — and overdue.', challenge: 'Imposter syndrome creeping back after the all-hands shoutout. Worried I\'ll be expected to perform at a level I\'m not ready for.', mood: 'Hopeful', timestamp: Date.now() - 21 * 86400000 },
  { energy: 'Started writing a design retrospective to share with the broader team. First time I\'ve documented my process for others.', challenge: 'The promotion packet deadline is approaching and I don\'t feel like I have enough "impact stories" to fill it.', mood: 'Uneasy', timestamp: Date.now() - 14 * 86400000 },
  { energy: 'Had a 1:1 with my skip-level who gave me specific, actionable feedback on how I present my work. First time I felt seen by leadership.', challenge: 'Realised I\'ve been spending 70% of my time on execution and only 30% on the strategic thinking that would actually get me promoted.', mood: 'Hopeful', timestamp: Date.now() - 7 * 86400000 },
  { energy: 'Shipped a small but visible improvement to the design system that unblocked three other teams. Felt good to have ripple effects.', challenge: 'Need to decide whether to push for promotion here or start interviewing elsewhere to reset my level.', mood: 'Steady', timestamp: Date.now() - 1 * 86400000 },
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

export function CareerProvider({ children }) {
  const persisted = useMemo(() => loadState(), [])

  const [profile, setProfile] = useState(persisted?.profile ?? initialProfile)
  const [analysis, setAnalysis] = useState(persisted?.analysis ?? emptyAnalysis)
  const [checkIn, setCheckIn] = useState(persisted?.checkIn ?? { energy: '', challenge: '', mood: '' })
  const [checkIns, setCheckIns] = useState(persisted?.checkIns ?? [])
  const [toast, setToast] = useState(null)
  const [hasRealAnalysis, setHasRealAnalysis] = useState(persisted?.hasRealAnalysis ?? false)
  const [experimentTracking, setExperimentTracking] = useState(persisted?.experimentTracking ?? emptyExperimentTracking)
  const [onboardingChoice, setOnboardingChoice] = useState(persisted?.onboardingChoice ?? initialOnboardingChoice)
  const [lastUpdated, setLastUpdated] = useState(persisted?.lastUpdated ?? Date.now())
  const [syncId, setSyncId] = useState(persisted?.syncId ?? '')
  const [cloudStatus, setCloudStatus] = useState(persisted?.cloudStatus ?? 'idle')
  const toastTimer = useRef(null)

  // Persist every meaningful state change
  useEffect(() => {
    saveState({ profile, analysis, checkIn, checkIns, hasRealAnalysis, experimentTracking, onboardingChoice, lastUpdated, syncId, cloudStatus })
  }, [profile, analysis, checkIn, checkIns, hasRealAnalysis, experimentTracking, onboardingChoice, lastUpdated, syncId, cloudStatus])

  useEffect(() => {
    setLastUpdated(Date.now())
  }, [profile, analysis, checkIn, checkIns, hasRealAnalysis, experimentTracking, onboardingChoice, syncId, cloudStatus])

  useEffect(() => {
    if (!syncId) {
      const bootstrapSyncId = async () => {
        try {
          const data = await createCloudSyncId()
          if (data?.syncId) {
            setSyncId(data.syncId)
          } else {
            const generatedId = typeof window !== 'undefined' && window.crypto?.randomUUID
              ? window.crypto.randomUUID()
              : `mirror-${Date.now().toString(36)}`
            setSyncId(generatedId)
          }
        } catch {
          const generatedId = typeof window !== 'undefined' && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `mirror-${Date.now().toString(36)}`
          setSyncId(generatedId)
        }
      }

      void bootstrapSyncId()
    }
  }, [syncId])

  useEffect(() => {
    if (!analysis.nextExperiment) return
    setExperimentTracking((prev) => {
      if (prev.experiment === analysis.nextExperiment && prev.startedAt) {
        return prev
      }
      return {
        ...prev,
        experiment: analysis.nextExperiment,
        startedAt: prev.startedAt || Date.now(),
        completed: false,
        completedAt: null,
        blockedBy: '',
      }
    })
  }, [analysis.nextExperiment])

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const clearToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

  const syncToCloud = useCallback(async () => {
    if (!syncId) {
      return
    }

    setCloudStatus('syncing')
    try {
      await saveCloudSnapshot({ profile, analysis, checkIn, checkIns, hasRealAnalysis, experimentTracking }, syncId)
      setCloudStatus('synced')
      showToast('Saved to cloud backup', 'success')
    } catch {
      setCloudStatus('offline')
      showToast('Cloud sync is currently unavailable', 'warning')
    }
  }, [analysis, checkIn, checkIns, experimentTracking, hasRealAnalysis, profile, showToast, syncId])

  const loadFromCloud = useCallback(async () => {
    if (!syncId) {
      return
    }

    setCloudStatus('syncing')
    try {
      const payload = await loadCloudSnapshot(syncId)
      if (payload?.payload) {
        const cloudState = payload.payload
        setProfile(cloudState.profile ?? initialProfile)
        setAnalysis(cloudState.analysis ?? emptyAnalysis)
        setCheckIn(cloudState.checkIn ?? { energy: '', challenge: '', mood: '' })
        setCheckIns(cloudState.checkIns ?? [])
        setHasRealAnalysis(Boolean(cloudState.hasRealAnalysis))
        setExperimentTracking(cloudState.experimentTracking ?? emptyExperimentTracking)
        setCloudStatus('synced')
        showToast('Restored from cloud backup', 'success')
      } else {
        setCloudStatus('offline')
        showToast('No cloud backup found yet', 'info')
      }
    } catch {
      setCloudStatus('offline')
      showToast('Could not restore from cloud backup', 'warning')
    }
  }, [showToast, syncId])

  const saveCheckIn = useCallback((entry) => {
    setCheckIns((prev) => [...prev, { ...entry, timestamp: Date.now() }])
  }, [])

  const resetEverything = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfile(initialProfile)
    setAnalysis(emptyAnalysis)
    setCheckIn({ energy: '', challenge: '', mood: '' })
    setCheckIns([])
    setHasRealAnalysis(false)
    setExperimentTracking(emptyExperimentTracking)
    setLastUpdated(Date.now())
    setCloudStatus('idle')
  }, [])

  const loadDemoData = useCallback((demoAnalysis) => {
    setProfile(demoProfile)
    setCheckIns(demoCheckIns)
    setCheckIn({ energy: '', challenge: '', mood: '' })
    setAnalysis(demoAnalysis)
    setHasRealAnalysis(false)
    setExperimentTracking(emptyExperimentTracking)
    setLastUpdated(Date.now())
    showToast('Demo loaded! Explore the full experience.', 'success')
  }, [showToast])

  const trackExperiment = useCallback((completed, blockedBy = '') => {
    setExperimentTracking((prev) => ({
      ...prev,
      completed,
      completedAt: completed ? Date.now() : null,
      blockedBy,
    }))
    if (completed) {
      // Boost score — the user completed their experiment
      setAnalysis((prev) => ({
        ...prev,
        careerScore: Math.min(prev.careerScore + 2, 100),
        strengths: [...prev.strengths, 'Completed a 7-day growth experiment'],
      }))
      showToast('🎉 Experiment completed! Career score +2', 'success')
    } else {
      showToast('Noted. Reflection is still progress.', 'info')
    }
  }, [showToast])

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      analysis,
      setAnalysis,
      checkIn,
      setCheckIn,
      checkIns,
      saveCheckIn,
      toast,
      clearToast,
      showToast,
      hasRealAnalysis,
      setHasRealAnalysis,
      resetEverything,
      loadDemoData,
      experimentTracking,
      trackExperiment,
      onboardingChoice,
      setOnboardingChoice,
      lastUpdated,
      syncId,
      cloudStatus,
      syncToCloud,
      loadFromCloud,
    }),
    [profile, analysis, checkIn, checkIns, toast, clearToast, showToast, hasRealAnalysis, resetEverything, loadDemoData, experimentTracking, trackExperiment, onboardingChoice, lastUpdated, syncId, cloudStatus, syncToCloud, loadFromCloud]
  )

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
}

export function useCareer() {
  const context = useContext(CareerContext)
  if (!context) throw new Error('useCareer must be used within CareerProvider')
  return context
}
