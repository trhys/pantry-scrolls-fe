import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json());

export function useGetVerification(token) {
  const { data, error, isLoading } = useSWR(`/api/verify/${token}`, fetcher)
  return { error, isLoading }
}
