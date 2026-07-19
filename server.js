import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import OpenAI from 'openai'
import * as pdfParseModule from 'pdf-parse'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '.env') })

const app = express()
const port = process.env.PORT || 3001
const MAX_RESUME_CHARS = 8000
const cloudSnapshots = new Map()

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
]

const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : DEFAULT_ORIGINS

const analysisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    careerScore: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      description: 'Overall career-health score (0–100) based on profile signals',
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
      description: '2–3 specific professional strengths evident from the profile data',
    },
    skillGaps: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
      description: '2–3 critical skill gaps between the user’s current and target role',
    },
    hiddenBlockers: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
      description: '2–3 behavioural or mindset patterns that may be holding the user back',
    },
    nextExperiment: {
      type: 'string',
      description: 'A single concrete action the user can complete within 7 days, addressable in under 2 hours total',
    },
    reasoning: {
      type: 'string',
      description: 'A concise explanation of how each profile field influenced the conclusions (chain-of-thought summary)',
    },
  },
  required: [
    'careerScore',
    'strengths',
    'skillGaps',
    'hiddenBlockers',
    'nextExperiment',
    'reasoning',
  ],
}

const analysisInstructions = `You are Career Growth Mirror, a thoughtful career-growth coach. Your job is to analyse the user's career profile and produce structured, personalised insights that feel specific to them — not generic advice.

---

## INPUT STRUCTURE

You receive a JSON object with:
- **profile** — career fields (name, currentRole, yearsOfExperience, currentSkills, targetRole, dreamCompany, biggestCareerChallenge)
- **resumeText** (optional) — extracted resume content. Use ONLY facts explicitly stated here. Do not infer employers, dates, or credentials not in resumeText or profile.
- **checkInHistory** (optional) — array of recent weekly reflections { energy, challenge, mood, timestamp }. Use the last entries to refine hiddenBlockers and nextExperiment. Reference patterns across entries, not a single entry in isolation.

---

## HOW TO PERSONALISE

Use every field in profile to tailor your output:

- **currentRole × targetRole** — Compare these to find the *delta*. Strengths should align with what the current role demands. Gaps should reflect capabilities the target role needs that the user hasn't demonstrated yet.
- **yearsOfExperience** — Calibrate tone and expectations. Fewer years → focus on foundational growth, learning velocity. More years → focus on leverage, visibility, delegation, strategic influence.
- **currentSkills** — Extract specific strengths from the skills the user actually listed. Never invent a skill. Connect each strength to a concrete work context.
- **biggestCareerChallenge** — This is your strongest personalisation signal. Every output field should be influenced by this answer. The nextExperiment *must* directly address this challenge.
- **dreamCompany** — If provided, factor in the expectations, culture, and bar of that company archetype when identifying skill gaps and experiments.
- **resumeText** — When present, cross-reference skills and experience with profile fields. Prefer resume facts for strengths when they add specificity.
- **checkInHistory** — When present, let recent moods and challenges inform hiddenBlockers. If check-ins show repeated visibility struggles, reflect that in blockers and experiment.

---

## FIELD GENERATION GUIDELINES

### careerScore (0–100)

Score using this rubric:
- **Profile substance** (40 %): How many fields contain detailed, meaningful content (not single words or placeholders).
- **Role coherence** (30 %): How logically connected currentRole + currentSkills + targetRole are.
- **Self-awareness** (30 %): The quality and specificity of biggestCareerChallenge. Vague or empty → low score.

Rules:
- Do **not** assign scores above 85 unless the profile is rich and shows clear strategic direction.
- A sparse profile (only name or one field) should score around 20–35.
- An average profile (all fields filled briefly) should score 45–65.

### strengths
- Extract from currentSkills first. Then infer from currentRole and resumeText when present.
- Format: "{[skill/behaviour]} in {context}" — e.g. "Data-informed prioritisation in product roadmaps".
- Output exactly 2 or 3 items. Never empty.

### skillGaps
- Derive from the gap between currentSkills and what the targetRole typically requires.
- If targetRole is missing, infer from currentRole + yearsOfExperience + dreamCompany.
- Prefer learnable, actionable gaps over personality traits.
- Output exactly 2 or 3 items.

### hiddenBlockers
- Infer from biggestCareerChallenge, checkInHistory patterns, and any inconsistencies across fields.
- Focus on behavioural patterns, not technical lacks — technical gaps belong in skillGaps.
- Frame as hypotheses: "May tend to…" or "Could be…" — never as definitive diagnoses.
- Output exactly 2 or 3 items.

### nextExperiment
- A single action the user can start *today* and finish within 7 days, spending under 2 hours total.
- Must tie directly to either biggestCareerChallenge, the #1 skillGap, or a pattern from checkInHistory.
- Be specific: name whom to talk to, what to write, what tool to use.
- Bad: "Improve networking." Good: "Send a 3-sentence LinkedIn message to one senior IC in your target role asking for a 15-min chat about their path."

### reasoning
- Summarise how profile fields, resumeText (if any), and checkInHistory (if any) influenced your conclusions.
- If the profile is sparse, state confidence is low and explain what data was missing.
- Reference actual field names and values.
- Keep it to 3–5 sentences. No markdown.

---

## ANTI-HALLUCINATION RULES (STRICT)

- Never invent skills, roles, experiences, or credentials not present in profile or resumeText.
- Never diagnose medical conditions, mental health disorders, or personality disorders.
- Never promise or guarantee career outcomes (promotions, offers, salary increases).
- Do not use the user's name in analysis content — only in meta context.
- If the profile is too sparse for meaningful insight, **say so in reasoning** and give a low score.
- When uncertain, choose a lower confidence claim over a speculative one.

---

## OUTPUT FORMAT

Return **only** valid JSON that matches the supplied schema exactly. No markdown fences, no extra commentary, no keys outside the schema. The response will be parsed programmatically.`

