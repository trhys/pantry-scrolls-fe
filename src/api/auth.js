import { useNavigate } from 'react-router'

const API_BASE = import.meta.env.VITE_API_URL

export const authFetcher = async (url, opts) => {
  try {
    let response = await fetch(url, {...opts, credentials: 'include'})
    if (response.status === 401) {
      const ok = await refreshSession()
      if (!ok) throw new Error("Session expired")
      response = await fetch(url, {...opts, credentials: 'include'})
    }
    if (!response.ok) {
        const data = await response.json() || null
        throw new Error(`BAD API RESPONSE: ${data}`)
    }

    if (response.status === 204) return null

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

// Login
export async function postLogin(email, password) {
	const opts = {
		method: "POST",
		credentials: "include",
		body: JSON.stringify({ email, password }),
	};

	try {
		const response = await fetch(`${API_BASE}/api/sessions`, opts)
		const data = await response.json()
		if (!response.ok) throw new Error(`Failed to login: ${data.error}`)
		return data
	} catch (error) {
		console.log(error)
	}
}

// Sign up
export async function postSignup(email, password, name) {
	const opts = {
		method: "POST",
		body: JSON.stringify({ email, password, name }),
	};

	try {
		const response = await fetch(`${API_BASE}/api/users`, opts)
		const data = await response.json()
		if (!response.ok) throw new Error(`Failed to register user: ${data.error}`)
		return data
	} catch (error) {
		console.log(error)
	}
}

// Refresh token
async function refreshSession() {
  try {
    const response = await fetch(`${API_BASE}/api/tokens/refresh`, { credentials: "include" })
    if (response.ok) return true

    return false
  } catch (error) {
    console.error("REFRESH FAILED:", error)
    return false
  }
}



