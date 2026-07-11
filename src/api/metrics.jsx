import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json());

export function useGetTotalUsers() {
  const { data, error, isLoading } = useSWR(`/api/users`, fetcher)
  return { totalUsers: data?.total, error, isLoading }
}

export function useGetTotalRecipes() {
  const { data, error, isLoading } = useSWR(`/api/recipes?total=true`, fetcher)
  return { totalRecipes: data?.total, error, isLoading }
}