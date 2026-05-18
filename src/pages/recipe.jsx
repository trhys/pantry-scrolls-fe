import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGetRecipe } from '../api/recipes.js'
import { useGetShoppingLists, postAddRecipeToList } from '../api/shoppingLists.js'
import { useAuth } from '../components/auth.jsx'
import './recipe.css'
import formatDate from '../utility/format.js'

export default function Recipe() {
    const { user } = useAuth()
    const navigate = useNavigate()
	let params = useParams()
	const { data, error, isLoading } = useGetRecipe(params.id)

	/* Get shopping lists for adding */
	const { data: listData, error: listError } = useGetShoppingLists(user)

	const [showAddModal, setShowAddModal] = useState(false)
	const [selectedList, setSelectedList] = useState('')
	const [selectedQuantity, setSelectedQuantity] = useState(1)
    	const [isAdding, setIsAdding] = useState(false)

	if (isLoading) return (
		<div className="recipe-view">
            	<div className="skeleton recipe-hero-image" />
            	<div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '20px' }} />
            	<div className="skeleton" style={{ height: '100px', width: '100%' }} />
        	</div>
	)

	if (error) return <p>Something went wrong!</p>

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
		<div className="recipe-view">
		    <img src={data.image_url} className="recipe-hero-image" alt={data.title} />
		    
			<h2>{data.title}</h2><hr />	

		    <div className="recipe-meta">
			<strong>By:</strong> {data.author} <br />
			<strong>Created:</strong> {formatDate(data.created_at)} <br />
			<strong>Updated:</strong> {formatDate(data.updated_at)} <br /><br />
			<button 
			    type="button" 
			    className="open-add-modal-btn"
			    onClick={() => setShowAddModal(true)}
			>
			    ＋ Add to List
			</button>
		    </div>

		    <div className="recipe-text-block">{data.description}</div>

		    <h3>Ingredients</h3>
		    <hr />
		    <ul className="ingredients-section">
			{data.ingredients.map(ing => (
			    <li key={ing.name}>
				<span className="ing-name">{ing.name}</span>
				<span className="ing-count">{ing.quantity} {ing.unit}</span>
			    </li>
			))}
		    </ul>

		    <h3>Instructions</h3>
		    <hr />
		    <div className="recipe-text-block">{data.instructions}</div>
		</div>

			{showAddModal && (
			<div className="modal-overlay" onClick={() => setShowAddModal(false)}>
			    <div className="modal-content auth-card" onClick={e => e.stopPropagation()}> 

              {user ? (
                <>
                <h3>Add to Shopping List</h3>
				<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
				    Scale the ingredient quantities and assign them to an active list.
				</p>

				<form onSubmit={handleAddToList} className="modal-add-form">
				    <div className="form-group">
					<label>Shopping List</label>
					<select 
					    value={selectedList} 
					    onChange={(e) => setSelectedList(e.target.value)}
					    disabled={isAdding}
					    required
					>
					    <option value="">Select a list...</option>
					    {listData?.shopping_lists?.map(list => (
						<option key={list.id} value={list.id}>{list.name}</option>
					    ))}
					</select>
				    </div>

				    <div className="form-group">
					<label>Quantity</label>
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
					    Cancel
					</button>
					<button 
					    type="submit" 
					    className="submit-btn" 
					    disabled={isAdding || !selectedList}
					>
					    {isAdding ? 'Adding...' : 'Confirm Add'}
					</button>
				    </div>
				</form></>
              ) : (
                <>
                <h3>Login to add</h3>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => navigate("/login")}
                >Log In</button>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => navigate("/signup")}
                >Sign Up</button></>
              )}
			    </div>
			</div>
		    )}
		</>
	);
}
