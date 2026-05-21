import { useRouteError, isRouteErrorResponse } from 'react-router'
import { NotFound404, ServerError500 } from './components/error.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

export default function GlobalErrorBoundary() {
  const error = useRouteError()

  let errorComponent = <ServerError500 />

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorComponent = <NotFound404 />
    }
  }

  console.error("Small Council intercepted a critical failure:", error);

  return (
    <div className="realm-layout">
      <Navbar />
      <main className="realm-container flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {errorComponent}
        </div>
      </main>
      <footer className="footer-keep">
        <Footer />
      </footer>
    </div>
  );
}
