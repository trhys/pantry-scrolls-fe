import MessageForm from '../components/MessageForm.jsx'
import './contact.css'

export default function Contact() {
  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>Send a Raven</h1>
        <p>Have a question or suggestion? Send us a message and we'll respond in due haste.</p>
      </div>

      <MessageForm 
        onSuccess={() => {
          console.log('Message sent successfully')
        }}
        onError={(error) => {
          console.error('Failed to send message:', error)
        }}
      />
    </div>
  )
}
