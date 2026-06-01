import { useState } from 'react'
import { useExploreFeed } from '../api/recipes.js'
import './explore.css'

export default function Explore() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')

  const { data, error, isLoading, mutate } = useExploreFeed(search)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query === '') return
    setSearch(query)
    mutate()
  }

  return (
    <div className="explore-container">
      
      <header className="explore-search-banner">
        <div className="search-banner-content">
          <h1 className="explore-title">Explore Recipes</h1>
          <p className="explore-subtitle">Discover community creations and culinary inspiration</p>
          
          <div className="explore-search-wrapper">
            <input 
              type="text" 
              placeholder="Search recipes, ingredients, or creators..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="explore-search-input" 
            />
            <button className="search-icon-badge" onClick={(e) => handleSearch(e)}>🔍</button>
          </div>
        </div>
      </header>

      <main className="explore-content-grid">
        {data?.recipes?.map((recipe) => (
          <article key={recipe.id} className="recipe-explore-card">
            
            <div className="recipe-card-media">
              <img src={recipe.image_url} alt={recipe.title} className="avatar-image-src" />
              <div className="recipe-card-overlay">
                <span className="recipe-likes-badge">❤️ </span>
              </div>
            </div>

            <div className="recipe-card-body">
              <span className="recipe-author">By @{recipe.author}</span>
              <h4 className="recipe-card-title">{recipe.title}</h4>
              
              <div className="recipe-card-footer">
                <a href={`/recipes/${recipe.id}`} className="view-recipe-link">
                  View Details <span className="arrow-indicator">→</span>
                </a>
              </div>
            </div>

          </article>
        ))}
      </main>

    </div>
  );
}
