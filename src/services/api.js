const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const { method = 'GET', body, headers, timeoutMs = 60000 } = options
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(headers || {}),
      },
      body,
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    const text = await response.text()

    if (!response.ok) {
      let errorMessage = text || `Request failed with ${response.status}`
      try {
        const parsed = JSON.parse(text)
        errorMessage = parsed.error || parsed.message || errorMessage
      } catch {
        // keep the plain text response as-is
      }
      throw new Error(errorMessage)
    }

    if (!text) {
      return null
    }

    if (contentType.includes('application/json')) {
      return JSON.parse(text)
    }

    return text
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The request timed out. Please try again.')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1] || reader.result
        resolve(base64)
      } else {
        reject(new Error('Could not read file contents.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file contents.'))
    reader.readAsDataURL(file)
  })
}

export async function checkHealth() {
  const data = await request('/health')
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return data
}

export async function parseResume(file) {
  const contentBase64 = await fileToBase64(file)
  return request('/parse-resume', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      contentBase64,
      mimeType: file.type || 'application/octet-stream',
    }),
  })
}

export async function analyzeCareer(payload) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function saveCloudSnapshot(payload, syncId) {
  return request('/sync/save', {
    method: 'POST',
    body: JSON.stringify({ syncId, payload }),
  })
}

export async function loadCloudSnapshot(syncId) {
  return request(`/sync/load?syncId=${encodeURIComponent(syncId)}`)
}

export async function createCloudSyncId() {
  return request('/sync/register', {
    method: 'POST',
  })
}
