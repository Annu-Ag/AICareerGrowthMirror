export function isProfileReadyForAnalysis(profile) {
  if (!profile || typeof profile !== 'object') return false

  const requiredFields = [
    'name',
    'currentRole',
    'yearsOfExperience',
    'currentSkills',
    'targetRole',
    'biggestCareerChallenge',
  ]

  return requiredFields.every((field) => {
    const value = profile[field]
    return typeof value === 'string' && value.trim().length > 0
  })
}

export function getMissingProfileFields(profile) {
  if (!profile || typeof profile !== 'object') return []

  const labels = {
    name: 'Name',
    currentRole: 'Current role',
    yearsOfExperience: 'Years of experience',
    currentSkills: 'Current skills',
    targetRole: 'Target role',
    biggestCareerChallenge: 'Biggest career challenge',
  }

  return Object.entries(labels)
    .filter(([field]) => {
      const value = profile[field]
      return typeof value !== 'string' || value.trim().length === 0
    })
    .map(([, label]) => label)
}
