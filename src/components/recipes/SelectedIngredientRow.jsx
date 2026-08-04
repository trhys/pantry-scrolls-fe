import { useGetUnits } from '../../api/recipes.js'

function UnitSelect({ ingredientId, selectedUnit, onSelect }) {
    const { data, error, isLoading } = useGetUnits(ingredientId)
    if (error) console.log(error)

    const loadedUnits = data?.units ?? []
    const showCurrentUnit = isLoading && selectedUnit && !loadedUnits.some((u) => u.name === selectedUnit)

    return (
        <select
            value={selectedUnit}
            onChange={(e) => onSelect(e.target.value)}
            disabled={isLoading || !ingredientId}
        >
            <option value="">{!ingredientId ? '...' : 'Select units'}</option>
            {showCurrentUnit && (
                <option key={selectedUnit} value={selectedUnit}>{selectedUnit}</option>
            )}
            {loadedUnits.map((opt) => (
                <option key={opt.name} value={opt.name}>
                    {opt.name}
                </option>
            ))}
        </select>
    )
}

export default function SelectedIngredientRow({ row, ingredientName, onQuantityChange, onUnitChange, onRemove }) {
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
                key={`${row.rowID}-${row.id}`}
                ingredientId={row.id}
                selectedUnit={row.units}
                onSelect={(unit) => onUnitChange(row.rowID, unit)}
            />

            <button className="rm-btn" type="button" onClick={() => onRemove(row.rowID)}>×</button>
        </div>
    )
}
