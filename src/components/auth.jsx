import { createContext, useContext, useState, useEffect } from 'react'
import { authFetcher } from '../api/auth.js'

const API_BASE = import.meta.env.VITE_API_URL

const ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = async () => {
	    try {
		    const data = await authFetcher(`${API_BASE}/api/sessions`, {
			    method: "GET",
		    })

            login(data)
	    } catch (error) {
		    console.log(error)
            logout()
	    } finally {
		    setLoading(false)
	    }
    };
	
    savedUser();

  }, []);

  const login = (data) => {
    setUser(data);
    const session = JSON.stringify({ email: data.email, name: data.name, id: data.id, image_url: data.image_url })
    localStorage.setItem('user_session', session);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tokens/revoke`, { credentials: 'include' })
      setUser(null)
      localStorage.removeItem('user_session')
    } catch (error) {
      console.error("TOKEN REVOKE FAILURE:", error)
    }
  }

  return (
    <ctx.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </ctx.Provider>
  );
};

export const useAuth = () => useContext(ctx);
