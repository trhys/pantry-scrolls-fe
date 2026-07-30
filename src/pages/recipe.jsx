import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGetRecipe } from '../api/recipes.js'
import { useGetShoppingLists, postAddRecipeToList } from '../api/shoppingLists.js'
import { useAuth } from '../components/auth.jsx'
import LikeButton from '../components/LikeButton.jsx'
import formatDate from '../utility/format.js'
import './recipe.css'

export default function Recipe() {
    const { user } = useAuth()
    const navigate = useNavigate()
	let params = useParams()

	/* Get recipe data */
	const { data, error, isLoading } = useGetRecipe(params.id)

  const recipe = data?.recipes?.[0]

	/* Get shopping lists for adding */
	const { data: listData, error: listError } = useGetShoppingLists(user)

	const [showAddModal, setShowAddModal] = useState(false)
	const [selectedList, setSelectedList] = useState('')
	const [selectedQuantity, setSelectedQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

	if (isLoading) {
	    return (
	      <div className="recipe-view parchment-scroll animate-pulse">
	        <div className="skeleton recipe-hero-image" />
	        <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '20px', background: 'rgba(92, 64, 51, 0.2)' }} />
	        <div className="skeleton" style={{ height: '100px', width: '100%', background: 'rgba(92, 64, 51, 0.2)' }} />
	      </div>
	    );
	}

  if (error) {
    return <p className="text-center text-red-400 font-['MedievalSharp']">The formula could not be fetched from the archives.</p>;
  }

	const handleAddToList = async (e) => {
		e.preventDefault()
		if (!selectedList || selectedQuantity <= 0) return

		setIsAdding(true)

		let { ok, message } = await postAddRecipeToList(selectedList, params.id, selectedQuantity)

		setIsAdding(false)

		if (ok) {
			setShowAddModal(false)
			setSelectedList('')
			setSelectedQuantity(1)
			alert("Successfully added to list")
		} else {
			alert(`Failed: ${message}`)
		}
	}

	return (
    <>
      <div className="recipe-view parchment-scroll">
        <img src={recipe.image_url} className="recipe-hero-image" alt={recipe.title} />
        
        <div className="recipe-title-row">
          <h2>{recipe.title}</h2>
          <LikeButton
            recipeId={params.id}
            initialLiked={recipe.liked ?? false}
            initialCount={recipe.likes ?? 0}
            onAuthRequired={() => setShowAddModal(true)}
          />
        </div>
        <hr />	

        <div className="recipe-meta">
          <strong>Scribe:</strong> {recipe.author} <br />
          <strong>Penned:</strong> {formatDate(recipe.created_at)} <br />
          <strong>Amended:</strong> {formatDate(recipe.updated_at)} <br />
          <button 
            type="button" 
            className="open-add-modal-btn"
            onClick={() => setShowAddModal(true)}
          >
            ＋ Add to Shopping List
          </button>
        </div>

        <div className="tip-callout">
          <span className="tip-callout-icon">🖨️</span>
          <div className="tip-callout-body">
            <span className="tip-callout-title">Printing tip:</span>
            For best results, disable header/footers in print dialogue
            and choose <strong>Portrait</strong> orientation.
          </div>
        </div>

        <div className="recipe-text-block">{recipe.description}</div>

        <h3>Ingredients</h3>
        <hr />
        <ul className="ingredients-section">
          {recipe.ingredients?.map(ing => (
            <li key={ing.name}>
              <span className="ing-name">{ing.name}</span>
              <span className="ing-count">{ing.quantity} {ing.unit}</span>
            </li>
          ))}
        </ul>

        <h3>Instructions</h3>
        <hr />
        <div className="recipe-text-block">{recipe.instructions}</div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}> 
            {user ? (
              <>
                <h3>Assign to Shopping List</h3>
                <p>Scale the batch quantity and choose a list to add this recipe to.</p>

                <form onSubmit={handleAddToList} className="modal-add-form">
                  <div className="form-group">
                    <label>Shopping List</label>
                    <select 
                      value={selectedList} 
                      onChange={(e) => setSelectedList(e.target.value)}
                      disabled={isAdding}
                      required
                    >
                      <option value="">Select...</option>
                      {listData?.shopping_lists?.map(list => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Batch Multiplier</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(e.target.value)}
                      disabled={isAdding}
                      required
                    />
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn-secondary" 
                      onClick={() => setShowAddModal(false)}
                    >
                      Dismiss
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn" 
                      disabled={isAdding || !selectedList}
                    >
                      {isAdding ? 'Scribing...' : 'Confirm Assignment'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>Authentication Required</h3>
                <p>You must log in to use this function.</p>
                <div className="modal-actions flex-col gap-2 w-full">
                  <button
                    type="button"
                    className="submit-btn w-full"
                    onClick={() => navigate("/login")}
                  >
                    Enter the Archive
                  </button>
                  <button
                    type="button"
                    className="cancel-btn-secondary w-full"
                    onClick={() => navigate("/signup")}
                  >
                    Register
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
