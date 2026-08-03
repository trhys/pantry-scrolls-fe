import { useState } from 'react'

export default function IngredientPicker({ availableIngredients, selectedIngredientIds, onToggleIngredient }) {
    const [searchValue, setSearchValue] = useState('')

    const visibleIngredients = availableIngredients.filter((opt) =>
        opt.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    return (
        <div className="ingredient-picker">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="ingredient-search-input"
                placeholder="Search ingredients..."
                aria-label="Search ingredients"
            />
            <div className="ingredient-picker-options">
                {visibleIngredients.map((opt) => (
                    <label key={opt.id} className="ingredient-picker-option">
                        <input
                            type="checkbox"
                            checked={selectedIngredientIds.has(opt.id)}
                            onChange={(e) => onToggleIngredient(opt.id, e.target.checked)}
                        />
                        <span>{opt.name}</span>
                    </label>
                ))}
                {visibleIngredients.length === 0 && (
                    <p className="ingredient-picker-empty">No ingredients found.</p>
                )}
            </div>
        </div>
    )
}
