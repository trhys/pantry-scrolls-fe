import { useReducer } from 'react'
import { createEmptyDraft, createDraftFromRecipe } from '../utils/recipeDraft.js'

function recipeDraftReducer(state, action) {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.value }
        case 'SET_IMAGE':
            return { ...state, image: action.file, preview: action.preview }
        case 'SET_DESCRIPTION':
            return { ...state, description: action.value }
        case 'SET_INSTRUCTIONS':
            return { ...state, instructions: action.value }
        case 'TOGGLE_INGREDIENT': {
            const { ingredientId, checked } = action
            if (checked) {
                if (state.ingredients.some((row) => row.id === ingredientId)) return state
                const nextRowId = state.ingredients.length
                    ? Math.max(...state.ingredients.map((row) => row.rowID)) + 1
                    : 1
                return {
                    ...state,
                    ingredients: [
                        ...state.ingredients,
                        { rowID: nextRowId, id: ingredientId, quantity: 1, units: '' },
                    ],
                }
            }
            return {
                ...state,
                ingredients: state.ingredients.filter((row) => row.id !== ingredientId),
            }
        }
        case 'UPDATE_INGREDIENT_QUANTITY':
            return {
                ...state,
                ingredients: state.ingredients.map((row) =>
                    row.rowID === action.rowID ? { ...row, quantity: action.value } : row
                ),
            }
        case 'UPDATE_INGREDIENT_UNIT':
            return {
                ...state,
                ingredients: state.ingredients.map((row) =>
                    row.rowID === action.rowID ? { ...row, units: action.unit } : row
                ),
            }
        case 'REMOVE_INGREDIENT':
            return {
                ...state,
                ingredients: state.ingredients.filter((row) => row.rowID !== action.rowID),
            }
        default:
            return state
    }
}

function initDraft(initialData) {
    return initialData ? createDraftFromRecipe(initialData) : createEmptyDraft()
}

export function useRecipeDraft(initialData) {
    const [draft, dispatch] = useReducer(recipeDraftReducer, initialData, initDraft)
    return { draft, dispatch }
}
