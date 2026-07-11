import { Outlet } from 'react-router'
import { useAuth } from './components/auth.jsx'
import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'
import { MaintenanceBanner } from './components/MaintenanceBanner.jsx'

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="realm-layout">
      <MaintenanceBanner />
      <Navbar user={user} logout={logout} />

      <main className="realm-container">
        
        <section id="center" className="central-ledger">
          <Outlet />
        </section>

        {/*<aside id="next-steps" className="quest-sidebar">
          <div className="quest-panel">
            <h3 className="quest-panel-title">📜 Active Quests</h3>
            <p className="quest-panel-hint">
              Select a scroll recipe from the ledger to begin preparing your grand feast.
            </p>
          </div>
        </aside>
        */}

      </main>

      <footer id="spacer" className="footer-keep">
        <Footer />
      </footer>
    </div>
  );
}
