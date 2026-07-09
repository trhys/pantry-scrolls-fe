import { useState } from 'react'
import { useAuth } from '../components/auth.jsx'
import { useNavigate, Link } from 'react-router'
import { postLogin, postSignup } from '../api/auth.js'
import './auth.css'


export function Login() {
	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [showForgotModal, setShowForgotModal] = useState(false)
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
          <button 
            type="button" 
            className="forgot-password-btn"
            onClick={() => setShowForgotModal(true)}
          >
            Forgot Password?
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register</Link>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
}

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('idle') // idle, success, error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setIsLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Password reset link sent! Check your email.')
        setEmail('')
        setTimeout(() => onClose(), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setStatus('error')
        setMessage(errorData.error || 'Failed to send reset link. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <h3>Reset Your Password</h3>
        <p>Enter your email address and we'll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="reset-submit-btn"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {status === 'success' && (
            <div className="modal-message success">
              ✓ {message}
            </div>
          )}

          {status === 'error' && (
            <div className="modal-message error">
              ✕ {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
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
          <p className="auth-legal-copy">
            By creating an account, you agree to the Pantry Scrolls{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>. We may send you
            account-related emails, such as verification and password reset
            messages.
          </p>
          <button className="submit-btn" type="submit">Register</button>
        </form>
        
        <div className="auth-footer">
          Already registered? <Link to="/login">Enter the Archive</Link>
        </div>
      </div>
    </div>
  );
}
