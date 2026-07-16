/**
 * Generates a mock career analysis based on the profile data.
 * Used as fallback when the live AI service is unavailable.
 * Produces varied, realistic-looking output so the experience feels genuine.
 */

const strengthPool = [
  'User empathy and research synthesis',
  'Cross-functional collaboration',
  'Stakeholder communication',
  'Strategic thinking',
  'Technical problem-solving',
  'Product sense and prioritisation',
  'Design systems thinking',
  'Data-informed decision-making',
  'Team mentorship and growth',
  'Executing with ambiguity',
]

const gapPool = [
  'Executive presence',
  'Business fluency',
  'Negotiation skills',
  'Public speaking',
  'People management experience',
  'Technical depth in your domain',
  'Personal brand building',
  'Networking and visibility',
]

const blockerPool = [
  'Waiting for certainty before sharing your point of view',
  'Under-communicating your impact',
  'Hesitating to ask for what you want',
  'Over-preparing and under-publishing',
  'Comparing yourself to people five years ahead',
  'Staying in your lane when you could stretch',
]

const experimentPool = [
  'Share one concise strategic insight with a stakeholder this week.',
  'Write a 2-paragraph reflection on a recent project win and post it on LinkedIn.',
  'Book a 15-minute chat with someone in a role you want next.',
  'Say "no" to one low-leverage task and explain your reasoning to your manager.',
  'Draft a brag document of your top three achievements this quarter.',
  'Ask for feedback on your communication style from a trusted peer.',
]

function pick(arr) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

function generateScore(profile) {
  // Score varies based on how complete the profile is
  const filled = Object.values(profile).filter((v) => typeof v === 'string' && v.trim().length > 0).length
  const total = Object.keys(profile).length
  const base = 55
  const bonus = Math.round((filled / total) * 30)
  return Math.min(base + bonus + Math.floor(Math.random() * 8), 98)
}

export function generateMockAnalysis(profile) {
  const careerScore = generateScore(profile)
  const strengths = pick(strengthPool)
  const skillGaps = pick(gapPool).slice(0, 2)
  const hiddenBlockers = pick(blockerPool).slice(0, 2)
  const nextExperiment = experimentPool[Math.floor(Math.random() * experimentPool.length)]

  return {
    careerScore,
    strengths,
    skillGaps,
    hiddenBlockers,
    nextExperiment,
  }
}
