import { useNavigate, useParams } from 'react-router'
import { useGetIngredients, postRecipe, putRecipe, useGetRecipe } from '../api/recipes.js'
import { createEmptyDraft, createDraftFromRecipe } from '../utils/recipeDraft.js'
import RecipeForm from '../components/recipes/RecipeForm.jsx'
import './create.css'

export function RecipeCreator() {
    const navigate = useNavigate()
    const params = useParams()
    const editor = Boolean(params.id)

    const { data: ingredientData, error: ingredientError, isLoading: ingredientIsLoading } = useGetIngredients()
    const { data: editorData, error: editorError, isLoading: editorLoading } = useGetRecipe(params.id)

    if (editorLoading || ingredientIsLoading) {
        return (
            <div className="creator-workspace parchment-scroll animate-pulse flex items-center justify-center min-h-[400px]">
                <p className="font-['MedievalSharp'] text-xl text-[#5c4331]">Preparing inkwells...</p>
            </div>
        )
    }

    if (ingredientError || editorError) {
        console.error(`ERROR - useGetIngredients error: ${ingredientError} --- useGetRecipe error: ${editorError}`)
        return <p className="text-center text-red-400 font-['MedievalSharp']">Something went wrong while retrieving records.</p>
    }

    const recipeData = editorData?.recipes?.[0]
    const initialDraft = editor && recipeData ? createDraftFromRecipe(recipeData) : createEmptyDraft()
    const availableIngredients = ingredientData?.ingredients ?? []

    async function handleSubmit(draft) {
        const result = !editor
            ? await postRecipe(draft.title, draft.image, draft.ingredients, draft.description, draft.instructions)
            : await putRecipe(params.id, draft.title, draft.image, draft.ingredients, draft.description, draft.instructions)

        const { id, ok, message } = result

        if (ok) {
            if (editor) navigate(`/recipes/${params.id}`)
            else navigate(`/recipes/${id}`)
        } else alert(`Failed! ${message}`)
    }

    return (
        <RecipeForm
            key={params.id ?? 'create'}
            initialDraft={initialDraft}
            availableIngredients={availableIngredients}
            onSubmit={handleSubmit}
            onCancel={editor ? () => navigate(`/recipes/${params.id}`) : undefined}
            editor={editor}
        />
    )
}
