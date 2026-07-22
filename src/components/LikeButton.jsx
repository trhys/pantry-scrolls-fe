import { useState } from 'react'
import { likeRecipe } from '../api/recipes.js'
import { useAuth } from './auth.jsx'
import './LikeButton.css'

/**
 * LikeButton — heart icon button with inline likes count.
 *
 * Props:
 *   recipeId   {string|number}  ID of the recipe
 *   initialLiked  {boolean}     Whether the current user has already liked it
 *   initialCount  {number}      Current likes count shown on mount
 *   onAuthRequired  {Function}  Optional callback invoked when a guest tries to like
 */
export default function LikeButton({ recipeId, initialLiked = false, initialCount = 0, onAuthRequired }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, setIsPending] = useState(false)

  const handleClick = async (e) => {
    // Prevent card link navigation when the button is inside an anchor
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      if (onAuthRequired) onAuthRequired()
      return
    }

    if (isPending) return

    // Optimistic update
    const nextLiked = !liked
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1)
    setLiked(nextLiked)
    setCount(nextCount)
    setIsPending(true)

    const { ok, liked: serverLiked, likes: serverLikes } = await likeRecipe(recipeId)

    setIsPending(false)

    if (!ok) {
      // Roll back on failure
      setLiked(liked)
      setCount(count)
    } else {
      // Sync with server values if provided
      if (serverLiked !== null) setLiked(serverLiked)
      if (serverLikes !== null) setCount(serverLikes)
    }
  }

  return (
    <button
      type="button"
      className={`like-btn${liked ? ' like-btn--liked' : ''}`}
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike recipe' : 'Like recipe'}
      disabled={isPending}
    >
      <span className="like-btn__icon" aria-hidden="true">
        {liked ? '♥' : '♡'}
      </span>
      <span className="like-btn__count">{count}</span>
    </button>
  )
}
