import { useState } from 'react';
import { postMessage } from '../api/messages.js';
import './MessageForm.css';

const MessageForm = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (emailInput) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setErrorMessage('Email is required');
      setSubmitStatus('error');
      onError?.('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      onError?.('Invalid email address');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Message cannot be empty');
      setSubmitStatus('error');
      onError?.('Message cannot be empty');
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { ok, message: errorMsg } = await postMessage(email, message);

      if (!ok) {
        throw new Error(errorMsg || 'Failed to send message');
      }

      setSubmitStatus('success');
      setEmail('');
      setMessage('');
      onSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Failed to send message';
      setSubmitStatus('error');
      setErrorMessage(errorText);
      onError?.(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="message-form-container">
      <h2 className="message-form-title">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="message-form">
        <div className="message-form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isLoading}
            required
          />
        </div>

        <div className="message-form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={5}
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="message-submit-button"
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>

        {submitStatus === 'success' && (
          <div className="message-status success">
            ✓ Message sent successfully!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="message-status error">
            ✗ {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageForm;
