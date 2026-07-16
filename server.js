import express from 'express'
import OpenAI from 'openai'

const app = express()
const port = process.env.PORT || 3001

const analysisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    careerScore: { type: 'integer', minimum: 0, maximum: 100 },
    strengths: { type: 'array', items: { type: 'string' } },
    skillGaps: { type: 'array', items: { type: 'string' } },
    hiddenBlockers: { type: 'array', items: { type: 'string' } },
    nextExperiment: { type: 'string' },
  },
  required: ['careerScore', 'strengths', 'skillGaps', 'hiddenBlockers', 'nextExperiment'],
}

const analysisInstructions = `You are Career Growth Mirror, a thoughtful career-growth coach.
Analyze only the career-profile data provided by the user. Be encouraging, practical, and specific.
Do not diagnose mental health conditions, make promises, or invent facts not present in the profile.
Keep each list to 3 concise items. Make nextExperiment a single, realistic action that can be completed within seven days.
Return data that exactly matches the supplied JSON schema with no markdown or extra keys.`

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  return next()
})

app.post('/analyze', async (req, res, next) => {
  const profile = req.body

  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return res.status(400).json({ error: 'Send a career profile as a JSON object.' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' })
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions: analysisInstructions,
      input: JSON.stringify(profile),
      text: {
        format: {
          type: 'json_schema',
          name: 'career_analysis',
          strict: true,
          schema: analysisSchema,
        },
      },
    })

    return res.json(JSON.parse(response.output_text))
  } catch (error) {
    return next(error)
  }
})

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' })
  }

  console.error(error)
  return res.status(500).json({ error: 'Unable to generate career analysis.' })
})

app.listen(port, () => {
  console.log(`Career Growth Mirror API listening on http://localhost:${port}`)
})
