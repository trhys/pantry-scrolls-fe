import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch maintenance status')
  return res.json()
})

export function useGetMaintenanceStatus() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE}/api/config/maintenance`,
    fetcher,
    { refreshInterval: 30000, shouldRetryOnError: false }
  )
  return { data, error, isLoading, mutate }
}

export async function putMaintenanceStatus(active, message) {
  try {
    const data = await authFetcher(`${API_BASE}/api/config/maintenance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active, message })
    })
    return { ok: true, data }
  } catch (error) {
    console.error('Failed to update maintenance status:', error)
    return { ok: false, message: error.message }
  }
}
