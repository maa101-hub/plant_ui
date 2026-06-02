/**
 * PlantVision AI — API client
 * All calls go to the FastAPI backend at localhost:8000
 */

const BASE = 'http://localhost:8000'

export async function fetchHealth() {
  const r = await fetch(`${BASE}/health`)
  return r.json()
}

export async function fetchStats() {
  const r = await fetch(`${BASE}/stats`)
  return r.json()
}

export async function predictImage(file, model = 'custom_cnn') {
  const form = new FormData()
  form.append('file', file)
  const r = await fetch(`${BASE}/predict?model=${model}`, {
    method: 'POST',
    body: form,
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.detail || `Server error ${r.status}`)
  }
  return r.json()
}

export async function predictCompare(file) {
  const form = new FormData()
  form.append('file', file)
  const r = await fetch(`${BASE}/predict/compare`, {
    method: 'POST',
    body: form,
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.detail || `Server error ${r.status}`)
  }
  return r.json()
}
