import { redirect } from 'react-router'
import { useAuth } from '../components/auth.jsx'
//import { useGetAdmin } from '../api/auth.jsx'
import './admin.css'

export default function AdminDashboard() {
  const { user } = useAuth()

//  const { data, error, isLoading } = useGetAdmin(user.id)

//  if (error) redirect("/")
  
//  if (isLoading) return <p>Loading...</p>

  return (
        <div className="dashboard-container">
              
              {/* STICKY SIDEBAR PANEL */}
              <aside className="dashboard-sidebar">
                <div className="sidebar-logo">AdminPanel</div>
                <nav className="sidebar-nav">
                  <a href="#overview" className="nav-item active">
                    Overview <span className="arrow-indicator">→</span>
                  </a>
                  <a href="#users" className="nav-item">Users</a>
                  <a href="#analytics" className="nav-item">Analytics</a>
                  <a href="#settings" className="nav-item">Settings</a>
                </nav>
              </aside>

              {/* MAIN VIEW CONTENT */}
              <div className="dashboard-main">
                
                {/* FROSTED TOP HEADER */}
                <header className="dashboard-header">
                  <div className="header-search">
                    <input type="text" placeholder="Search data..." className="search-input" />
                  </div>
                  <div className="header-profile">
                    <span className="profile-email">admin@app.com</span>
                  </div>
                </header>

                {/* PAGE CONTENT CONTAINER */}
                <main className="dashboard-content">
                  <div className="content-header">
                    <h2 className="page-title">Dashboard Overview</h2>
                    <button className="save-profile-btn">Export Report</button>
                  </div>
                  
                  <hr className="section-divider" />

                  {/* METRICS GRID */}
                  <section className="profile-stats-grid">
                    <div className="stat-card">
                      <span className="stat-number">$24,500</span>
                      <span className="stat-label">Total Sales</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">1,240</span>
                      <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">85</span>
                      <span className="stat-label">New Orders</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">99.9%</span>
                      <span className="stat-label">Uptime</span>
                    </div>
                  </section>

                  {/* TWO-COLUMN CONTENT LAYOUT */}
                  <section className="profile-dashboard-layout">
                    
                    {/* LARGE DETAILS PANEL */}
                    <div className="profile-section">
                      <h3>Recent Activity</h3>
                      <hr className="section-divider" />
                      <div className="profile-recipes-list">
                        <div className="profile-recipe-item">
                          <div className="profile-recipe-details">
                            <h4>User registration spike</h4>
                            <span className="empty-section-text">12 mins ago</span>
                          </div>
                          <span className="arrow-indicator">→</span>
                        </div>
                        <div className="profile-recipe-item">
                          <div className="profile-recipe-details">
                            <h4>Server cluster reboot complete</h4>
                            <span className="empty-section-text">1 hour ago</span>
                          </div>
                          <span className="arrow-indicator">→</span>
                        </div>
                      </div>
                    </div>

                    {/* QUICK ACTIONS PANEL */}
                    <div className="profile-section">
                      <h3>System Controls</h3>
                      <hr className="section-divider" />
                      <div className="profile-lists-stack">
                        <button className="profile-list-item" style={{background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
                          <div className="profile-recipe-details">
                            <h4>Flush System Cache</h4>
                          </div>
                          <span className="arrow-indicator">⚡</span>
                        </button>
                        <button className="profile-list-item" style={{background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
                          <div className="profile-recipe-details">
                            <h4>Trigger Backup Sequence</h4>
                          </div>
                          <span className="arrow-indicator">💾</span>
                        </button>
                      </div>
                    </div>

                  </section>
                </main>
              </div>
            </div>
          );
}
