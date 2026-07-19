/**
 * Generates a mock career analysis based on the profile data.
 * Used as fallback when the live AI service is unavailable.
 * Expanded pools and improved relevance matching to avoid
 * the "same output for everyone" problem.
 */

const strengthPool = [
  // Leadership & influence
  'Leading cross-functional initiatives without formal authority',
  'Making complex decisions under ambiguity',
  'Translating stakeholder needs into actionable requirements',
  'Facilitating productive disagreements toward better outcomes',
  'Building trust and psychological safety on teams',
  // Strategy & execution
  'Breaking ambiguous problems into structured workstreams',
  'Connecting daily execution to long-term strategic goals',
  'Prioritising ruthlessly across competing demands',
  'Driving measurable outcomes through iterative delivery',
  'Identifying leverage points that others overlook',
  // Communication & narrative
  'Distilling complex ideas into clear, persuasive narratives',
  'Writing executive summaries that drive decisions',
  'Adapting communication style across technical and non-technical audiences',
  'Articulating trade-offs without oversimplifying',
  'Coaching peers through thoughtful questions',
  // Craft & depth
  'Building deep expertise in a specific domain over time',
  'Designing systems that anticipate future edge cases',
  'Diagnosing root causes behind surface-level symptoms',
  'Applying first-principles thinking to unfamiliar problems',
  'Prototyping and testing hypotheses faster than others',
  // Culture & growth
  'Creating processes that scale team effectiveness',
  'Establishing knowledge-sharing norms in growing teams',
  'Mentoring junior colleagues toward independence',
  'Championing quality standards without gatekeeping',
  'Leaning into uncomfortable feedback as a growth lever',
]

const gapPool = [
  // Visibility & presence
  'Articulating your impact in terms that decision-makers value',
  'Building a recognisable point of view in your domain',
  'Negotiating scope, role, and compensation proactively',
  'Speaking up in rooms where you are not the most senior',
  'Making your work visible without self-promotion discomfort',
  // Strategic breadth
  'Connecting your team’s work to company revenue and OKRs',
  'Understanding how the business makes money end-to-end',
  'Evaluating whether a problem is worth solving before solving it',
  'Managing up and across with the same care as managing down',
  'Thinking in systems instead of tickets',
  // People & leadership
  'Giving feedback that lands — specific, timely, non-personal',
  'Running effective one-on-ones that build trust and accountability',
  'Holding team members accountable without damaging relationships',
  'Delegating outcomes instead of tasks',
  'Building a reputation that attracts opportunities without applying',
  // Craft depth
  'Writing clear architecture decisions that outlast your tenure',
  'Developing T-shaped depth beyond your core specialisation',
  'Structuring data to support decision-making under uncertainty',
  'Applying product thinking outside your function',
  'Automating judgement calls with well-designed heuristics',
]

const blockerPool = [
  'Waiting for perfect clarity before sharing an incomplete thought — fast feedback beats polished silence',
  'Under-communicating your wins because you assume good work speaks for itself — it does not',
  'Hesitating to ask for what you want because you fear rejection — clarity accelerates outcomes',
  'Over-preparing and under-publishing — your 80 % draft has more impact than your 100 % idea that never ships',
  'Comparing your inside to everyone else’s outside — you see your struggle, you see their highlight reel',
  'Staying in your lane when stretching would build credibility faster than depth alone',
  'Saying yes to low-visibility work because it feels safe — high-visibility work feels risky but compounds',
  'Seeking permission when the cost of forgiveness is lower than the cost of waiting',
  'Using perfectionism as a shield against judgement — imperfect done beats perfect draft',
  'Hoping others will notice your potential without making it observable',
]

