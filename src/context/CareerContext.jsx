import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const CareerContext = createContext(null)

const initialProfile = {
  name: '',
  currentRole: '',
  yearsOfExperience: '',
  currentSkills: '',
  targetRole: '',
  dreamCompany: '',
  biggestCareerChallenge: '',
}

const placeholderAnalysis = {
  careerScore: 72,
  strengths: ['Customer-centered strategy', 'Cross-functional influence', 'Clear product storytelling'],
  skillGaps: ['Business fluency', 'Executive presence'],
  hiddenBlockers: ['Waiting for certainty before sharing your point of view'],
  nextExperiment: 'Share one concise strategic insight with a stakeholder this week.',
}

export function CareerProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile)
  const [analysis, setAnalysis] = useState(placeholderAnalysis)
  const [checkIn, setCheckIn] = useState({ energy: '', challenge: '', mood: '' })
  const [checkIns, setCheckIns] = useState([])
  const [toast, setToast] = useState(null)
  const [history, setHistory] = useState({ profile: [], checkIns: [] })

  const clearToast = useCallback(() => setToast(null), [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const saveCheckIn = useCallback((entry) => {
    setCheckIns((prev) => [...prev, { ...entry, timestamp: Date.now() }])
  }, [])

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
      history,
      setHistory,
    }),
    [profile, analysis, checkIn, checkIns, toast, clearToast, showToast, history]
  )

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
}

export function useCareer() {
  const context = useContext(CareerContext)
  if (!context) throw new Error('useCareer must be used within CareerProvider')
  return context
}
