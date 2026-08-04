function UnitSelect({ ingredientId, selectedUnit, units, isLoading, onSelect }) {
    const showCurrentUnit = isLoading && selectedUnit && !units.some((u) => u.name === selectedUnit)

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
            {units.map((opt) => (
                <option key={opt.name} value={opt.name}>
                    {opt.name}
                </option>
            ))}
        </select>
    )
}

export default function SelectedIngredientRow({ row, ingredientName, units, unitsLoading, onQuantityChange, onUnitChange, onRemove }) {
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
                units={units}
                isLoading={unitsLoading}
                onSelect={(unit) => onUnitChange(row.rowID, unit)}
            />

            <button className="rm-btn" type="button" onClick={() => onRemove(row.rowID)}>×</button>
        </div>
    )
}
