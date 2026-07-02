import { useRouteError, isRouteErrorResponse } from 'react-router'
import { NotFound404, ServerError500 } from './components/error.jsx'
import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'

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
        <div className="central-ledger">
          {errorComponent}
        </div>
      </main>
      <footer className="footer-keep">
        <Footer />
      </footer>
    </div>
  );
}
