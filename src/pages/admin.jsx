import { useEffect, useState } from 'react'
import { useGetTotalUsers, useGetTotalRecipes } from '../api/metrics.jsx'
import { useMaintenanceContext } from '../context/MaintenanceContext.jsx'
import { useAuth } from '../components/auth.jsx'
import { authFetcher } from '../api/auth.js'
import './admin.css'

const API_BASE = import.meta.env.VITE_API_URL

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    if (authLoading || !user) return

    const verifyAdmin = async () => {
      try {
        await authFetcher(`${API_BASE}/api/admin/check`, { method: 'GET' })
        setIsAdmin(true)
      } catch {
        setIsAdmin(false)
      }
    }

    verifyAdmin()
  }, [authLoading, user])

  const { totalUsers } = useGetTotalUsers()
  const { totalRecipes } = useGetTotalRecipes()
  const {
    isMaintenanceActive,
    maintenanceMessage,
    isLoading: maintenanceLoading,
    toggleMaintenance,
    updateMaintenanceMessage
  } = useMaintenanceContext()

  const [isToggling, setIsToggling] = useState(false)
  const [toggleError, setToggleError] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [isSavingMessage, setIsSavingMessage] = useState(false)
  const [messageStatus, setMessageStatus] = useState(null)

  useEffect(() => {
    setMessageInput(maintenanceMessage || '')
  }, [maintenanceMessage])

  async function handleToggleMaintenance() {
    setIsToggling(true)
    setToggleError(null)
    const result = await toggleMaintenance()
    if (result && !result.ok) {
      setToggleError(result.message || 'Failed to update maintenance mode.')
    }
    setIsToggling(false)
  }

  async function handleSaveMaintenanceMessage() {
    setIsSavingMessage(true)
    setMessageStatus(null)

    const result = await updateMaintenanceMessage(messageInput)

    if (result && result.ok) {
      setMessageStatus({ type: 'success', text: 'Maintenance message updated.' })
    } else {
      setMessageStatus({
        type: 'error',
        text: result?.message || 'Failed to update maintenance message.'
      })
    }

    setIsSavingMessage(false)
  }

  if (authLoading || (user && isAdmin === null)) {
    return (
      <div className="text-center py-12">
        <p className="font-['MedievalSharp'] text-xl text-amber-500">Verifying access...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="font-['MedievalSharp'] text-xl text-amber-500">You must log in to access this page.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="font-['MedievalSharp'] text-xl text-amber-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Metrics</div>
        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">
            Chamber View <span className="arrow-indicator">🗡️</span>
          </a>
          <a href="#users" className="nav-item">Guild Members</a>
          <a href="#analytics" className="nav-item">Treasury Logs</a>
          <a href="#settings" className="nav-item">Realm Parameters</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="header-profile">
            <span className="profile-email-badge">👑 Admin</span>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="content-header">
            <h2 className="page-title">Overview</h2>
            <button className="add-list-btn">---</button>
          </div>

          <hr className="feed-section-divider" />

          <section className="treasury-stats-grid">
            <div className="stat-card">
              <span className="stat-number">{totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">---</span>
              <span className="stat-label">---</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalRecipes}</span>
              <span className="stat-label">Total Recipes</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">---</span>
              <span className="stat-label">---</span>
            </div>
          </section>

          <section className="profile-dashboard-layout">
            <div className="profile-section">
              <h3 className="quest-panel-title" style={{ border: 'none', padding: 0 }}>Recent Realm Activity</h3>
              <hr className="feed-section-divider" />

              <div className="profile-recipes-list">
                <div className="council-activity-row">
                  <div className="activity-details">
                    <h4>---</h4>
                    <span className="timestamp-hint">---</span>
                  </div>
                  <span className="arrow-indicator">🗡️</span>
                </div>

                <div className="council-activity-row">
                  <div className="activity-details">
                    <h4>---</h4>
                    <span className="timestamp-hint">---</span>
                  </div>
                  <span className="arrow-indicator">🗡️</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="quest-panel-title" style={{ border: 'none', padding: 0 }}>Chamber Dispatches</h3>
              <hr className="feed-section-divider" />

              <div className="profile-lists-stack">
                <button
                  type="button"
                  className="dispatch-action-btn"
                  onClick={handleToggleMaintenance}
                  disabled={isToggling || maintenanceLoading}
                >
                  <div>
                    <h4>Realm Maintenance Banner</h4>
                    <span className="timestamp-hint">
                      {maintenanceLoading ? 'Loading...' : isMaintenanceActive ? '🔴 Currently Enabled' : '🟢 Currently Disabled'}
                    </span>
                    {toggleError && <span className="timestamp-hint" style={{ color: '#f87171' }}>{toggleError}</span>}
                  </div>
                  <span className="arrow-indicator">
                    {isToggling ? '⏳' : isMaintenanceActive ? '🚫' : '⚠️'}
                  </span>
                </button>

                <div className="dispatch-action-btn" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0 }}>Maintenance Message</h4>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="System maintenance in progress. Please check back soon."
                      rows={3}
                      style={{
                        width: '100%',
                        resize: 'vertical',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#e5e7eb'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        className="add-list-btn"
                        onClick={handleSaveMaintenanceMessage}
                        disabled={isSavingMessage || maintenanceLoading}
                      >
                        {isSavingMessage ? 'Saving...' : 'Save Message'}
                      </button>
                      {messageStatus && (
                        <span
                          className="timestamp-hint"
                          style={{ color: messageStatus.type === 'success' ? '#4ade80' : '#f87171' }}
                        >
                          {messageStatus.text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button type="button" className="dispatch-action-btn">
                  <div>
                    <h4>---</h4>
                  </div>
                  <span className="arrow-indicator">⚡</span>
                </button>

                <button type="button" className="dispatch-action-btn">
                  <div>
                    <h4>---</h4>
                  </div>
                  <span className="arrow-indicator">🔮</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
