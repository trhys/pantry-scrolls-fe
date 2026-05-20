import { Link } from 'react-router'
import { useAuth } from './auth.jsx'
import './footer.css'

export default function Footer() {
    const { user } = useAuth()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">The Recipe Repo</span>
                    <p>Organize your meals, consolidate grocery trips, and cook with ease.</p>
                </div>

                <div className="footer-links">
                    <h4>Navigation</h4>
                    <Link to="/">Home</Link>
                    {user ? (
                        <>
                        <Link to="/recipe-creator">Create Recipe</Link>
                        <Link to="/shopping-lists">Shopping Lists</Link>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Log In</Link>
                        <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
                <div className="footer-links"> 
                  <h4>About</h4>
                  <Link to="/terms">Terms of Service</Link>
                  <Link to="/privacy">Privacy Policy</Link>
                </div>
            </div>

            <hr className="footer-divider" />

            <div className="footer-bottom">
                <p>&copy {currentYear} The Recipe Repo. Built for passionate home chefs.</p>
                <div className="footer-status">
                    <span className="status-dot"></span> All Systems Operational
                </div>
            </div>
        </footer>
    );
}

