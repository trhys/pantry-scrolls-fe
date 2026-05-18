import useSWR from 'swr'
import { authFetcher } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

// Get user's lists
export function useGetShoppingLists(user) {
	const { data, error, isLoading, mutate } = useSWR(`${API_BASE}/api/shoppinglists`, user ? authFetcher : null)
	return { data, error, isLoading, mutate }
}

// Get list by id
export function useGetSingleList(id) {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/shoppinglists/${id}`, authFetcher)
	return { data, error, isLoading }
}

// Get ingredient list from shopping list
export function useGetListItems(id) {
	const { data, error, isLoading } = useSWR(`${API_BASE}/api/shoppinglists/${id}/print`, authFetcher)
	return { data, error, isLoading }
}

// Create new list
export async function postCreateList(name) {
	try {
		const body = JSON.stringify({ name: name })

		const data = await authFetcher(`${API_BASE}/api/shoppinglists`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: body,
		})
        return { ok: true, message: null }
	} catch (error) {
		console.error("POST REQUEST ERROR:", error)
		return { ok: false, message: error.message }
	}
}

// Delete list
export async function deleteList(id) {
	try {
		const data = await authFetcher(`${API_BASE}/api/shoppinglists/${id}`, {
			method: "DELETE",
		})

		return { ok: true, message: null }
	} catch (error) {
		console.error("FAILED DELETE REQUEST:", error)
		return { ok: false, message: error.message }
	}
}

// Add to list
export async function postAddRecipeToList(listID, recipeID, quantity) {
	try {
		const data = await authFetcher(`${API_BASE}/api/shoppinglists/${listID}`, {
			method: "POST",
			body: JSON.stringify({ recipe_id: recipeID, quantity: parseInt(quantity) }),
			headers: {
				'Content-Type': 'application/json'
			},
		})

		return { ok: true, message: null }
	} catch (error) {
		console.error("FAILED POST REQUEST:", error)
		return { ok: false, message: error.message }
	}
}
