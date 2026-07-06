import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import './verify.css'

export function VerificationPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify/${params.token}`)
        
        if (response.ok) {
          setStatus('success')
          setMessage('Your email has been verified! Redirecting to login...')
          setTimeout(() => navigate('/login'), 3000)
        } else {
          const errorData = await response.json().catch(() => ({}))
          setStatus('error')
          setMessage(errorData.message || 'Verification failed. The link may have expired.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
        console.error('Verification error:', error)
      }
    }

    verifyEmail()
  }, [params.token, navigate])

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === 'verifying' && (
          <div className="verify-loading">
            <div className="spinner"></div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-success">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <button onClick={() => navigate('/login')} className="verify-button primary">
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-error">
            <div className="error-icon">✕</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verify-actions">
              <button onClick={() => navigate('/signup')} className="verify-button primary">
                Register Again
              </button>
              <button onClick={() => navigate('/')} className="verify-button secondary">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
