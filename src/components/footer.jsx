import { Link } from 'react-router'
import { useAuth } from './auth.jsx'
import { useMaintenanceContext } from '../context/MaintenanceContext.jsx'

export default function Footer() {
    const { user } = useAuth()
    const currentYear = new Date().getFullYear()
    const { isMaintenanceActive } = useMaintenanceContext()

    return (
        <footer className="app-footer">
      <div className="footer-content">
        
        <div className="footer-brand">
          <span className="footer-logo">Pantry Scrolls</span>
          <p>Scribe your house recipes, fill your provisions manifest, and feed your party with absolute ease.</p>
        </div>

        <div className="footer-links">
          <h4>Directories</h4>
          <Link to="/">Home</Link>
                    {user ? (
            <>
              <Link to="/recipe-creator">Scribe Recipe</Link>
              <Link to="/shopping-lists">Shopping Lists</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Register</Link>
            </>
          )}
        </div>

        <div className="footer-links"> 
          <h4>About Us</h4>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>&copy; {currentYear} Pantry Scrolls. Chronicled for passionate culinary artisans.</p>
        <div className="footer-status">
          <span className={ isMaintenanceActive ? 'status-dot-offline' : 'status-dot-online' }></span>{ isMaintenanceActive ? 'Offline' : 'Online' }
        </div>
      </div>
    </footer>
  );
}
