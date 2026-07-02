import { redirect } from 'react-router'
import { useAuth } from '../components/auth.jsx'
//import { useGetAdmin } from '../api/auth.jsx'
import './admin.css'

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
          
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Small Council</div>
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
            <input type="text" placeholder="Scry ledger metrics..." className="search-input" />
          </div>
          <div className="header-profile">
            <span className="profile-email-badge">👑 Spymaster Admin</span>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="content-header">
            <h2 className="page-title">Council Overview</h2>
            <button className="add-list-btn">Scribe Report Manifest</button>
          </div>
          
          <hr className="feed-section-divider" />

          <section className="treasury-stats-grid">
            <div className="stat-card">
              <span className="stat-number">24,500ℊ</span>
              <span className="stat-label">Total Gold Income</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">1,240</span>
              <span className="stat-label">Active Artisans</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">85</span>
              <span className="stat-label">Pending Quests</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Ward Integrity</span>
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
