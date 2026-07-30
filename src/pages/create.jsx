import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../components/auth.jsx'
import { useGetIngredients, useGetUnits, postRecipe, putRecipe, useGetRecipe } from '../api/recipes.js'
import './create.css'

function UnitSelect({ ingredientId, selectedUnit, onSelect }) {
    	const { data, error, isLoading } = useGetUnits(ingredientId);
	if (error) console.log(error)

    return (
        <select 
	    value={selectedUnit} 
	    onChange={(e) => onSelect(e.target.value)}
	    disabled={isLoading || !ingredientId}>

            <option value="">{!ingredientId ? '...' : 'Select units'}</option>
	    {data?.units.map((opt) => (
                <option key={opt.name} value={opt.name}>
                    {opt.name}
                </option>
            ))}

        </select>
    );
}

export function RecipeCreator() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	/* To enable an editor mode without writing a different component, I'm checking for a recipe id in the path.
	 * If there is no recipe id, editor state will be false and the useGetRecipe hook will return null */

	const params = useParams();
	const editor = Boolean(params.id);

	/* STATE */
	const [title, setTitle] = useState('')
	const [image, setImage] = useState(null)
	const [preview, setPreview] = useState(null)
	const [ingredients, setIngredients] = useState([{ rowID: Date.now(), id: '', quantity: 0, units: '' }])
	const [description, setDescription] = useState('')
	const [instructions, setInstructions] = useState('')
    	
	/* Get all ingredients from backend to populate select options */
	const { data: ingredientData, error: ingredientError, isLoading: ingredientIsLoading } = useGetIngredients()
	
	/* Get existing recipe data if in editor mode */
	const { data: editorData, error: editorError, isLoading: editorLoading } = useGetRecipe(params.id)
    const recipeData = editorData?.recipes?.[0]
  
	/* Here we'll useEffect to set all the state if we are editing */
	useEffect(() => {
		if (editor && recipeData) {
			setTitle(recipeData.title)
			setDescription(recipeData.description)
			setInstructions(recipeData.instructions)
			setPreview(recipeData.image_url)

			if (recipeData.ingredients) {
				const loadedRows = recipeData.ingredients.map((ing, index) => ({
					rowID: Date.now() + index, 
					id: ing.id,
					quantity: ing.quantity,
					units: ing.unit
				}))
                        	setIngredients(loadedRows)
			}
		} else if (!editor) {
			setTitle('');
			setDescription('');
			setInstructions('');
			setImage(null);
			setPreview(null);
			setIngredients([{ rowID: Date.now(), id: '', quantity: 1, units: '' }]);
		}
	}, [editor, editorData])

	if (editorLoading || ingredientIsLoading) {
	    return (
	      <div className="creator-workspace parchment-scroll animate-pulse flex items-center justify-center min-h-[400px]">
	        <p className="font-['MedievalSharp'] text-xl text-[#5c4331]">Preparing inkwells...</p>
	      </div>
	    );
	}

  if (ingredientError || editorError) {
    console.error(`ERROR - useGetIngredients error: ${ingredientError} --- useGetRecipe error: ${editorError}`);
    return <p className="text-center text-red-400 font-['MedievalSharp']">Something went wrong while retrieving records.</p>;
  }

	async function handleSubmit(e) {
		e.preventDefault()

		let result = !editor 
			? await postRecipe(title, image, ingredients, description, instructions)
			: await putRecipe(params.id, title, image, ingredients, description, instructions)

		let { id, ok, message } = result

		if (ok) {
			if (editor) navigate(`/recipes/${params.id}`)
			else navigate(`/recipes/${id}`)
		} else alert(`Failed! ${message}`)
	}

	function handleSelectIngredient(rowID, id) {
		setIngredients(ingredients.map(row => row.rowID === rowID ? {...row, id: id } : row))
	}

	function handleSelectQuantity(rowID, value) {
		setIngredients(ingredients.map(row => row.rowID === rowID ? {...row, quantity: value } : row))
	}

    	function handleSelectUnits(rowID, unit) {
        	setIngredients(ingredients.map(row => row.rowID === rowID ? {...row, units: unit } : row))
    	}

	const handleSelectImage = (e) => {
		const file = e.target.files[0]
		const allowedTypes = ['image/jpeg', 'image/png']

		if (!file || !allowedTypes.includes(file.type)) {
			if (preview) URL.revokeObjectURL(preview)
			setImage(null)
			setPreview(null)
			e.target.value = ''
			return
		}

		if (preview) URL.revokeObjectURL(preview)
		const objectUrl = URL.createObjectURL(file)
		setImage(file)
		setPreview(objectUrl)
	}

	const addRow = (e) => {
		e.preventDefault()
		let rowID = Date.now()
		setIngredients([...ingredients, { rowID: rowID, id: '', quantity: 0, units: '' }])
	}

	const removeRow = (rowID) => {
	    if (ingredients.length > 1) {
		    setIngredients(ingredients.filter((row) => row.rowID !== rowID))
	    }
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
        value={title}
        placeholder="Name your recipe..."
        onChange={e => setTitle(e.target.value)}
        required
      />

      <div className="image-upload-frame">
        <label className="image-upload-label">
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Formulation Preview" className="image-preview" />
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
            onChange={handleSelectImage}
            accept=".jpg, .jpeg, .png"
          />
        </label>
      </div>

      <div className="ingredient-forge-section">
        <label>Ingredients</label>
        <hr />
        
        <div className="ingredients-stack">
          {ingredients.map((row) => (
            <div key={row.rowID} className="ingredient-row">
              <select
                value={row.id}
                onChange={e => handleSelectIngredient(row.rowID, e.target.value)}
                disabled={ingredientIsLoading}
              >
                <option value="">{ingredientIsLoading ? 'Loading ingredients...' : 'Select an ingredient...'}</option>
                {ingredientData?.ingredients.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={row.quantity}
                placeholder="1"
                min="1"
                onChange={e => handleSelectQuantity(row.rowID, e.target.value)}
                required
              />
          
              <UnitSelect
                key={`${row.rowID}-${row.id}`}
                ingredientId={row.id}
                selectedUnit={row.units}
                onSelect={(unit) => handleSelectUnits(row.rowID, unit)}
              />

              <button className="rm-btn" type="button" onClick={() => removeRow(row.rowID)}>×</button>
            </div>
          ))}
        </div>

        <button className="add-btn-secondary" type="button" onClick={addRow}>
          ＋ Add
        </button>
        <hr />
      </div>

      <label className="form-label-block">Description</label>
      <textarea 
        placeholder="Provide historical context or flavor profiles for this feast..." 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
      />
      
      <label className="form-label-block">Instructions</label>
      <textarea 
        placeholder="Step-by-step instructions to combine ingredients successfully..." 
        value={instructions} 
        onChange={e => setInstructions(e.target.value)} 
      />

      <button type="submit" className="forge-submit-btn">
        {editor ? '⚔️ Amend' : '📜 Scribe'}
      </button>

    </form>
  );
}
