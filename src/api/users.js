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
		await authFetcher(`${API_BASE}/api/users`, {
			method: "PUT",
			body: formData
		})

        return { ok: true, message: null }
	} catch (error) {
		console.error("FAILED UPDATE REQUEST:", error)
		return { ok: false, message: error.message }
	}
}

export async function useAccountDeactivation(id) {
	try {
		const data = await authFetcher(`${API_BASE}/api/users/${id}/deactivate`, {
			method: "PUT"
		})

		return {
			ok: true,
			message: data?.message || "Your account deletion request has been received. Check your email if you need to cancel it."
		}
	} catch (error) {
		console.error("FAILED ACCOUNT DEACTIVATION REQUEST:", error)
		return { ok: false, message: error.message || "Unable to request account deletion right now." }
	}
}

export async function useCancelDeactivation(token) {
	try {
		const response = await fetch(`${API_BASE}/api/deactivation/cancel`, {
			method: "PUT",
			body: JSON.stringify({ token }),
		})
		const data = await response.json().catch(() => null)

		if (!response.ok) {
			return {
				ok: false,
				message: data?.error || data?.message || "We could not cancel your scheduled account deletion."
			}
		}

		return {
			ok: true,
			message: data?.message || "Your account deletion request has been canceled."
		}
	} catch (error) {
		console.error("FAILED ACCOUNT DEACTIVATION CANCELLATION:", error)
		return { ok: false, message: "Unable to cancel your scheduled account deletion right now." }
	}
}
