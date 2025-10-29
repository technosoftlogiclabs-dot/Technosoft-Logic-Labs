'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import HoverCard from './components/HoverCard';
import AnimatedButton from './components/AnimatedButton';
import ContactForm from './components/ContactForm';

export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/hero-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translateZ(0)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 z-10" />
        <div className="container mx-auto px-6 text-center relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white animate-fade-in">
            Welcome to TechnoSoft
            <span className="text-blue-400">Logic Labs</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200">
            Building innovative solutions for tomorrow's challenges
          </p>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full
              hover:bg-blue-700 transform hover:scale-105 transition-all duration-300
              shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            See our Services
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">About Us</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-[400px]">
                <img
                  src="/about-image.jpg"
                  alt="About Us"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-gray-600">
                TechnoSoftLogic Labs is at the forefront of technological innovation, 
                delivering cutting-edge solutions that transform businesses. Our team 
                of experts is dedicated to creating powerful, efficient, and scalable 
                solutions that drive success in the digital age.
              </p>
              <p className="text-gray-600">
                With years of experience in software development and digital transformation, 
                we understand the unique challenges businesses face in today's rapidly 
                evolving technological landscape.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
            <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
            <p className="text-gray-600 mb-8">
              We combine technical expertise with creative innovation to deliver
              exceptional results for our clients.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Expert Development Team',
                'Cutting-edge Technology',
                'Agile Methodology',
                '24/7 Support'
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </span>
                  <span className="text-gray-700 text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full
                hover:bg-blue-700 transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              Get Started With Us
            </button>
          </div>
        </div>
      </section>

      {/* Services Section with Hover Cards */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <HoverCard
              title="Custom Solutions"
              description="Tailored software solutions designed to meet your specific needs"
              imageUrl="/service1.jpg"
            />
            <HoverCard
              title="Cloud Services"
              description="Scalable and reliable cloud infrastructure for your applications"
              imageUrl="/service2.jpg"
            />
            <HoverCard
              title="Digital Innovation"
              description="Cutting-edge technology solutions for digital transformation"
              imageUrl="/service3.jpg"
            />
          </div>
        </div>
      </section>
       </main> 
  );
}

      [Rest of the file remains the same with News and Contact sections...]