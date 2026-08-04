import { useState, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL

function useLazyUnits(ingredientId) {
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)

    const fetchUnits = useCallback(async () => {
        if (fetched || !ingredientId) return
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/ingredients/units?id=${encodeURIComponent(ingredientId)}`)
            const data = res.ok ? await res.json() : {}
            setUnits(data?.units ?? [])
        } catch {
            setUnits([])
        } finally {
            setFetched(true)
            setLoading(false)
        }
    }, [ingredientId, fetched])

    return { units, loading, fetchUnits }
}

function UnitSelect({ ingredientId, selectedUnit, units, isLoading, onSelect, lazyFetch }) {
    const showCurrentUnit = selectedUnit && !units.some((u) => u.name === selectedUnit)

    return (
        <select
            value={selectedUnit}
            onChange={(e) => onSelect(e.target.value)}
            disabled={isLoading || !ingredientId}
            onMouseDown={lazyFetch}
            onFocus={lazyFetch}
        >
            <option value="">{!ingredientId ? '...' : 'Select units'}</option>
            {showCurrentUnit && (
                <option key={selectedUnit} value={selectedUnit}>{selectedUnit}</option>
            )}
            {units.map((opt) => (
                <option key={opt.name} value={opt.name}>
                    {opt.name}
                </option>
            ))}
        </select>
    )
}

export default function SelectedIngredientRow({ row, ingredientName, units, unitsLoading, onQuantityChange, onUnitChange, onRemove, editorMode }) {
    const lazy = useLazyUnits(editorMode ? row.id : null)

    const resolvedUnits = editorMode ? lazy.units : units
    const resolvedLoading = editorMode ? lazy.loading : unitsLoading
    const lazyFetch = editorMode ? lazy.fetchUnits : undefined

    return (
        <div className="ingredient-row">
            <span className="ingredient-row-name">{ingredientName}</span>

            <input
                type="number"
                value={row.quantity}
                placeholder="1"
                min="1"
                onChange={(e) => onQuantityChange(row.rowID, e.target.value)}
                required
            />

            <UnitSelect
                ingredientId={row.id}
                selectedUnit={row.units}
                units={resolvedUnits}
                isLoading={resolvedLoading}
                onSelect={(unit) => onUnitChange(row.rowID, unit)}
                lazyFetch={lazyFetch}
            />

            <button className="rm-btn" type="button" onClick={() => onRemove(row.rowID)}>×</button>
        </div>
    )
}
