import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

const fetcher = (url) => fetch(url).then(res => res.json());
const optionalAuthFetcher = async (url) => {
	try {
		return await authFetcher(url, { method: "GET" })
	} catch (error) {
		// Only fall back to unauthenticated fetch for auth/credential failures.
		const msg = String(error?.message ?? '').toLowerCase()
		if (!msg.includes('auth') && !msg.includes('credential') && !msg.includes('expired')) {
			throw error
		}
		return fetcher(url)
	}
}

// Get recipe feed
export function useGetRecipeFeed() {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/recipes`, optionalAuthFetcher)
	return { data, error, isLoading }
}

// Get explorer feed with filters
export function useExploreFeed(filters = {}) {
	const params = new URLSearchParams()
	const title = filters.title?.trim()
	const author = filters.author?.trim()
	const tag = filters.tag?.trim()

	if (title) params.set('title', title)
	if (author) params.set('author', author)
	if (tag) params.set('tag', tag)

	const query = params.toString()
	const endpoint = query
		? `${API_BASE}/api/recipes/explore?${query}`
		: `${API_BASE}/api/recipes`

	const { data, error, isLoading } = useSWR(endpoint, optionalAuthFetcher)
	return { data, error, isLoading }
}

// Get user's info for profile page
export function useGetUserProfile(id) {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/users/${id}`, authFetcher)
	return { data, error, isLoading }
}

// Get individual recipe
export function useGetRecipe(id) {
	const { data, error, isLoading } = useSWR(id ? `${API_BASE}/api/recipes/${id}` : null, optionalAuthFetcher)
	return { data, error, isLoading }
}

// Get recipe editor payload with ingredient conversions for single-fetch hydration
export function useGetRecipeEdit(id) {
	const { data, error, isLoading } = useSWR(
		id ? `${API_BASE}/api/recipes/${id}/edit` : null,
		authFetcher
	)
	return { data, error, isLoading }
}

// Get ingredients for recipe creator
export function useGetIngredients() {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/ingredients`, fetcher)
	return { data, error, isLoading }
}

// Get ingredient units for recipe creator
export function useGetUnits(id) {
	const endpoint = id
		? `${API_BASE}/api/ingredients/units?id=${encodeURIComponent(id)}`
		: null
	const { data, error, isLoading } = useSWR(endpoint, fetcher)
	return { data, error, isLoading }
}

// Create new recipe and return success status + recipe id if successful
export async function postRecipe(title, image, ingredients, description, instructions, tags = []) {
	try {
		const ingData = ingredients.map((i) => ({
			id: i.id,
			quantity: parseFloat(i.quantity) || 0,
			unit: i.units,
		}));

		const body = JSON.stringify({ title: title, ingredients: ingData, description: description, instructions: instructions, tags: tags })

		const formData = new FormData()
		formData.append("payload", body)
		formData.append("image", image)

		const data = await authFetcher(`${API_BASE}/api/recipes`, {
			method: "POST",
			body: formData,
		})
		
        return { id: data.id, ok: true, message: null }
	} catch (error) {
		console.log(error)
		return { id: null, ok: false, message: error }
	}
}	

// Update recipe
export async function putRecipe(id, title, image, ingredients, description, instructions, tags = []) {
	try {
		const ingData = ingredients.map((i) => ({
			id: i.id,
			quantity: parseFloat(i.quantity) || 0,
			unit: i.units,
		}));

		const body = JSON.stringify({ title: title, ingredients: ingData, description: description, instructions: instructions, tags: tags })

		const formData = new FormData()
		formData.append("payload", body)

		if (image && typeof image !== 'string') formData.append("image", image)

		await authFetcher(`${API_BASE}/api/recipes/${id}`, {
			method: "PUT",
			body: formData,
		})

        return { id: null, ok: true, message: null }
	} catch (error) {
		console.error("PUT REQUEST ERROR:", error)
		return { id: null, ok: false, message: error.message }
	}
}

// Delete recipe
export async function deleteRecipe(id) {
	try {
		await authFetcher(`${API_BASE}/api/recipes/${id}`, {
			method: "DELETE",
		})

        return { ok: true, message: null }
	} catch (error) {
		console.error("DELETE REQUEST ERROR:", error)
		return { ok: false, message: error }
	}
}

// Like / unlike recipe (toggle). Returns { ok, message }
export async function likeRecipe(id) {
  try {
    await authFetcher(`${API_BASE}/api/recipes/${id}/likes`, {
      method: "PUT",
    })

    return { ok: true, message: null }
  } catch (error) {
    console.error("PUT REQUEST ERROR:", error)
    return { ok: false, message: error }
  }
}
