import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

const fetcher = (url) => fetch(url).then(res => res.json());
const optionalAuthFetcher = async (url) => {
	try {
		return await authFetcher(url, { method: "GET" })
	} catch {
		return fetcher(url)
	}
}

// Get recipe feed
export function useGetRecipeFeed() {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/recipes`, optionalAuthFetcher)
	return { data, error, isLoading }
}

// Get explorer feed with query
export function useExploreFeed(query) {
  const endpoint = query !== ""
    ? `${API_BASE}/api/recipes/explore?search=${encodeURIComponent(query)}`
    : `${API_BASE}/api/recipes`

  const { data, error, isLoading, mutate } = useSWR(endpoint, optionalAuthFetcher)
  return { data, error, isLoading, mutate }
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

// Get ingredients for recipe creator
export function useGetIngredients() {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/ingredients`, fetcher)
	return { data, error, isLoading }
}

// Get ingredient units for recipe creator
export function useGetUnits(id) {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/ingredients/${id}/units`, fetcher)
	return { data, error, isLoading }
}

// Create new recipe and return success status + recipe id if successful
export async function postRecipe(title, image, ingredients, description, instructions) {
	try {
		const ingData = ingredients.map((i) => ({
			id: i.id,
			quantity: parseFloat(i.quantity) || 0,
			unit: i.units,
		}));

		const body = JSON.stringify({ title: title, ingredients: ingData, description: description, instructions: instructions })

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
export async function putRecipe(id, title, image, ingredients, description, instructions) {
	try {
		const ingData = ingredients.map((i) => ({
			id: i.id,
			quantity: parseFloat(i.quantity) || 0,
			unit: i.units,
		}));

		const body = JSON.stringify({ title: title, ingredients: ingData, description: description, instructions: instructions })

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
