'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className={`text-2xl font-bold ${scrolled || isOpen ? 'text-blue-600' : 'text-white'}`}
          >
            TechnoSoft
          </Link>
          <div className="hidden md:flex space-x-8">
            {[
              { label: 'Despre', id: 'about' },
              { label: 'Servicii', id: 'services' },
              { label: 'Știri', id: 'news' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`${
                  scrolled ? 'text-gray-800' : 'text-white'
                } hover:text-blue-500 transition-colors duration-300`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden text-2xl transition-colors duration-300 ${
              scrolled || isOpen ? 'text-gray-800' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? '×' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-64 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4">
            {[
              { label: 'Despre', id: 'about' },
              { label: 'Servicii', id: 'services' },
              { label: 'Știri', id: 'news' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-800 hover:text-blue-500 transition-colors duration-300 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}