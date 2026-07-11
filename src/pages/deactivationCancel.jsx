import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useCancelDeactivation } from '../api/users.js'
import './verify.css'

export function DeactivationCancellationPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const runCancellation = async () => {
      if (!token) {
        setStatus('error')
        setMessage('This cancellation link is invalid.')
        return
      }

      const response = await useCancelDeactivation(token)

      setStatus(response.ok ? 'success' : 'error')
      setMessage(response.message)
    }

    runCancellation()
  }, [token])

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === 'loading' && (
          <div className="verify-loading">
            <div className="spinner"></div>
            <h2>Canceling Deletion</h2>
            <p>Please wait while we update your account status...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-success">
            <div className="success-icon">✓</div>
            <h2>Deletion Canceled</h2>
            <p>{message}</p>
            <div className="verify-actions">
              <button onClick={() => navigate('/login')} className="verify-button primary">
                Go to Login
              </button>
              <button onClick={() => navigate('/')} className="verify-button secondary">
                Back to Home
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-error">
            <div className="error-icon">✕</div>
            <h2>Unable to Cancel Deletion</h2>
            <p>{message}</p>
            <div className="verify-actions">
              <button onClick={() => navigate('/contact')} className="verify-button primary">
                Contact Support
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
