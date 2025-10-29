'use client';
import { useRef, useEffect } from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function AnimatedButton({ children, className, ...props }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--x', `${x}px`);
      button.style.setProperty('--y', `${y}px`);
    };

    button.addEventListener('mousemove', handleMouseMove);
    return () => button.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <button
      ref={buttonRef}
      {...props}
      className={`relative overflow-hidden px-8 py-3 rounded-full font-semibold text-white
        bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
        transition-all duration-300 transform hover:scale-105
        before:absolute before:inset-0 before:bg-white/20 before:rounded-full
        before:w-12 before:h-12 before:opacity-0 before:hover:opacity-100
        before:transition-all before:duration-300 before:transform
        hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}`}
      style={{
        '--x': '0px',
        '--y': '0px',
        '--size': '0px',
      } as React.CSSProperties}
    >
      {children}
      <span className="absolute inset-0 pointer-events-none">
        <span
          className="absolute bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-md"
          style={{
            width: 'var(--size)',
            height: 'var(--size)',
            left: 'var(--x)',
            top: 'var(--y)',
          }}
        />
      </span>
    </button>
  );
}