const API_BASE = import.meta.env.VITE_API_URL

// Send a message
export async function postMessage(email, message) {
	try {
		const body = JSON.stringify({ email: email.trim(), message: message.trim() })

		const response = await fetch(`${API_BASE}/api/messages`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: body,
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

        return { ok: true, message: null }
	} catch (error) {
		console.error("POST REQUEST ERROR:", error)
		return { ok: false, message: error.message }
	}
}
