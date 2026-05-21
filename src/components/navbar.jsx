import { Link, NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from './auth.jsx'
import logo from '../assets/logo.png'

export default function Navbar() {
	const { user, logout } = useAuth(); 
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<nav className="tavern-banner">
      <Link to="/" className="realm-logo">
        <img src={logo} className="logo-img w-8 h-8" alt="Pantry Scrolls Sigil" />
        <span className="realm-logo-text">Pantry Scrolls</span>
      </Link>

      <div className="tavern-links">
        <NavLink to="/" end>Hearth</NavLink>
        <NavLink to="explore" end>Explore Scrolls</NavLink>
        
        {user ? (
          <>
            <NavLink to="recipe-creator" end>Forge Scroll</NavLink>
            <NavLink to="shopping-lists" end>Provisions</NavLink>

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
                  <Link to="/profile" onClick={() => setIsOpen(false)}>Character Sheet</Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
                  <hr />
                  <button onClick={logout} className="dropdown-logout">
                    Leave Tavern
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="login" end>Enter Realm</NavLink>
            <NavLink to="signup" end>Enlist</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
