import { useEffect, useState } from 'react'
import { useExploreFeed } from '../api/recipes.js'
import LikeButton from '../components/LikeButton.jsx'
import './explore.css'

export default function Explore() {
  const [mode, setMode] = useState('title')
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [expandedCards, setExpandedCards] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input)
    }, 300)

    return () => clearTimeout(timer)
  }, [input])

  const filters =
    mode === 'author'
      ? { author: debouncedInput }
      : mode === 'tag'
        ? { tag: debouncedInput }
        : { title: debouncedInput }

  const { data, error, isLoading } = useExploreFeed(filters)

  const toggleExpandedTags = (recipeId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }))
  }

  return (
    <div className="explore-container">
      
      <header className="explore-search-banner">
        <div className="search-banner-content">
          <h1 className="explore-title">Explore Recipes</h1>
          <p className="explore-subtitle">Discover community creations and culinary inspiration</p>
          
          <div className="explore-search-wrapper">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="explore-search-select"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="tag">Tag</option>
            </select>
            <input 
              type="text" 
              placeholder={
                mode === 'author'
                  ? 'Search by author...'
                  : mode === 'tag'
                    ? 'Search by tag...'
                    : 'Search by recipe title...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="explore-search-input" 
            />
          </div>
          <p className="explore-search-help">
            Search by title, author, or tag. Leave search blank to browse the latest recipes.
          </p>
        </div>
      </header>

      {isLoading && <p className="explore-feedback">Loading recipes...</p>}
      {error && <p className="explore-feedback">Could not load recipes right now.</p>}

      <main className="explore-content-grid">
        {data?.recipes?.map((recipe) => (
          <article key={recipe.id} className="recipe-explore-card">
            
            <div className="recipe-card-media">
              <img src={recipe.image_url} alt={recipe.title} className="avatar-image-src" />
              <div className="recipe-card-overlay">
                <LikeButton
                  recipeId={recipe.id}
                  initialLiked={recipe.liked ?? false}
                  initialCount={recipe.likes ?? 0}
                />
              </div>
            </div>

            <div className="recipe-card-body">
              <span className="recipe-author">By @{recipe.author}</span>
              <h4 className="recipe-card-title">{recipe.title}</h4>

              {recipe.tags?.length > 0 && (
                <div className="recipe-card-tags">
                  {(expandedCards[recipe.id] ? recipe.tags : recipe.tags.slice(0, 3)).map((tag) => (
                    <span key={`${recipe.id}-${tag}`} className="recipe-tag-chip">
                      #{tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <button
                      type="button"
                      className="recipe-tags-toggle"
                      onClick={() => toggleExpandedTags(recipe.id)}
                    >
                      {expandedCards[recipe.id] ? 'See less' : `See more (${recipe.tags.length - 3})`}
                    </button>
                  )}
                </div>
              )}
              
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
