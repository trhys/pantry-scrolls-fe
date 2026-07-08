import { useMaintenanceContext } from '../context/MaintenanceContext'
import './MaintenanceBanner.css'

export function MaintenanceBanner() {
  const { isMaintenanceActive, maintenanceMessage } = useMaintenanceContext()

  if (!isMaintenanceActive) {
    return null
  }

  return (
    <div className="maintenance-banner">
      <div className="maintenance-banner-content">
        <span className="maintenance-icon">⚠️</span>
        <p className="maintenance-text">{maintenanceMessage}</p>
      </div>
    </div>
  )
}
