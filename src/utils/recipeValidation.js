export function validateRecipeDraft(draft) {
    const errors = []

    const selectedIngredients = draft.ingredients.filter((row) => Boolean(row.id))
    if (selectedIngredients.length === 0) {
        errors.push('Select at least one ingredient before scribing.')
    }

    return { valid: errors.length === 0, errors }
}
