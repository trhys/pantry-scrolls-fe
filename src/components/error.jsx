import { Link, useNavigate } from 'react-router'
import './error.css'

export function NotFound404() {
  return (
    <div className="error-realm-container">
      <div className="error-scroll-card parchment-scroll">
        <div className="error-rune">CDIV</div>
        
        <h2>Lost in the Wilderness</h2>
        <p>
          You have wandered off the marked trade roads. The map leaf or scroll manuscript 
          you are trying to scry does not exist in the royal archive files.
        </p>
        
        <hr className="error-divider" />
        
        <div className="error-actions">
          <Link to="/" className="error-return-btn primary-action">
            🗡️ Return to Hearth (Home)
          </Link>
          <Link to="/explore" className="error-return-btn secondary-action">
            🔮 Browse Archives (Explore)
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ServerError500() {
  const navigate = useNavigate();

  return (
    <div className="error-realm-container">
      <div className="error-scroll-card parchment-scroll">
        <div className="error-rune">D</div> 
        
        <h2>Arcane Alchemical Failure</h2>
        <p>
          An explosion has rocked the workspace! The server's volatile elements destabilized 
          while combining your requested layout data. The spymaster has been dispatched to investigate.
        </p>
        
        <hr className="error-divider" />
        
        <div className="error-actions">
          <button 
            type="button" 
            className="error-return-btn primary-action cursor-pointer"
            onClick={() => window.location.reload()}
          >
            ⚡ Recast Incantation (Retry)
          </button>
          <button 
            type="button" 
            className="error-return-btn secondary-action cursor-pointer"
            onClick={() => navigate('/')}
          >
            🏰 Flee to Safety (Hearth)
          </button>
        </div>
      </div>
    </div>
  );
}
