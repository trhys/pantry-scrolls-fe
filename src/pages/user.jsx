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

    if (!user) {
	    return (
	      <div className="text-center py-12">
	        <p className="font-['MedievalSharp'] text-xl text-amber-500">You must log in to review your profile.</p>
	      </div>
	    );
	}

  if (userLoading) {
    return (
      <div className="profile-container animate-pulse">
        <div className="profile-header" style={{ height: '140px', background: 'rgba(43,29,17,0.2)' }} />
        <div className="profile-stats-grid">
          <div className="stat-card" style={{ height: '80px' }} />
          <div className="stat-card" style={{ height: '80px' }} />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-400 font-['MedievalSharp']">Failed to retrieve profile.</p>;

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
            <input 
              type="file" 
              className="hidden-file-input" 
              onChange={handleImageUpload} 
              accept=".jpg, .jpeg, .png" 
            />
          </label>

          <div className="flex-grow">
            <h2>{user.name}</h2>
            <p className="profile-email">{user.email || 'artisan@pantryscrolls.com'}</p>
          </div>

          {image && (
            <button 
              type="button" 
              className="save-profile-btn" 
              onClick={handleSubmitImage}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save new Avatar'}
            </button>
          )}
        </header>

        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-number">{userData?.recipes?.length || 0}</span>
            <span className="stat-label">Shared Recipes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userData?.shopping_lists?.length || 0}</span>
            <span className="stat-label">Active Ledgers</span>
          </div>
        </div>

        <div className="profile-dashboard-layout">
          
          <section className="profile-section">
            <h3>Your Recipes</h3>
            <hr />
            <div className="profile-recipes-list">
              {!userData?.recipes || userData.recipes.length === 0 ? (
                <p className="empty-section-text">You haven't scribed any recipe scrolls yet.</p>
              ) : (
                userData.recipes.map(recipe => (
                  <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="profile-recipe-item">
                    <img src={recipe.image_url} alt={recipe.title} />
                    <div className="profile-recipe-details flex-grow">
                      <h4>{recipe.title}</h4>
                    </div>
                    
                    <div className="list-actions-wrapper" onClick={(e) => e.stopPropagation()}>
                      <div className="recipe-list-btns">
                        <Link to={`/recipes/${recipe.id}/edit`} className="edit-recipe-link">
                          <button type="button" className="edit-recipe-btn" title="Amend Scroll">
                            ✎
                          </button>
                        </Link>
                        <button 
                          type="button" 
                          className="delete-recipe-btn"
                          onClick={(e) => triggerDelete(e, recipe.id)}
                          title="Incinerate Scroll"
                        >
                          🔥
                        </button>
                      </div>
                      <div className="list-arrow">🗡️</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="profile-section">
            <h3>Recent Ledgers</h3>
            <hr />
            <div className="profile-lists-stack">
              {!userData?.shopping_lists || userData.shopping_lists.length === 0 ? (
                <p className="empty-section-text">No active ledgers found.</p>
              ) : (
                userData.shopping_lists.slice(0, 3).map(list => (
                  <Link to={`/shopping-lists/${list.id}`} key={list.id} className="profile-list-item">
                    <span>📜 {list.name}</span>
                    <span className="list-arrow">🗡️</span>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}> 
            <h3>Incinerate This Scroll?</h3>
            <p>This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn-secondary" 
                onClick={() => setDeleteTarget(null)}
              >
                Keep Scroll
              </button>
              <button 
                type="button" 
                className="danger-btn" 
                onClick={handleDelete}
              >
                Burn Scroll
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

