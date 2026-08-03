import SelectedIngredientRow from './SelectedIngredientRow.jsx'

export default function SelectedIngredientsList({ rows, availableIngredients, onQuantityChange, onUnitChange, onRemove }) {
    return (
        <>
            {rows.map((row) => (
                <SelectedIngredientRow
                    key={row.rowID}
                    row={row}
                    ingredientName={
                        availableIngredients.find((opt) => opt.id === row.id)?.name ?? 'Unknown ingredient'
                    }
                    onQuantityChange={onQuantityChange}
                    onUnitChange={onUnitChange}
                    onRemove={onRemove}
                />
            ))}
        </>
    )
}
