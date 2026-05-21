import { Link } from 'react-router'
import RecipeFeed from '../components/recipesFeed.jsx'
import bannerImg from '../assets/banner.png'
import { useAuth } from '../components/auth.jsx'
import './home.css'

export default function Home() {
	const { user, logout } = useAuth();

     return (
    <div className="home-page-container">
      <div className="banner-container">
        <img src={bannerImg} alt="Pantry Scrolls Kingdom Banner" />
      </div>

      <div className="welcome-card">
        {user ? (
          <>
            <h2>Hail and welcome back, {user.name}!</h2>
            <p>Consult your scrolls, scribe a new formula, or see what feasts your guildmates are crafting.</p>
            <div className="home-actions">
              <Link to="/recipe-creator" className="home-btn primary-action">
                📜 Forge Recipe
              </Link>
              <Link to="/shopping-lists" className="home-btn secondary-action">
                ⚔️ Open Provisions Ledgers
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>Welcome to Pantry Scrolls</h2>
            <p>Step inside our grand culinary archive to safely store your formulas, calculate raw ingredients, and organize provisions for your next journey.</p>
            <div className="home-actions">
              <Link to="/login" className="home-btn primary-action">
                Enter the Archive
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="app-description">
        Scribe your culinary blueprints, aggregate dynamic shopping provisions, and make field rations calculation fluid. 
        Bind recipes directly to your party ledger to construct a beautifully compiled manifest, perfect for parchment printing.
      </p>

      <RecipeFeed />
    </div>
  );
}
