import { useState } from 'react'
import { useAuth } from '../components/auth.jsx' 
import { useGetUserProfile, updateSetUserAvatar } from '../api/users.js'  
import { useGetShoppingLists } from '../api/shoppingLists.js'
import { deleteRecipe } from '../api/recipes.js'
import { Link } from 'react-router'
import './user.css'

export function UserProfile() {
    const { user } = useAuth()
    const { data: userData, error, isLoading: userLoading, mutate } = useGetUserProfile(user.id)

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    if (!user) return <p className="status-text">Please log in to view your profile.</p>

    if (userLoading) return <p>Loading</p>

	const handleSelectImage = (e) => {
		const file = e.target.files[0]
		const allowedTypes = ['image/jpeg', 'image/png']

		if (!file || !allowedTypes.includes(file.type)) {
			if (preview) URL.revokeObjectURL(preview)
			setImage(null)
			setPreview(null)
			e.target.value = ''
			return
		}

		if (preview) URL.revokeObjectURL(preview)
		const objectUrl = URL.createObjectURL(file)
		setImage(file)
		setPreview(objectUrl)
	}

	const handleSubmitImage = async (e) => {
		if (!image) return

		setIsSaving(true)
		let { ok, message } = await updateSetUserAvatar(image)
		setIsSaving(false)
		if (ok) {
			setImage(null)
			setPreview(null)
			mutate()
		} else {
			alert(message)
		}
	}

	const triggerDelete = (e, id) => {
		e.preventDefault()
		setDeleteTarget(id)
	}

	const handleDelete = async () => {
		if (!deleteTarget) return

		let { ok, message } = await deleteRecipe(deleteTarget)

		if (ok) {
			setDeleteTarget(null)
			mutate()
		} else {
			alert(`Failed! ${message}`)
		}
	}

    return (
	    <>
        <div className="profile-container">
            <header className="profile-header">
	    <label className="profile-avatar-upload-label" title="Click to change avatar">
		<div className="profile-avatar-large">
		    {preview ? (
			<img src={preview} alt="User Avatar" className="avatar-image-src" />
		    ) : user.image_url ? (
			<img src={user.image_url} alt="User Avatar" className="avatar-image-src" />
		    ) : (
			user.name.charAt(0)
		    )}
		    <div className="avatar-edit-overlay">Change</div>
		</div>
		<input 
		    type="file" 
		    className="hidden-file-input" 
		    onChange={handleSelectImage} 
		    accept=".jpg, .jpeg, .png" 
		/>
	    </label>

	    <div>
		<h2>{user.name}</h2>
		<p className="profile-email">{user.email || 'chef@thereciperepo.com'}</p>
	   	</div>

		{image && (
		    <button 
			type="button" 
			className="save-profile-btn" 
			onClick={handleSubmitImage}
			disabled={isSaving}
		    >
			{isSaving ? 'Saving...' : 'Save New Avatar'}
		    </button>
		)}
	</header>


            <div className="profile-stats-grid">
                <div className="stat-card">
                    <span className="stat-number">{userData.recipes.length}</span>
                    <span className="stat-label">Recipes Shared</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{userData.shopping_lists.length}</span>
                    <span className="stat-label">Active Lists</span>
                </div>
            </div>

            <div className="profile-dashboard-layout">
                <section className="profile-section">
                    <h3>Your Shared Recipes</h3>
                    <hr />
                    {userLoading ? <div className="skeleton" style={{ height: '100px' }} /> : (
                        <div className="profile-recipes-list">
                            {userData.length === 0 ? (
                                <p className="empty-section-text">You haven't created any recipes yet.</p>
                            ) : (
                                userData.recipes.map(recipe => (
                                    <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="profile-recipe-item">
                                        <img src={recipe.image_url} alt={recipe.title} />
                                        <div className="profile-recipe-details">
                                            <h4>{recipe.title}</h4>
                                        </div>
					<div className="list-actions-wrapper">
						<div className="recipe-list-btns">
						<Link to={`/recipes/${recipe.id}/edit`} className="edit-recipe-link">
						<button 
						    type="button" 
						    className="edit-recipe-btn"
						    title="Edit Recipe"
						>
						    ✎	
						</button>
						</Link>
						<button 
						    type="button" 
						    className="delete-recipe-btn"
						    onClick={(e) => triggerDelete(e, recipe.id)}
						    title="Delete Recipe"
						>
						    🗑️
						</button>
						</div>
						<div className="list-arrow">→</div>
				    </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </section>

                <section className="profile-section">
                    <h3>Recent Shopping Lists</h3>
                    <hr />
                    {userLoading ? <div className="skeleton" style={{ height: '100px' }} /> : (
                        <div className="profile-lists-stack">
                            {userData.length === 0 ? (
                                <p className="empty-section-text">No active shopping lists found.</p>
                            ) : (
                                userData.shopping_lists.slice(0, 3).map(list => (
                                    <Link to={`/shopping-lists/${list.id}`} key={list.id} className="profile-list-item">
                                        <span>📋 {list.name}</span>
                                        <span className="arrow-indicator">→</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
	</div>
	    {deleteTarget && (
                    <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                        <div className="modal-content auth-card" onClick={e => e.stopPropagation()}> 
                            <h3>Delete this recipe?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem 0' }}>
                                This action cannot be undone.
                            </p>
                            
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="cancel-btn-secondary" 
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="danger-btn" 
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

