import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

const fetcher = (url) => fetch(url).then(res => res.json());

export function useGetTotalUsers() {
  const { data, error, isLoading } = useSWR(`/api/users`, fetcher)
  return { data, error, isLoading }
}