const experimentPool = [
  // Stakeholder experiments
  'Send a concise strategic observation to a senior stakeholder — three sentences max, one recommendation.',
  'Book a 15-min chat with someone one level above your target role and ask: "What did you unlearn to get there?"',
  'Write a one-paragraph update on your current project’s most interesting trade-off and send it to your skip-level.',
  'Identify one stakeholder whose priorities you do not fully understand, and ask them to explain their top goal this quarter.',
  // Visibility experiments
  'Draft a brag document of your top three achievements this quarter — one sentence each, with a measurable result.',
  'Post a 2-paragraph reflection on a recent project outcome — what you expected, what surprised you, what you learned.',
  'Comment thoughtfully on three posts from people in your target role space — not to promote, to contribute.',
  'Write a "state of the project" summary and share it with your team before anyone asks for it.',
  // Growth experiments
  'Say no to one low-leverage request and briefly explain your reasoning — practice protecting your focus.',
  'Ask a trusted peer: "What is one thing I do that holds me back in meetings?" — then sit with the answer for a day.',
  'Spend 30 minutes reading the annual report or 10-K of your dream company — note three strategic priorities they mention.',
  'Identify the #1 skill in your target role job descriptions that you lack, and find one concrete resource to start learning it.',
  // Network experiments
  'Write a LinkedIn recommendation for a peer without being asked — generosity compounds.',
  'Ask a former manager for specific feedback on one area you want to grow: "What would make me more effective at X?"',
  'Join one professional community in your target space and introduce yourself with a specific question.',
  'Offer to give a 10-min lightning talk on something you know well at your next team meeting.',
]

// Role archetype clusters for better strength-gap matching
const ROLE_CLUSTERS = {
  engineer: ['engineer', 'developer', 'software', 'backend', 'frontend', 'fullstack', 'data engineer', 'devops', 'sre', 'architect', 'tech lead'],
  design: ['designer', 'design', 'ux', 'ui', 'product design', 'visual', 'interaction', 'brand', 'creative'],
  product: ['product manager', 'product', 'pm', 'program manager', 'technical pm', 'product owner'],
  data: ['data scientist', 'data analyst', 'data engineer', 'analytics', 'ml', 'machine learning', 'ai', 'research scientist'],
  marketing: ['marketing', 'growth', 'brand', 'content', 'seo', 'demand gen', 'marketing ops', 'product marketing'],
  engineering_manager: ['engineering manager', 'em', 'tech lead manager', 'director of engineering', 'vp engineering'],
  leadership: ['director', 'vp', 'head of', 'chief', 'cto', 'coo', 'ceo', 'founder'],
}

function classifyRole(role) {
  if (!role || !role.trim()) return []
  const lower = role.toLowerCase()
  const matched = []
  for (const [cluster, patterns] of Object.entries(ROLE_CLUSTERS)) {
    if (patterns.some((p) => lower.includes(p))) {
      matched.push(cluster)
    }
  }
  return matched.length > 0 ? matched : ['general']
}

/**
 * Derive a seed from the profile string so the same profile
 * produces stable results across renders (deterministic shuffle).
 */
