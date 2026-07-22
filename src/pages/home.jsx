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
            <p>Ready to scribe a new scroll, or perhaps preparing your next shopping quest?</p>
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
            <p>We are collecting recipes for our Grand Archive and sharing them with the world. You can explore the guild's most popular scrolls, delve into the Grand Archive, or perhaps share your own culinary creations!</p>
            <div className="home-actions">
              <Link to="/signup" className="home-btn primary-action">
               Join the Guild 
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="app-description">
        As a Pantry Scrolls guild member, you can share any recipe from your favorite drink to complex casseroles, and anything between. Any shared recipe can be put in your shopping list for convenient planning and shopping.
      </p>

      <RecipeFeed />
    </div>
  );
}
