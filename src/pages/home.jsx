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
                <img src={bannerImg} alt="The Recipe Repo Banner" />
            </div>

            <div className="welcome-card">
		    {user ? (
			<>
			    <h2>Welcome back, {user.name}!</h2>
			    <p>Create a new recipe or explore shared culinary ideas.</p>
			    <div className="home-actions">
				<Link to="/recipe-creator" className="home-btn primary-action">
				    + Create Recipe
				</Link>
				<Link to="/shopping-lists" className="home-btn secondary-action">
				    📋 View Shopping Lists
				</Link>
			    </div>
			</>
		    ) : (
			<>
			    <h2>Welcome to The Recipe Repo</h2>
			    <p>Log in to share your own recipes, or browse our shared community collection.</p>
			    <div className="home-actions">
				<Link to="/login" className="home-btn primary-action">
				    Get Started
				</Link>
			    </div>
			</>
		    )}
		</div>

            <p className="app-description">
                Share your recipes and make shopping or meal planning quick and easy. 
                Add recipes to your global shopping lists for a convenient, beautifully formatted printout.
            </p>

            <RecipeFeed />
        </div>
    );
}
