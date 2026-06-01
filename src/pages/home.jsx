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
        <img src={bannerImg} alt="Pantry Scrolls Banner" />
      </div>

      <div className="welcome-card">
        {user ? (
          <>
            <h2>Hail, {user.name}!</h2>
            <p>Explore the realm's most popular recipes, delve into our grand archive, or perhaps scribe your own culinary creations</p>
            <div className="home-actions">
              <Link to="/recipe-creator" className="home-btn primary-action">
                📜 Scribe Recipe
              </Link>
              <Link to="/shopping-lists" className="home-btn secondary-action">
                ⚔️ Shopping Lists 
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>Welcome to Pantry Scrolls</h2>
            <p>Step inside our grand culinary archive to create your own recipe scrolls, and organize the provisions for your house.</p>
            <div className="home-actions">
              <Link to="/login" className="home-btn primary-action">
                Enter the Archive
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="app-description">
        Scribe your culinary creations, count up your required ingredients, and make your shopping plan painless.
        Essential equipment for any great quartermaster, your shopping list creator will compile an attractive and
        convenient ledger of the ingredients required for all your recipes.
      </p>

      <RecipeFeed />
    </div>
  );
}
