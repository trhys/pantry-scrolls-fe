import { Link } from 'react-router'
import { useGetRecipeFeed } from '../api/recipes.js'
import formatDate from '../utility/format.js'

export default function RecipeFeed() {
	const { data, error, isLoading } = useGetRecipeFeed()

	if (isLoading) return (
      <div className="recipe-feed-container">
        <h2 className="feed-section-title">Trending Recipes</h2>
        <div className="recipe-feed-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="recipe-card skeleton-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-meta"></div>
              <div className="skeleton skeleton-image"></div>
            </div>
          ))}
        </div>
      </div>
    );

	if (error) return <p>Something went wrong!</p>

  return (
	<div className="recipe-feed-container">
      <div className="feed-header-block">
        <h2 className="feed-section-title">Trending Recipes</h2>
        <span className="trending-badge">🔥 Community Hotlist</span>
      </div>
      
      <hr className="feed-section-divider" />

      <div className="recipe-feed-grid">
        {data?.recipes?.map((recipe) => (
          <Link key={recipe.id} to={`recipes/${recipe.id}`} className="feed-card-link">
            <article className="recipe-card">
              
              <div className="feed-card-image-wrap">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="avatar-image-src"
                />
                <div className="feed-card-image-blur-layer"></div>
              </div>

              <div className="feed-card-details">
                <h3 className="feed-recipe-title">{recipe.title}</h3>
                
                <div className="feed-recipe-meta">
                  <span className="feed-author">By {recipe.author}</span>
                  <span className="meta-bullet">•</span>
                  <span className="feed-date">{formatDate(recipe.created_at)}</span>
                </div>

                <div className="feed-card-action">
                  <span className="view-recipe-text">Read Recipe</span>
                  <span className="arrow-indicator">→</span>
                </div>
              </div>

            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
