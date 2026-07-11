import { Link } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../components/auth.jsx'
import { useAccountDeactivation } from '../api/users.js'
import './settings.css'

export default function Settings() {
  const { user } = useAuth()
  const [isConfirming, setIsConfirming] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState({ type: null, message: '' })

  const handleRequestDeletion = async () => {
    setIsSubmitting(true)
    setResult({ type: null, message: '' })

    const response = await useAccountDeactivation(user.id)

    setResult({
      type: response.ok ? 'success' : 'error',
      message: response.message
    })
    setIsSubmitting(false)

    if (response.ok) {
      setIsConfirming(false)
      setHasConfirmed(false)
    }
  }

  if (!user) {
    return (
      <div className="settings-page">
        <section className="settings-card">
          <h2>Settings</h2>
          <p>You must be logged in to manage your account settings.</p>
          <div className="settings-actions">
            <Link to="/login" className="settings-primary-btn">Go to Login</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <section className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your Pantry Scrolls account and review actions that affect your profile.</p>
        <p className="settings-user-meta">Signed in as {user.email}</p>
      </section>

      <section className="settings-card">
        <h2>Email notices</h2>
        <p>
          If you request account deletion, we will send a notification email with a link you can use to
          cancel the scheduled deactivation.
        </p>
      </section>

      <section className="danger-zone-card">
        <h2>Delete account</h2>
        <p>
          Requesting deletion will schedule your account for deactivation. Use the email link if you need to
          cancel the request before it completes.
        </p>

        <ul className="danger-zone-list">
          <li>Your profile access will be scheduled for removal.</li>
          <li>You will receive an email with a cancellation link.</li>
          <li>Use this option only if you are ready to leave Pantry Scrolls.</li>
        </ul>

        {result.type && (
          <div className={`settings-message ${result.type}`}>
            {result.message}
          </div>
        )}

        {!isConfirming ? (
          <div className="settings-actions">
            <button
              type="button"
              className="settings-danger-btn"
              onClick={() => setIsConfirming(true)}
              disabled={isSubmitting || result.type === 'success'}
            >
              {result.type === 'success' ? 'Deletion Requested' : 'Request Account Deletion'}
            </button>
          </div>
        ) : (
          <div className="settings-confirmation">
            <label htmlFor="confirm-account-deletion">
              <input
                id="confirm-account-deletion"
                type="checkbox"
                checked={hasConfirmed}
                onChange={(event) => setHasConfirmed(event.target.checked)}
                disabled={isSubmitting}
              />
              <span>I understand this starts an account deletion request and sends me a cancellation email.</span>
            </label>

            <div className="settings-actions">
              <button
                type="button"
                className="settings-danger-btn"
                onClick={handleRequestDeletion}
                disabled={!hasConfirmed || isSubmitting}
              >
                {isSubmitting ? 'Submitting Request...' : 'Confirm Deletion Request'}
              </button>
              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => {
                  setIsConfirming(false)
                  setHasConfirmed(false)
                }}
                disabled={isSubmitting}
              >
                Keep My Account
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
