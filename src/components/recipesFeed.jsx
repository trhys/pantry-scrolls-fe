import { Link } from 'react-router'
import { useGetRecipeFeed } from '../api/recipes.js'
import formatDate from '../utility/format.js'

export default function RecipeFeed() {
	const { data, error, isLoading } = useGetRecipeFeed()
  const recipes = data?.recipes ?? []
  const [featuredRecipe, ...remainingRecipes] = recipes

	if (isLoading) return (
      <div className="recipe-feed-container">
        <div className="feed-header-block">
          <h2 className="feed-section-title">Recipe Feed</h2>
          <span className="trending-badge">🔥 Trending</span>
        </div>
        <hr className="feed-section-divider" />
        <div className="recipe-feed-layout">
          <div className="recipe-card skeleton-card featured-recipe-card">
            <div className="skeleton skeleton-image featured-skeleton-image"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-meta"></div>
          </div>
          <div className="recipe-feed-scroll-list">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="recipe-card skeleton-card compact-recipe-card">
                <div className="skeleton skeleton-image compact-skeleton-image"></div>
                <div className="compact-card-content">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

	if (error) return <p>Something went wrong!</p>

  return (
	<div className="recipe-feed-container">
      <div className="feed-header-block">
        <h2 className="feed-section-title">Recipe Feed</h2>
        <span className="trending-badge">🔥Trending</span>
      </div>
      
      <hr className="feed-section-divider" />

      {featuredRecipe ? (
        <div className="recipe-feed-layout">
          <Link to={`recipes/${featuredRecipe.id}`} className="feed-card-link featured-link">
            <article className="recipe-card featured-recipe-card">
              <div className="feed-card-image-wrap featured-image-wrap">
                <img
                  src={featuredRecipe.image_url}
                  alt={featuredRecipe.title}
                  className="avatar-image-src"
                />
                <div className="feed-card-image-blur-layer"></div>
              </div>

              <div className="feed-card-details">
                <h3 className="feed-recipe-title">{featuredRecipe.title}</h3>
                
                <div className="feed-recipe-meta">
                  <span className="feed-author">By {featuredRecipe.author}</span>
                  <span className="meta-bullet">•</span>
                  <span className="feed-date">{formatDate(featuredRecipe.created_at)}</span>
                </div>

                <div className="feed-card-action">
                  <span className="view-recipe-text">Read Recipe</span>
                  <span className="arrow-indicator">→</span>
                </div>
              </div>
            </article>
          </Link>

          <div className="recipe-feed-scroll-list">
            {remainingRecipes.map((recipe) => (
              <Link key={recipe.id} to={`recipes/${recipe.id}`} className="feed-card-link compact-link">
                <article className="recipe-card compact-recipe-card">
                  <div className="feed-card-image-wrap compact-image-wrap">
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="avatar-image-src"
                    />
                    <div className="feed-card-image-blur-layer"></div>
                  </div>

                  <div className="feed-card-details compact-card-details">
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
      ) : (
        <p className="empty-feed-copy">No trending recipes yet.</p>
      )}
    </div>
  );
}
