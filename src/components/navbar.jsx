import { Link, NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from './auth.jsx'
import logo from '../assets/logo.png'

export default function Navbar() {
	const { user, logout } = useAuth(); 
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/')
		setIsMobileMenuOpen(false)
	}

	const closeMobileMenu = () => setIsMobileMenuOpen(false)

	return (
		<nav className="tavern-banner">
      <Link to="/" className="realm-logo" onClick={closeMobileMenu}>
        <img src={logo} className="logo-img w-8 h-8" alt="Pantry Scrolls Sigil" />
        <span className="realm-logo-text">Pantry Scrolls</span>
      </Link>

      {/* Desktop nav links */}
      <div className="tavern-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="explore" end>Explore</NavLink>
        <NavLink to="contact" end>Contact</NavLink>
        
        {user ? (
          <>
            <NavLink to="recipe-creator" end>Scribe Recipe</NavLink>
            <NavLink to="shopping-lists" end>Shopping Lists</NavLink>

            <div className="adventurer-profile">
              <div className="adventurer-badge" onClick={() => setIsOpen(!isOpen)}>
                <span className="adventurer-name">{user.name}</span>
                <div className="adventurer-sigil">
                  {user.image_url ? (
                    <img src={user.image_url} alt={`${user.name}'s Sigil`} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              
              {isOpen && (
                <div className="tavern-dropdown" onMouseLeave={() => setIsOpen(false)}>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
                  <hr />
                  <button onClick={logout} className="dropdown-logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="login" end>Login</NavLink>
            <NavLink to="signup" end>Register</NavLink>
          </>
        )}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
      </button>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="explore" end onClick={closeMobileMenu}>Explore</NavLink>
          <NavLink to="contact" end onClick={closeMobileMenu}>Contact</NavLink>

          {user ? (
            <>
              <NavLink to="recipe-creator" end onClick={closeMobileMenu}>Scribe Recipe</NavLink>
              <NavLink to="shopping-lists" end onClick={closeMobileMenu}>Shopping Lists</NavLink>
              <hr />
              <NavLink to="/profile" onClick={closeMobileMenu}>Profile</NavLink>
              <NavLink to="/settings" onClick={closeMobileMenu}>Settings</NavLink>
              <hr />
              <button onClick={handleLogout} className="mobile-nav-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="login" end onClick={closeMobileMenu}>Login</NavLink>
              <NavLink to="signup" end onClick={closeMobileMenu}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
