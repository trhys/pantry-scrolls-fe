import './policies.css'

export default function PrivacyPolicy() {
  return (
    <div className="edict-container">
      <header className="edict-header">
        <h1>Imperial Decree of Privacy</h1>
        <p>How we safeguard your character sheet and inventory</p>
      </header>

      <div className="edict-scroll-frame parchment-scroll">
        <iframe 
          className="edict-iframe"
          title="Privacy Policy Charter Scroll"
          src="https://docs.google.com/document/d/e/2PACX-1vRrsN69h6qEMnxWnwoDcqOU7jIRvWksCzT79LBG3YwtmZsUBH3FrGHEXmvdRzYkalso5OeKv9iHvhDV/pub?embedded=true"
        />
      </div>
    </div>
  );
}
