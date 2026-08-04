import { useIngredientUnitsMap } from '../../hooks/useIngredientUnitsMap.js'
import SelectedIngredientRow from './SelectedIngredientRow.jsx'

export default function SelectedIngredientsList({ rows, availableIngredients, onQuantityChange, onUnitChange, onRemove, editorMode }) {
    const ingredientIds = editorMode ? [] : rows.map((row) => row.id)
    const { unitsMap, loading: unitsLoading } = useIngredientUnitsMap(ingredientIds)

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
                    unitsLoading={unitsLoading}
                    onQuantityChange={onQuantityChange}
                    onUnitChange={onUnitChange}
                    onRemove={onRemove}
                    editorMode={editorMode}
                />
            ))}
        </>
    )
}
