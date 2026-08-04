import { useIngredientUnitsMap } from '../../hooks/useIngredientUnitsMap.js'
import SelectedIngredientRow from './SelectedIngredientRow.jsx'

export default function SelectedIngredientsList({ rows, availableIngredients, onQuantityChange, onUnitChange, onRemove }) {
    const ingredientIds = rows.map((row) => row.id)
    const { unitsMap } = useIngredientUnitsMap(ingredientIds)

    return (
        <>
            {rows.map((row) => (
                <SelectedIngredientRow
                    key={row.rowID}
                    row={row}
                    ingredientName={
                        availableIngredients.find((opt) => opt.id === row.id)?.name ?? 'Unknown ingredient'
                    }
                    units={unitsMap[row.id] ?? []}
                    onQuantityChange={onQuantityChange}
                    onUnitChange={onUnitChange}
                    onRemove={onRemove}
                />
            ))}
        </>
    )
}
