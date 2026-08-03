export function createEmptyDraft() {
    return {
        title: '',
        image: null,
        preview: null,
        description: '',
        instructions: '',
        ingredients: [],
    }
}

export function createDraftFromRecipe(recipeData) {
    return {
        title: recipeData.title ?? '',
        image: null,
        preview: recipeData.image_url ?? null,
        description: recipeData.description ?? '',
        instructions: recipeData.instructions ?? '',
        ingredients: (recipeData.ingredients ?? []).map((ing, index) => ({
            rowID: index + 1,
            id: ing.id,
            quantity: ing.quantity,
            units: ing.unit,
        })),
    }
}
