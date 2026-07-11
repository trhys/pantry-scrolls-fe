import { createContext, useContext } from 'react'
import { useGetMaintenanceStatus, putMaintenanceStatus } from '../api/maintenance.js'

const MaintenanceContext = createContext()

const DEFAULT_MESSAGE = 'System maintenance in progress. Please check back soon.'

export function MaintenanceProvider({ children }) {
  const { data, isLoading, mutate } = useGetMaintenanceStatus()

  const isMaintenanceActive = data?.active ?? false
  const maintenanceMessage = data?.message ?? DEFAULT_MESSAGE

  const toggleMaintenance = async () => {
    const newActive = !isMaintenanceActive
    mutate({ ...data, active: newActive }, false)
    const result = await putMaintenanceStatus(newActive, maintenanceMessage)
    mutate()
    return result
  }

  const updateMaintenanceMessage = async (message) => {
    mutate({ ...data, message }, false)
    const result = await putMaintenanceStatus(isMaintenanceActive, message)
    mutate()
    return result
  }

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceActive,
      maintenanceMessage,
      isLoading,
      toggleMaintenance,
      updateMaintenanceMessage
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
