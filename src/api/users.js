import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

// Get user's info for profile page
export function useGetUserProfile(id) {
        const { data, error, isLoading, mutate } = useSWR(`${API_BASE}/api/users/${id}`, authFetcher)
        return { data, error, isLoading, mutate }
}

// Upload avatar image
export async function updateSetUserAvatar(file) {
	try {
		const formData = new FormData()
		formData.append("image", file)
		const data = await authFetcher(`${API_BASE}/api/users`, {
			method: "PUT",
			body: formData
		})

        return { ok: true, message: null }
	} catch (error) {
		console.error("FAILED UPDATE REQUEST:", error)
		return { ok: false, message: error.message }
	}
}
