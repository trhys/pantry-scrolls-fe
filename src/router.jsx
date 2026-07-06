import { createBrowserRouter } from 'react-router'
import GlobalErrorBoundary from './errorBoundary.jsx'
import App from './App.jsx'
import { NotFound404, ServerError500 } from './components/error.jsx'
import Home from './pages/home.jsx'
import Recipe from './pages/recipe.jsx'
import Explorer from './pages/explore.jsx'
import { RecipeCreator } from './pages/create.jsx'
import { Login, Signup } from './pages/auth.jsx'
import { ShoppingListsPage, ShoppingList } from './pages/shoppingLists.jsx'
import { UserProfile } from './pages/user.jsx'
import Terms from './pages/terms.jsx'
import Privacy from './pages/privacy.jsx'
import Settings from './pages/settings.jsx'
import Admin from './pages/admin.jsx'
import { VerificationPage } from './pages/verify.jsx'
import Contact from './pages/contact.jsx'

const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		ErrorBoundary: GlobalErrorBoundary,
		children: [
			{ index: true, Component: Home },
            { path: "admin", Component: Admin },
            { path: "contact", Component: Contact },
            { path: "terms", Component: Terms },
            { path: "privacy", Component: Privacy },
            { path: "settings", Component: Settings },
            { path: "explore", Component: Explorer },
			{ path: "recipes/:id", Component: Recipe },
			{ path: "login", Component: Login },
			{ path: "signup", Component: Signup },
			{ path: "recipe-creator", Component: RecipeCreator },
			{ path: "shopping-lists", Component: ShoppingListsPage },
			{ path: "shopping-lists/:id", Component: ShoppingList },
			{ path: "profile", Component: UserProfile },
			{ path: "recipes/:id/edit", Component: RecipeCreator },
            { path: "verify/:token", Component: VerificationPage }
		],
	},
])

export default router;
