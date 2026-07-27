# Pantry Scrolls — Frontend

A medieval-themed recipe ledger and provisions manager. Built with React 19, React Router 7, SWR, and Vite.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Recipes](#recipes)
  - [Shopping Lists](#shopping-lists)
  - [Users](#users)
  - [Messages](#messages)
  - [Maintenance](#maintenance)
  - [Metrics](#metrics)
  - [Verification](#verification)

---

## Getting Started

```bash
npm install
npm run dev
```

The dev server listens on all interfaces (`host: true`) and defaults to `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the project root:

| Variable       | Description                               | Example                        |
| -------------- | ----------------------------------------- | ------------------------------ |
| `VITE_API_URL` | Base URL of the Pantry Scrolls backend API | `https://api.pantryscrolls.com` |

All API calls are prefixed with `${VITE_API_URL}/api/...`.

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite development server  |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint                         |

## Pages & Routes

| Path                           | Component                  | Auth required |
| ------------------------------ | -------------------------- | ------------- |
| `/`                            | Home                       | No            |
| `/explore`                     | Explorer                   | No            |
| `/recipes/:id`                 | Recipe                     | No            |
| `/login`                       | Login                      | No            |
| `/signup`                      | Signup                     | No            |
| `/verify/:token`               | VerificationPage           | No            |
| `/resetpassword/:token`        | ResetPasswordPage          | No            |
| `/cancel-deactivation/:token`  | DeactivationCancellationPage | No          |
| `/contact`                     | Contact                    | No            |
| `/terms`                       | Terms                      | No            |
| `/privacy`                     | Privacy                    | No            |
| `/recipe-creator`              | RecipeCreator (create)     | Yes           |
| `/recipes/:id/edit`            | RecipeCreator (edit)       | Yes           |
| `/shopping-lists`              | ShoppingListsPage          | Yes           |
| `/shopping-lists/:id`          | ShoppingList               | Yes           |
| `/profile`                     | UserProfile                | Yes           |
| `/settings`                    | Settings                   | Yes           |
| `/admin`                       | Admin                      | Yes (admin)   |

---

## API Reference

All authenticated requests are sent with `credentials: 'include'` (HTTP-only session cookies). The `authFetcher` utility in `src/api/auth.js` automatically attempts a token refresh (`POST /api/tokens/refresh`) on a `401` response and retries the original request once.

### Authentication

#### `POST /api/sessions` — Login

```js
import { postLogin } from './src/api/auth.js'

const { ok, data, message } = await postLogin(email, password)
```

**Request body:** `{ email, password }`  
**Returns:** `{ ok: boolean, data?: object, message?: string }`

---

#### `POST /api/users` — Sign Up

```js
import { postSignup } from './src/api/auth.js'

const { ok, data, message } = await postSignup(email, password, name)
```

**Request body:** `{ email, password, name }`  
**Returns:** `{ ok: boolean, data?: object, message?: string }`

---

#### `GET /api/tokens/refresh` — Refresh Session

Called automatically by `authFetcher` on `401`. Not called directly.

---

### Recipes

#### `GET /api/recipes` — Recipe Feed (SWR hook)

```js
import { useGetRecipeFeed } from './src/api/recipes.js'

const { data, error, isLoading } = useGetRecipeFeed()
```

---

#### `GET /api/recipes?search=<query>` — Explore Feed (SWR hook)

```js
import { useExploreFeed } from './src/api/recipes.js'

const { data, error, isLoading, mutate } = useExploreFeed(query)
```

Falls back to the full recipe feed when `query` is an empty string.

---

#### `GET /api/recipes/:id` — Single Recipe (SWR hook)

```js
import { useGetRecipe } from './src/api/recipes.js'

const { data, error, isLoading } = useGetRecipe(id)
```

---

#### `GET /api/ingredients` — Ingredient List (SWR hook)

```js
import { useGetIngredients } from './src/api/recipes.js'

const { data, error, isLoading } = useGetIngredients()
```

---

#### `GET /api/ingredients/units?id=<ingredientId>` — Units for Ingredient (SWR hook)

```js
import { useGetUnits } from './src/api/recipes.js'

const { data, error, isLoading } = useGetUnits(ingredientId)
```

---

#### `POST /api/recipes` — Create Recipe

```js
import { postRecipe } from './src/api/recipes.js'

const { ok, id, message } = await postRecipe(title, image, ingredients, description, instructions)
```

**Request body:** multipart/form-data  
- `payload` — JSON string `{ title, ingredients: [{ id, quantity, unit }], description, instructions }`  
- `image` — image file  

**Returns:** `{ ok: boolean, id?: string, message?: string }`

---

#### `PUT /api/recipes/:id` — Update Recipe

```js
import { putRecipe } from './src/api/recipes.js'

const { ok, message } = await putRecipe(id, title, image, ingredients, description, instructions)
```

**Request body:** multipart/form-data  
- `payload` — JSON string (same shape as create)  
- `image` — image file (omitted if unchanged)  

**Returns:** `{ ok: boolean, message?: string }`

---

#### `DELETE /api/recipes/:id` — Delete Recipe

```js
import { deleteRecipe } from './src/api/recipes.js'

const { ok, message } = await deleteRecipe(id)
```

**Returns:** `{ ok: boolean, message?: string }`

---

### Shopping Lists

#### `GET /api/shoppinglists` — User's Lists (SWR hook)

```js
import { useGetShoppingLists } from './src/api/shoppingLists.js'

const { data, error, isLoading, mutate } = useGetShoppingLists(user)
```

Only fetches when `user` is truthy.

---

#### `GET /api/shoppinglists/:id` — Single List (SWR hook)

```js
import { useGetSingleList } from './src/api/shoppingLists.js'

const { data, error, isLoading } = useGetSingleList(id)
```

---

#### `GET /api/shoppinglists/:id/print` — Aggregated Ingredient List (SWR hook)

```js
import { useGetListItems } from './src/api/shoppingLists.js'

const { data, error, isLoading } = useGetListItems(id)
```

---

#### `POST /api/shoppinglists` — Create List

```js
import { postCreateList } from './src/api/shoppingLists.js'

const { ok, message } = await postCreateList(name)
```

**Request body:** `{ name }`  
**Returns:** `{ ok: boolean, message?: string }`

---

#### `POST /api/shoppinglists/:id` — Add Recipe to List

```js
import { postAddRecipeToList } from './src/api/shoppingLists.js'

const { ok, message } = await postAddRecipeToList(listId, recipeId, quantity)
```

**Request body:** `{ recipe_id, quantity }` (quantity is coerced to `int`)  
**Returns:** `{ ok: boolean, message?: string }`

---

#### `DELETE /api/shoppinglists/:id` — Delete List

```js
import { deleteList } from './src/api/shoppingLists.js'

const { ok, message } = await deleteList(id)
```

**Returns:** `{ ok: boolean, message?: string }`

---

### Users

#### `GET /api/users/:id` — User Profile (SWR hook)

```js
import { useGetUserProfile } from './src/api/users.js'

const { data, error, isLoading, mutate } = useGetUserProfile(id)
```

---

#### `PUT /api/users` — Update Avatar

```js
import { updateSetUserAvatar } from './src/api/users.js'

const { ok, message } = await updateSetUserAvatar(file)
```

**Request body:** multipart/form-data — `image` field  
**Returns:** `{ ok: boolean, message?: string }`

---

#### `PUT /api/users/:id/deactivate` — Request Account Deactivation

```js
import { useAccountDeactivation } from './src/api/users.js'

const { ok, message } = await useAccountDeactivation(id)
```

**Returns:** `{ ok: boolean, message: string }`

---

#### `PUT /api/deactivation/cancel` — Cancel Account Deactivation

```js
import { useCancelDeactivation } from './src/api/users.js'

const { ok, message } = await useCancelDeactivation(token)
```

**Request body:** `{ token }`  
**Returns:** `{ ok: boolean, message: string }`

---

### Messages

#### `POST /api/messages` — Send Contact Message

```js
import { postMessage } from './src/api/messages.js'

const { ok, message } = await postMessage(email, message)
```

**Request body:** `{ email, message }` (both trimmed)  
**Returns:** `{ ok: boolean, message?: string }`

---

### Maintenance

#### `GET /api/config/maintenance` — Get Maintenance Status (SWR hook)

```js
import { useGetMaintenanceStatus } from './src/api/maintenance.js'

const { data, error, isLoading, mutate } = useGetMaintenanceStatus()
```

Polls every **30 seconds**. Does not retry on error.

---

#### `PUT /api/config/maintenance` — Update Maintenance Status

```js
import { putMaintenanceStatus } from './src/api/maintenance.js'

const { ok, data, message } = await putMaintenanceStatus(active, message)
```

**Request body:** `{ active: boolean, message: string }`  
**Returns:** `{ ok: boolean, data?: object, message?: string }`

---

### Metrics

> These hooks use a relative URL path (no `VITE_API_URL` prefix) and are intended for admin/analytics use.

#### `GET /api/users` — Total User Count (SWR hook)

```js
import { useGetTotalUsers } from './src/api/metrics.jsx'

const { totalUsers, error, isLoading } = useGetTotalUsers()
```

**Returns:** `totalUsers` from `data.total`

---

#### `GET /api/recipes?total=true` — Total Recipe Count (SWR hook)

```js
import { useGetTotalRecipes } from './src/api/metrics.jsx'

const { totalRecipes, error, isLoading } = useGetTotalRecipes()
```

**Returns:** `totalRecipes` from `data.total`

---

### Verification

#### `GET /api/verify/:token` — Verify Email Token (SWR hook)

```js
import { useGetVerification } from './src/api/verification.js'

const { error, isLoading } = useGetVerification(token)
```