app.use(express.json({ limit: '15mb' }))

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  return next()
})

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'Career Growth Mirror API' })
})

app.get('/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json({ ok: true, hasApiKey: !!process.env.OPENAI_API_KEY, ts: Date.now() })
})

app.post('/sync/register', (_req, res) => {
  const syncId = `mirror-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  res.json({ syncId })
})

app.post('/sync/save', (req, res) => {
  const { syncId, payload } = req.body || {}
  if (!syncId || typeof syncId !== 'string') {
    return res.status(400).json({ error: 'syncId is required.' })
  }

  cloudSnapshots.set(syncId, payload)
  return res.json({ ok: true, syncId })
})

app.get('/sync/load', (req, res) => {
  const { syncId } = req.query
  if (!syncId || typeof syncId !== 'string') {
    return res.status(400).json({ error: 'syncId is required.' })
  }

  const payload = cloudSnapshots.get(syncId)
  if (!payload) {
    return res.status(404).json({ error: 'No backup found for this sync id.' })
  }

  return res.json({ syncId, payload })
})

function truncateText(text, max = MAX_RESUME_CHARS) {
  if (!text || typeof text !== 'string') return ''
  const cleaned = text.replace(/\s+/g, ' ').trim()
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned
}

async function extractPdfText(buffer) {
  const candidates = []

  try {
    const pdfParse = pdfParseModule.PDFParse || pdfParseModule.default
    const parsed = await pdfParse(buffer)
    if (typeof parsed?.text === 'string' && parsed.text.trim()) {
      candidates.push(parsed.text)
    }
  } catch (error) {
    console.warn('[parse-resume] pdf-parse failed:', error.message)
  }

  try {
    if (pdfjsLib?.getDocument) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs')
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
      const pdf = await loadingTask.promise
      const pageTexts = []

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber)
        const content = await page.getTextContent()
        const pageText = content.items
          ?.map((item) => item.str)
          .filter(Boolean)
          .join(' ')
          .trim()

        if (pageText) {
          pageTexts.push(pageText)
        }
      }

      const fallbackText = pageTexts.join('\n').replace(/\s+/g, ' ').trim()
      if (fallbackText) {
        return fallbackText
      }
    }
  } catch (error) {
    console.warn('[parse-resume] pdfjs fallback failed:', error.message)
  }

  if (candidates.length > 0) {
    return candidates[0]
  }

  return ''
}

app.post('/parse-resume', async (req, res) => {
  const { fileName, contentBase64, mimeType } = req.body || {}

  if (!contentBase64 || typeof contentBase64 !== 'string') {
    return res.status(400).json({ error: 'contentBase64 is required.' })
  }

  const lowerName = (fileName || '').toLowerCase()
  const isPdf = mimeType === 'application/pdf' || lowerName.endsWith('.pdf')
  const isTxt = mimeType === 'text/plain' || mimeType === 'application/plain' || mimeType.startsWith('text/') || lowerName.endsWith('.txt')
  const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || lowerName.endsWith('.docx')

  if (!isPdf && !isTxt && !isDocx) {
    return res.status(422).json({
      error: 'PDF, TXT, or DOCX resumes are supported for AI analysis.',
    })
  }

  try {
    const buffer = Buffer.from(contentBase64, 'base64')

    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Resume must be under 10MB.' })
    }

    let text = ''

    if (isTxt) {
      text = buffer.toString('utf8')
    } else if (isDocx) {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value || ''
    } else {
      text = await extractPdfText(buffer)
    }

    const resumeText = truncateText(text)

    if (!resumeText) {
      return res.json({
        resumeText: '',
        charCount: 0,
        extracted: false,
        message: 'No text could be extracted from this file. You can still continue and add details manually.',
      })
    }

    return res.json({ resumeText, charCount: resumeText.length, extracted: true })
  } catch (error) {
  console.error("======== PARSE ERROR ========");
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    error: error.message
  });
}
})

function normalizeAnalyzePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null
  }

  // Legacy: flat profile object
  if (body.currentRole || body.name || body.targetRole) {
    return {
      profile: body,
      resumeText: body.resumeText || '',
      checkInHistory: [],
    }
  }

  const { profile, resumeText, checkInHistory } = body

  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return null
  }

  const history = Array.isArray(checkInHistory)
    ? checkInHistory.slice(-5).map(({ energy, challenge, mood, timestamp }) => ({
        energy: energy || '',
        challenge: challenge || '',
        mood: mood || '',
        timestamp: timestamp || null,
      }))
    : []

  return {
    profile,
    resumeText: truncateText(resumeText || profile.resumeText || ''),
    checkInHistory: history,
  }
}

app.post('/analyze', async (req, res) => {
  const payload = normalizeAnalyzePayload(req.body)

  if (!payload) {
    return res.status(400).json({ error: 'Send { profile, resumeText?, checkInHistory? } as JSON.' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' })
  }

  const { profile, resumeText, checkInHistory } = payload

  const userMessage = {
    profile: {
      name: profile.name || '',
      currentRole: profile.currentRole || '',
      yearsOfExperience: profile.yearsOfExperience || '',
      currentSkills: profile.currentSkills || '',
      targetRole: profile.targetRole || '',
      dreamCompany: profile.dreamCompany || '',
      biggestCareerChallenge: profile.biggestCareerChallenge || '',
    },
    ...(resumeText ? { resumeText } : {}),
    ...(checkInHistory.length > 0 ? { checkInHistory } : {}),
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: analysisInstructions },
        { role: 'user', content: JSON.stringify(userMessage) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'career_analysis',
          strict: true,
          schema: analysisSchema,
        },
      },
    })

    const raw = response.choices[0]?.message?.content
    if (!raw) {
      throw new Error('OpenAI returned an empty response.')
    }

    return res.json(JSON.parse(raw))
  } catch (error) {
    const message = error.message || 'Unknown API error'
    console.error('[analyze]', message, error.status ? `(status ${error.status})` : '')
    return res.status(500).json({
      error: `Unable to generate career analysis: ${message}`,
    })
  }
})

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' })
  }

  console.error(error)
  return res.status(500).json({ error: 'Unable to process request.' })
})

const server = app.listen(port, () => {
  console.log(`Career Growth Mirror API listening on http://localhost:${port}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing server process or restart this app.`)
    process.exit(1)
  }

  throw error
})
