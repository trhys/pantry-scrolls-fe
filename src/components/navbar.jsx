import { Link, NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from './auth.jsx'
import logo from '../assets/logo.png'
import './navbar.css'

export default function Navbar() {
	const { user, logout } = useAuth(); 
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<nav className="navbar">
		<Link to="/" className="logo-container">
			<img src={logo} className="logo-img" />
			<span className="logo-text">The Recipe Repo</span>
		</Link>

		<div className="nav-links">
			<NavLink to="/" end>Home</NavLink>
            <NavLink to="explore" end>Explore</NavLink>
		{
			user ? (
				<>
				<NavLink to="recipe-creator" end>Create</NavLink>
				<NavLink to="shopping-lists" end>Shopping Lists</NavLink>

				<div className="profile-dropdown">
				<div className="user-profile" onClick={() => setIsOpen(!isOpen)}>
					<span className="user-name">{user.name}</span>
					<div className="user-avatar">
				    		{user.image_url ? <img src={user.image_url}/> : user.name.charAt(0)}
					</div>
			    	</div>
				{isOpen && (
					<div className="dropdown-menu">
					    <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
					    <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
					    <hr />
					    <button onClick={handleLogout} className="dropdown-logout">
						Logout
					    </button>
					</div>
                            	)}
                        	</div>
				</>
			) : (
				<>
				<NavLink to="login" end>Log In</NavLink>
				<NavLink to="signup" end>Sign Up</NavLink>
				</>
			)
		}
		</div>
		</nav>
	)
}
