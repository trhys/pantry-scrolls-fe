import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import router from './router.jsx'
import { AuthProvider } from './components/auth.jsx'
import { MaintenanceProvider } from './context/MaintenanceContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MaintenanceProvider>
        <RouterProvider router={router} />
      </MaintenanceProvider>
    </AuthProvider>
  </StrictMode>,
)