function seededShuffle(arr, seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs((hash + i * 31) % (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateScore(profile) {
  const filled = Object.values(profile).filter((v) => typeof v === 'string' && v.trim().length > 0).length
  const total = Object.keys(profile).length
  const base = 45
  const bonus = Math.round((filled / total) * 35)
  let hash = 0
  const seed = Object.values(profile).filter(Boolean).join('|') || 'default-seed'
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  const drift = Math.abs(hash % 9)
  return Math.min(base + bonus + drift, 98)
}

function buildReasoning(profile, score, strengths, gaps, blockers, experiment, isApiFallback) {
  const parts = []

  if (isApiFallback) {
    parts.push('[Note: Generated locally because the AI API was unavailable. Set OPENAI_API_KEY for personalised analysis.]')
  }

  if (profile.currentRole) {
    const clusters = classifyRole(profile.currentRole)
    parts.push(`Role "${profile.currentRole}" classified as ${clusters.join(', ')}, which anchors strengths and gap selection.`)
  }
  if (profile.targetRole) {
    parts.push(`Target role "${profile.targetRole}" drove gap selection — comparing current vs. target responsibilities.`)
  } else {
    parts.push('No target role provided — gaps are inferred from current trajectory and experience level.')
  }
  if (profile.biggestCareerChallenge) {
    parts.push(`biggestCareerChallenge ("${profile.biggestCareerChallenge}") shaped blockers and the 7-day experiment.`)
  } else {
    parts.push('No career challenge provided — blockers based on common patterns for this role archetype.')
  }
  if (profile.currentSkills) {
    parts.push(`Strengths prioritised skills explicitly listed: ${profile.currentSkills}.`)
  }
  if (profile.dreamCompany) {
    parts.push(`Dream company "${profile.dreamCompany}" influenced experiment specificity.`)
  }
  if (profile.yearsOfExperience) {
    parts.push(`Experience level (${profile.yearsOfExperience} years) calibrated expectations for each output field.`)
  }

  parts.push(`Score ${score}/${score >= 80 ? 'strong — focus on leverage and visibility' : score >= 60 ? 'good — the next lift is making strategic value visible' : 'building — every small improvement compounds'}.`)
  parts.push(`Strengths prioritise ${strengths.slice(0, 2).join(' and ').toLowerCase()}.`)
  parts.push(`Gaps focus on ${gaps.slice(0, 2).join(' and ').toLowerCase()}.`)

  return parts.join(' ')
}

export function generateMockAnalysis(profile, isApiFallback = false) {
  const careerScore = generateScore(profile)
  const profileSeed = Object.values(profile).filter(Boolean).join('|')
  const seedKey = profileSeed || 'default-seed'

  // Classify the user's role for targeted pools
  const roleClusters = classifyRole(profile.currentRole)

  const allStrengths = seededShuffle(strengthPool, seedKey + 'strength')
  const allGaps = seededShuffle(gapPool, seedKey + 'gap')
  const allBlockers = seededShuffle(blockerPool, seedKey + 'blocker')
  const allExperiments = seededShuffle(experimentPool, seedKey + 'exp')

  // Scoring function: rank items by relevance to profile
  function scoreRelevance(item, profile) {
    const haystack = Object.values(profile).filter(Boolean).join(' ').toLowerCase()
    const itemWords = item.toLowerCase().split(' ')
    // Direct substring match
    let score = itemWords.filter((w) => w.length > 3 && haystack.includes(w)).length
    // Bonus for role cluster alignment
    for (const cluster of roleClusters) {
      if (item.toLowerCase().includes(cluster) || cluster.split('_').some((c) => item.toLowerCase().includes(c))) {
        score += 2
      }
    }
    // Bonus for challenge alignment
    if (profile.biggestCareerChallenge) {
      const challenge = profile.biggestCareerChallenge.toLowerCase()
      const challengeWords = challenge.split(/\s+/)
      const matchCount = itemWords.filter((w) => w.length > 3 && challengeWords.includes(w)).length
      score += matchCount
    }
    return score
  }

  // Sort by relevance, pick top 3 strengths
  const sortedStrengths = [...allStrengths].sort((a, b) => scoreRelevance(b, profile) - scoreRelevance(a, profile))
  const strengths = sortedStrengths.slice(0, 3)

  // Pick top 2-3 gaps by relevance
  const sortedGaps = [...allGaps].sort((a, b) => scoreRelevance(b, profile) - scoreRelevance(a, profile))
  const skillGaps = sortedGaps.slice(0, 3)

  // Pick blockers by relevance (prioritise challenge match)
  const sortedBlockers = [...allBlockers].sort((a, b) => scoreRelevance(b, profile) - scoreRelevance(a, profile))
  const hiddenBlockers = sortedBlockers.slice(0, 3)

  // Pick experiment by relevance
  const sortedExperiments = [...allExperiments].sort((a, b) => scoreRelevance(b, profile) - scoreRelevance(a, profile))
  const nextExperiment = sortedExperiments[0]

  const reasoning = buildReasoning(profile, careerScore, strengths, skillGaps, hiddenBlockers, nextExperiment, isApiFallback)

  return { careerScore, strengths, skillGaps, hiddenBlockers, nextExperiment, reasoning }
}
