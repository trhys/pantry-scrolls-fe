const API_BASE = import.meta.env.VITE_API_URL

export const authFetcher = async (url, opts) => {
  try {
    let response = await fetch(url, {...opts, credentials: 'include'})
    if (response.status === 401) {
      const renewed = await refreshSession();
      if (!renewed) {
        throw new Error("Your authentication credentials have expired.");
      }
      response = await fetch(url, { ...opts, credentials: 'include' });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || response.statusText || "Unknown failure";
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Login
export async function postLogin(email, password) {
	const opts = {
		method: "POST",
		body: JSON.stringify({ email, password }),
	};

	try {
      const response = await fetch(`${API_BASE}/api/sessions`, opts);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return { ok: false, message: data?.error || "Invalid entry credentials." };
      }

      return { ok: true, data };
  } catch (error) {
    console.error("Login failure:", error);
    return { ok: false, message: "Something went wrong." };
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
		const data = await response.json().catch(() => null);

        if (!response.ok) {
          return { ok: false, message: data?.error || "Registration criteria unmet." };
        }

        return { ok: true, data };
    } catch (error) {
      console.error("Signup configuration failure:", error);
      return { ok: false, message: "Something went wrong." };
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



