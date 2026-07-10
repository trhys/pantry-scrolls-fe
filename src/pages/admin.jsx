import { useState } from 'react'
import { useGetTotalUsers, useGetTotalRecipes } from '../api/metrics.jsx'
import { useMaintenanceContext } from '../context/MaintenanceContext.jsx'
import './admin.css'

export default function AdminDashboard() {
  const { totalUsers } = useGetTotalUsers()
  const { totalRecipes } = useGetTotalRecipes()
  const { isMaintenanceActive, isLoading: maintenanceLoading, toggleMaintenance } = useMaintenanceContext()
  const [isToggling, setIsToggling] = useState(false)
  const [toggleError, setToggleError] = useState(null)

  async function handleToggleMaintenance() {
    setIsToggling(true)
    setToggleError(null)
    const result = await toggleMaintenance()
    if (result && !result.ok) {
      setToggleError(result.message || 'Failed to update maintenance mode.')
    }
    setIsToggling(false)
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
            <button className="add-list-btn">Scribe Report</button>
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
              <h3 className="quest-panel-title" style={{border: 'none', padding: 0}}>Recent Realm Activity</h3>
              <hr className="feed-section-divider" />
              
              <div className="profile-recipes-list">
                <div className="council-activity-row">
                  <div className="activity-details">
                    <h4>Artisan registration surge detected</h4>
                    <span className="timestamp-hint">12 mins ago</span>
                  </div>
                  <span className="arrow-indicator">🗡️</span>
                </div>
                
                <div className="council-activity-row">
                  <div className="activity-details">
                    <h4>Archive validation sequence complete</h4>
                    <span className="timestamp-hint">1 hour ago</span>
                  </div>
                  <span className="arrow-indicator">🗡️</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="quest-panel-title" style={{border: 'none', padding: 0}}>Chamber Dispatches</h3>
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
                    {toggleError && <span className="timestamp-hint" style={{color: '#f87171'}}>{toggleError}</span>}
                  </div>
                  <span className="arrow-indicator">
                    {isToggling ? '⏳' : isMaintenanceActive ? '🚫' : '⚠️'}
                  </span>
                </button>

                <button type="button" className="dispatch-action-btn">
                  <div>
                    <h4>Purge Magic Archive Cache</h4>
                  </div>
                  <span className="arrow-indicator">⚡</span>
                </button>
                
                <button type="button" className="dispatch-action-btn">
                  <div>
                    <h4>Seal Backup Crypt Blueprint</h4>
                  </div>
                  <span className="arrow-indicator">🔮</span>
                </button>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}
