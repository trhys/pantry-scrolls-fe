import { useState } from 'react'
import { useAuth } from '../components/auth.jsx'
import { useNavigate, Link } from 'react-router'
import { postLogin, postSignup } from '../api/auth.js'
import './auth.css'


export function Login() {
	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const { login } = useAuth()
	const navigate = useNavigate()


	async function handleSubmit(e) {
		e.preventDefault()
		try {
          const { ok, data, message } = await postLogin(email, pass)
          if (!ok) {
            alert(message)
            return
          }
          login(data)
          navigate('/')
        } catch(error) {
          throw error
        }
	}

	return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Enter the Archive</h2>
        <p>Ready to make your planning painless, and chronicle culinary greatness?</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">Enter</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register</Link>
        </div>
      </div>
    </div>
  );
}

export function Signup() {
	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const [name, setName] = useState('')
	const navigate = useNavigate()

	async function handleSubmit(e) {
		e.preventDefault()
        try {
          if (pass !== confirmPass) {
              alert("Passwords must match")
              return
          }

          const { ok, data, message } = await postSignup(email, pass, name)
          if (!ok) {
            alert(message)
            return
          }
          navigate('/login')
        } catch(error) {
          throw(error)
        }
	}

	return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register with the Guild</h2>
        <p>Scribe your details here and register with the Pantry Scrolls guild.</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          {pass.length < 5 && pass.length > 0 && (
            <span className="error-text">Password must be longer than 5 characters</span>
          )}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            className={pass !== confirmPass && confirmPass.length > 0 ? "error" : ""}
            required
          />
          {pass !== confirmPass && confirmPass.length > 0 && (
            <span className="error-text">Passphrases do not match</span>
          )}
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">Register</button>
        </form>
        
        <div className="auth-footer">
          Already registered? <Link to="/login">Enter the Archive</Link>
        </div>
      </div>
    </div>
  );
}
