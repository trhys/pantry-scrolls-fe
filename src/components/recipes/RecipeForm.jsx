import { useRecipeDraft } from '../../hooks/useRecipeDraft.js'
import { validateRecipeDraft } from '../../utils/recipeValidation.js'
import IngredientPicker from './IngredientPicker.jsx'
import SelectedIngredientsList from './SelectedIngredientsList.jsx'
import '../../pages/create.css'

export default function RecipeForm({ initialDraft, availableIngredients, onSubmit, onCancel, editor }) {
    const { draft, dispatch } = useRecipeDraft(initialDraft)

    const selectedIngredientIds = new Set(draft.ingredients.map((row) => row.id))

    function handleSetImage(e) {
        const file = e.target.files[0]
        const allowedTypes = ['image/jpeg', 'image/png']

        if (!file || !allowedTypes.includes(file.type)) {
            if (draft.preview && draft.image) URL.revokeObjectURL(draft.preview)
            dispatch({ type: 'SET_IMAGE', file: null, preview: null })
            e.target.value = ''
            return
        }

        if (draft.preview && draft.image) URL.revokeObjectURL(draft.preview)
        const objectUrl = URL.createObjectURL(file)
        dispatch({ type: 'SET_IMAGE', file, preview: objectUrl })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const { valid, errors } = validateRecipeDraft(draft)
        if (!valid) {
            alert(errors[0])
            return
        }

        const selectedIngredients = draft.ingredients.filter((row) => Boolean(row.id))
        await onSubmit({ ...draft, ingredients: selectedIngredients })
    }

    return (
        <form onSubmit={handleSubmit} className="creator-workspace parchment-scroll">

            {!editor && (
                <div className="tip-callout">
                    <span className="tip-callout-icon">📖</span>
                    <div className="tip-callout-body">
                        <span className="tip-callout-title">Scribing a New Recipe</span>
                        Fill in a <strong>title</strong>, upload an <strong>illustration</strong> (JPG or PNG),
                        then add each <strong>ingredient</strong> with its quantity and unit. Use the{' '}
                        <strong>Description</strong> field for context or flavour notes, and{' '}
                        <strong>Instructions</strong> for step-by-step preparation. When ready, press{' '}
                        <em>📜 Scribe</em> to publish your scroll.
                    </div>
                </div>
            )}

            <input
                className="recipe-title-input"
                type="text"
                value={draft.title}
                placeholder="Name your recipe..."
                onChange={(e) => dispatch({ type: 'SET_TITLE', value: e.target.value })}
                required
            />

            <div className="image-upload-frame">
                <label className="image-upload-label">
                    {draft.preview ? (
                        <div className="preview-container">
                            <img src={draft.preview} alt="Formulation Preview" className="image-preview" />
                            <div className="change-image-overlay">Replace Illustration</div>
                        </div>
                    ) : (
                        <>
                            <strong>📷 Scribe an Illustration for this Scroll</strong>
                            <span>Drop or tap to import illustration (JPG, PNG)</span>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden-file-input"
                        onChange={handleSetImage}
                        accept=".jpg, .jpeg, .png"
                    />
                </label>
            </div>

            <div className="ingredient-forge-section">
                <label>Ingredients</label>
                <hr />

                <div className="ingredients-stack">
                    <IngredientPicker
                        availableIngredients={availableIngredients}
                        selectedIngredientIds={selectedIngredientIds}
                        onToggleIngredient={(id, checked) =>
                            dispatch({ type: 'TOGGLE_INGREDIENT', ingredientId: id, checked })
                        }
                    />

                    <SelectedIngredientsList
                        rows={draft.ingredients}
                        availableIngredients={availableIngredients}
                        onQuantityChange={(rowID, value) =>
                            dispatch({ type: 'UPDATE_INGREDIENT_QUANTITY', rowID, value })
                        }
                        onUnitChange={(rowID, unit) =>
                            dispatch({ type: 'UPDATE_INGREDIENT_UNIT', rowID, unit })
                        }
                        onRemove={(rowID) => dispatch({ type: 'REMOVE_INGREDIENT', rowID })}
                        editorMode={editor}
                    />
                </div>
                <hr />
            </div>

            <label className="form-label-block">Description</label>
            <textarea
                placeholder="Provide historical context or flavor profiles for this feast..."
                value={draft.description}
                onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', value: e.target.value })}
            />

            <label className="form-label-block">Instructions</label>
            <textarea
                placeholder="Step-by-step instructions to combine ingredients successfully..."
                value={draft.instructions}
                onChange={(e) => dispatch({ type: 'SET_INSTRUCTIONS', value: e.target.value })}
            />

            <button type="submit" className="forge-submit-btn">
                {editor ? '⚔️ Amend' : '📜 Scribe'}
            </button>
            {editor && onCancel && (
                <button type="button" className="cancel-btn" onClick={onCancel}>
                    ✕ Cancel
                </button>
            )}
        </form>
    )
}
