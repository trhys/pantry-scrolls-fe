import './policies.css'

export default function TermsOfService() {
  return (
    <div className="edict-container">
      <header className="edict-header">
        <h1>Grand Covenant of the Realm</h1>
        <p>The binding terms, codes of conduct, and compacts of Pantry Scrolls</p>
      </header>

      <div className="edict-scroll-frame parchment-scroll">
        <iframe 
          className="edict-iframe"
          title="Terms of Service Document Charter"
          src="https://docs.google.com/document/d/e/2PACX-1vQr4Q6SK7-2aJc2t_KDj152Ig007ptdRUNNZbs7cISWl7ctnxUDe5Xsre-ZbgJ3zmmVXKfRllKVdL99/pub?embedded=true"
        />
      </div>
    </div>
  );
}
