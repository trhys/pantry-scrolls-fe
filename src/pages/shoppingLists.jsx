import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useAuth } from '../components/auth.jsx'
import { useGetShoppingLists, useGetSingleList, postCreateList, deleteList, useGetListItems } from '../api/shoppingLists.js'
import './shoppingLists.css'
import formatDate from '../utility/format.js'

export function ShoppingListsPage() {
	const { user, logout } = useAuth();

	/* create state */
	const [createModal, setCreateModal] = useState(false)
	const [newName, setNewName] = useState('')

	/* delete state */
	const [deleteTarget, setDeleteTarget] = useState(null)

	const { data, error, isLoading, mutate } = useGetShoppingLists(user)

	if (isLoading) return <p>Loading</p>
	if (error) {
		console.log(error)
		alert(`Something went wrong: ${error}`)
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
			<h2>Your Shopping Lists</h2>
			<button className="add-list-btn" onClick={() => setCreateModal(true)}>
			    + New List
			</button>
		    </header>

		    <div className="lists-grid">
			{data?.shopping_lists.map(list => (
			    <Link to={`/shopping-lists/${list.id}`} key={list.id} className="list-card">
				<div className="list-info">
				    <h3>{list.name}</h3>
				    <p>Last updated {formatDate(list.updated_at)}</p>
				</div>

				<div className="list-actions-wrapper">
				<button 
				    type="button" 
				    className="delete-list-btn"
				    onClick={(e) => triggerDelete(e, list.id)}
				    title="Delete List"
				>
				    🗑️
				</button>
				<div className="list-arrow">→</div>
			    </div>
			    </Link>
			))}
		    </div>
		</div>
	
		{createModal && (
			<div className="modal-overlay">
			    <div className="modal-content auth-card"> 
				<h3>Name your list</h3>
				<form onSubmit={handleCreateList} className="auth-form">
				    <input 
					autoFocus
					type="text" 
					placeholder="Title" 
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					required 
				    />
				    <div className="modal-actions">
					<button type="button" className="cancel-btn-secondary" onClick={() => setCreateModal(false)}>
					    Cancel
					</button>
					<button type="submit" className="submit-btn">
					    Create
					</button>
				    </div>
				</form>
			    </div>
			</div>
		)}

		{deleteTarget && (
		    <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
			<div className="modal-content auth-card" onClick={e => e.stopPropagation()}> 
			    <h3>Delete this list?</h3>
			    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem 0' }}>
				This action cannot be undone. All saved items within this list will be lost.
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
				    onClick={handleDeleteList}
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

export function ShoppingList() {
	let params = useParams()
	const { user, logout } = useAuth()

	const { data: listData, error, isLoading } = useGetSingleList(params.id)
	const { data: ingredients } = useGetListItems(params.id)

	if (isLoading) return <p>Loading</p>
	if (error) alert(error)

	return (
		<div className="single-list-container">
		    <div className="list-navigation">
			<Link to="/shopping-lists" className="back-link">← Back to Lists</Link>
			<h1>{listData?.name}</h1>
		    </div>

		    <div className="list-layout-grid">
			<main className="checklist-section">
			    <h3>Ingredients Checklist</h3>
			    <hr />
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
					    <span className="item-name">{item.name}</span>
					</label>
					<span className="item-amount">{item.quantity} {item.unit}</span>
				    </li>
				))}
			    </ul>
			</main>

			<aside className="linked-recipes-section">
			    <h3>Included Recipes</h3>
			    <hr />
			    <div className="recipe-links-stack">
				{listData.recipes.map(recipe => (
				    <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="mini-recipe-card">
					<span>{recipe.quantity}x {recipe.title}</span>
					<span className="mini-arrow">→</span>
				    </Link>
				))}
			    </div>
			</aside>
		    </div>
		</div>
	    );
}
