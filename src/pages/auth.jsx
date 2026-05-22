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
        <h2>Enter the Keep</h2>
        <p>Ready to unroll ancient scrolls and chronicle your culinary quests?</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Guild Identifier (Email)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Secret Passphrase (Password)"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">Pass Gatekeeper</button>
        </form>

        <div className="auth-footer">
          New to the realm? <Link to="/signup">Enlist in Guild</Link>
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
          navigate('login')
        } catch(error) {
          throw(error)
        }
	}

	return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Enlist in the Guild</h2>
        <p>Scribe your magical lineage details below to unlock your master ledger archive bundle.</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Guild Identifier (Email)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Secret Passphrase (Password)"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Passphrase"
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
            placeholder="Adventurer Name (Username)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">Scribe Registry</button>
        </form>
        
        <div className="auth-footer">
          Already a guildmate? <Link to="/login">Enter the Keep</Link>
        </div>
      </div>
    </div>
  );
}
