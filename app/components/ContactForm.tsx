'use client';
import { useState } from 'react';
import AnimatedButton from './AnimatedButton';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
        console.error('Send failed:', data.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
          Nume
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          placeholder="Numele dvs."
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          placeholder="email.dvs@exemplu.ro"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
          Mesaj
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          placeholder="Mesajul dvs."
        />
      </div>

      <div className="relative">
        <AnimatedButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Se trimite...</span>
            </span>
          ) : (
            'Trimite Mesaj'
          )}
        </AnimatedButton>

        {submitStatus === 'success' && (
          <p className="absolute -bottom-8 left-0 text-green-400 text-sm">
            Mesaj trimis cu succes! Vă vom răspunde în curând.
          </p>
        )}
        
        {submitStatus === 'error' && (
          <p className="absolute -bottom-8 left-0 text-red-400 text-sm">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}