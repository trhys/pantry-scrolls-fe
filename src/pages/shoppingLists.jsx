import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useAuth } from '../components/auth.jsx'
import { useGetShoppingLists, useGetSingleList, postCreateList, deleteList, useGetListItems } from '../api/shoppingLists.js'
import formatDate from '../utility/format.js'
import './shoppingLists.css'

export function ShoppingListsPage() {
	const { user } = useAuth();

	/* create state */
	const [createModal, setCreateModal] = useState(false)
	const [newName, setNewName] = useState('')

	/* delete state */
	const [deleteTarget, setDeleteTarget] = useState(null)

	const { data, error, isLoading, mutate } = useGetShoppingLists(user)

	if (isLoading) {
    return (
      <div className="shopping-lists-container">
        <header className="page-header">
          <h2>Your Shopping Lists</h2>
        </header>
        <div className="lists-grid">
          {[1, 2, 3].map(n => (
            <div key={n} className="parchment-scroll list-card animate-pulse" style={{ height: '100px', opacity: 0.5 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <p className="text-center text-red-400 font-['MedievalSharp']">Failed to read the provisions logs from archives.</p>;
  }

	const handleCreateList = async (e) => {
		e.preventDefault()

		let { ok, message } = await postCreateList(newName)

		if (ok) {
			mutate()
			setCreateModal(false)
			setNewName('')
		} else alert(`Something went wrong: ${message}`)
	}

	const handleDeleteList = async () => {
		if (!deleteTarget) return
		
		let { ok, message } = await deleteList(deleteTarget)

		if (ok) {
			mutate()
			setDeleteTarget(null)
		} else alert(message)
	}

	const triggerDelete = (e, id) => {
		e.preventDefault()
		setDeleteTarget(id)
	}

	return (
    <>
      <div className="shopping-lists-container">
        <header className="page-header">
          <h2>Shopping Lists</h2>
          <button className="add-list-btn" onClick={() => setCreateModal(true)}>
            📜 Scribe New List
          </button>
        </header>

        <div className="lists-grid">
          {data?.shopping_lists?.length === 0 || !data?.shopping_lists ? (
            <div className="empty-lists-callout">
              <span className="empty-lists-icon">📜</span>
              <h3>Your ledgers are empty</h3>
              <p>No shopping lists have been created yet. Begin by creating your first list to organise recipes for your next feast.</p>
              <button className="add-list-btn" onClick={() => setCreateModal(true)}>
                ✦ Scribe Your First List
              </button>
            </div>
          ) : (
            data.shopping_lists.map(list => (
              <Link to={`/shopping-lists/${list.id}`} key={list.id} className="list-card parchment-scroll">
                <div className="list-info">
                  <h3>{list.name}</h3>
                  <p>Last amended {formatDate(list.updated_at)}</p>
                </div>

                <div className="list-actions-wrapper">
                  <button 
                    type="button" 
                    className="delete-list-btn"
                    onClick={(e) => triggerDelete(e, list.id)}
                    title="Incinerate Ledger"
                  >
                    🔥
                  </button>
                  <div className="list-arrow">🗡️</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
	
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}> 
            <h3>Scribe New List</h3>
            <p>Give a title to this shopping list before adding recipes.</p>
            
            <form onSubmit={handleCreateList} className="auth-form">
              <input 
                autoFocus
                type="text" 
                placeholder="E.g., Grand Feast Supplies" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required 
              />
              <div className="modal-actions">
                <button type="button" className="cancel-btn-secondary" onClick={() => setCreateModal(false)}>
                  Dismiss
                </button>
                <button type="submit" className="submit-btn">
                  Scribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}> 
            <h3>Incinerate This List?</h3>
            <p>This action cannot be undone. This scroll will turn to ash.</p>
            
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
                onClick={handleDeleteList}
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

export function ShoppingList() {
	let params = useParams()
	const { user } = useAuth()

	const { data: listData, error, isLoading } = useGetSingleList(params.id)
	const { data: ingredients } = useGetListItems(params.id)

	/* todo: implement toggle */
	const handleToggleCheck = (itemId) => {
	    console.log(`Item strike action triggered on item layout: ${itemId}`);
	};

  if (isLoading) {
    return (
      <div className="single-list-container animate-pulse">
        <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '24px', background: 'rgba(92, 64, 51, 0.2)' }} />
        <div className="checklist-section parchment-scroll" style={{ height: '300px' }} />
      </div>
    );
  }

  if (error) {
    alert(`The ledger data could not be compiled: ${error}`);
  }

  return (
    <div className="single-list-container">
      <div className="list-navigation">
        <Link to="/shopping-lists" className="back-link">🗡️ Return to Archives</Link>
        <h1>{listData?.name}</h1>
      </div>

      <div className="list-layout-grid">
        
        <main className="checklist-section parchment-scroll">
          <h3>Checklist</h3>
          <hr />

          <div className="tip-callout">
            <span className="tip-callout-icon">🖨️</span>
            <div className="tip-callout-body">
              <span className="tip-callout-title">Printing this Ledger</span>
              For a clean printout, open the Print dialog, enable{' '}
              <strong>Background graphics</strong>, set <strong>Margins</strong> to Minimum,
              and choose <strong>Portrait</strong> orientation.
            </div>
          </div>
          
          <ul className="checklist-items">
            {ingredients?.items?.map(item => (
              <li key={item.id} className={`checklist-item ${item.checked ? 'item-completed' : ''}`}>
                
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => handleToggleCheck(item.id)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="item-name">{item.name} --- </span>
                </label>
                
                <span className="item-amount">{item.quantity} {item.unit}</span>
              </li>
            ))}
          </ul>
        </main>

        <aside className="linked-recipes-section">
          <h3>Recipes</h3>
          <hr />
          
          <div className="recipe-links-stack">
            {listData?.recipes?.map(recipe => (
              <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="mini-recipe-card">
                <span>{recipe.quantity}x {recipe.title}</span>
              </Link>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
