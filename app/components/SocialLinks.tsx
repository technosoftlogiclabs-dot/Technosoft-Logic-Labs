'use client';
import { useEffect, useState } from 'react';

export default function SocialLinks() {
  const [isFloating, setIsFloating] = useState(true);
  const whatsappNumber = '0737072359';
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61582684691776';

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Hide floating buttons when near the footer
      setIsFloating(scrolled + windowHeight < docHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed right-6 transition-all duration-300 ease-in-out z-40
      ${isFloating ? 'bottom-6' : '-bottom-20'}`}>
      <div className="flex flex-col space-y-4">
        {/* Facebook Link */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 
                   hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50
                   transform hover:scale-110"
          aria-label="Visit our Facebook page"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* WhatsApp Link */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 
                   hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50
                   transform hover:scale-110"
          aria-label="Contact us on WhatsApp"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.2-.3-.2-.5-.2h-.6c-.2 0-.5.2-.6.3-.6.6-.9 1.3-.9 2.1 0 .9.3 1.9.7 2.8 1.5 2.1 2.5 2.8 3.2 3.2.3.2.7.5 1.1.6.5.2 1 .2 1.3.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
