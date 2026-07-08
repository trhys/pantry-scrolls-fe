import { createContext, useContext, useState, useEffect } from 'react'

const MaintenanceContext = createContext()

export function MaintenanceProvider({ children }) {
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem('maintenance_active')
    return stored ? JSON.parse(stored) : false
  })
  
  const [maintenanceMessage, setMaintenanceMessage] = useState(() => {
    return localStorage.getItem('maintenance_message') || 'System maintenance in progress. Please check back soon.'
  })

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('maintenance_active', JSON.stringify(isMaintenanceActive))
  }, [isMaintenanceActive])

  useEffect(() => {
    localStorage.setItem('maintenance_message', maintenanceMessage)
  }, [maintenanceMessage])

  const toggleMaintenance = () => {
    setIsMaintenanceActive(!isMaintenanceActive)
  }

  const updateMaintenanceMessage = (message) => {
    setMaintenanceMessage(message)
  }

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceActive,
      setIsMaintenanceActive,
      maintenanceMessage,
      updateMaintenanceMessage,
      toggleMaintenance
    }}>
      {children}
    </MaintenanceContext.Provider>
  )
}

export function useMaintenanceContext() {
  const context = useContext(MaintenanceContext)
  if (!context) {
    throw new Error('useMaintenanceContext must be used within MaintenanceProvider')
  }
  return context
}
