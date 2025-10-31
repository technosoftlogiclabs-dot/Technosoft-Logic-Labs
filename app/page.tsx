'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import HoverCard from './components/HoverCard';
import AnimatedButton from './components/AnimatedButton';
import ContactForm from './components/ContactForm';

export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  // Removed background image refs for Services and Contact

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
            Bun venit la TechnoSoft
            <span className="text-blue-400">Logic Labs</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200">
            Construim soluții inovatoare pentru provocările de mâine
          </p>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full
              hover:bg-blue-700 transform hover:scale-105 transition-all duration-300
              shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            Vezi Serviciile Noastre
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Despre Noi</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-[400px]">
                <img
                  src="/about-image.jpg"
                  alt="Despre Noi"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Viziunea Noastră</h3>
              <p className="text-gray-600">
                La TechnoSoft Logic Labs, credem că inovația nu vine doar din tehnologie, ci din pasiunea celor care o creează.
                Suntem o echipă tânără, născută din dorința de a construi ceva valoros prin programul Start-Up Nation, și privim acest început nu ca o limitare, ci ca un punct de lansare spre ceva mare.
              </p>
              <p className="text-gray-600">
                Nu ne aflăm (încă) în topuri, dar ne remarcăm prin implicare totală, dedicație și emoția pe care o punem în fiecare proiect. Fiecare linie de cod, fiecare idee și fiecare colaborare poartă semnătura unei echipe care crede în progres, în parteneriate autentice și în faptul că succesul se construiește pas cu pas.
              </p>
              <p className="text-gray-600">
                Viziunea noastră este să creștem alături de clienții noștri, oferind soluții software care nu doar funcționează — ci inspiră și transformă.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 shadow-lg mb-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">De ce să ne alegeți?</h3>
            <p className="text-gray-600 mb-8">
              Combinăm expertiza tehnică cu inovația creativă pentru a oferi
              rezultate excepționale clienților noștri.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Echipă Tânără',
                'Tehnologie de Ultimă Generație',
                'Devotament Total pentru Clienți',
                'Livrare Rapidă a Produsului',
                'Support',
                'Mentenanță'
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
              Începe cu Noi
            </button>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Tehnologiile Noastre</h2>
          <p className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Cu ajutorul AI-ului și tehnologiilor moderne, construim soluții robuste și scalabile pentru afacerea ta
          </p>
          
          {/* AI-Powered Development Approach */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-16 text-white max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Dezvoltare Asistată de AI
              </h3>
              <p className="text-lg opacity-90">
                Folosim inteligența artificială avansată pentru a accelera dezvoltarea și a asigura calitatea codului
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold mb-2">AI Assistant</h4>
                <p className="text-sm opacity-80">GitHub Copilot & ChatGPT pentru cod optimizat</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold mb-2">Dezvoltare Rapidă</h4>
                <p className="text-sm opacity-80">Prototipuri și MVP-uri în timp record</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Calitate Superioară</h4>
                <p className="text-sm opacity-80">Cod reviewuit și optimizat de AI</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Frontend Technologies */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Frontend Development
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'React', icon: '⚛️', url: 'https://react.dev/' },
                  { name: 'Next.js', icon: '▲', url: 'https://nextjs.org/' },
                  { name: 'TypeScript', icon: '📘', url: 'https://www.typescriptlang.org/' },
                  { name: 'Tailwind CSS', icon: '🎨', url: 'https://tailwindcss.com/' },
                  { name: 'JavaScript', icon: '🟨', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
                  { name: 'HTML5/CSS3', icon: '🌐', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }
                ].map((tech) => (
                  <a 
                    key={tech.name} 
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">{tech.name}</div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      Vezi documentația
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Backend Technologies */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-900 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                Backend Development
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Node.js', icon: '🟢', url: 'https://nodejs.org/' },
                  { name: 'Express.js', icon: '🚀', url: 'https://expressjs.com/' },
                  { name: 'Python', icon: '🐍', url: 'https://www.python.org/' },
                  { name: 'PHP', icon: '🐘', url: 'https://www.php.net/' },
                  { name: 'Laravel', icon: '🔴', url: 'https://laravel.com/' },
                  { name: 'REST APIs', icon: '🔌', url: 'https://restfulapi.net/' }
                ].map((tech) => (
                  <a 
                    key={tech.name} 
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <div className="font-medium text-gray-800 group-hover:text-green-600">{tech.name}</div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      Vezi documentația
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mobile Technologies */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-purple-900 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
                Mobile Development
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'React Native', icon: '📱', url: 'https://reactnative.dev/' },
                  { name: 'Flutter', icon: '🦋', url: 'https://flutter.dev/' },
                  { name: 'Ionic', icon: '⚡', url: 'https://ionicframework.com/' },
                  { name: 'Swift', icon: '🍎', url: 'https://swift.org/' },
                  { name: 'Kotlin', icon: '🤖', url: 'https://kotlinlang.org/' },
                  { name: 'Xamarin', icon: '💜', url: 'https://dotnet.microsoft.com/en-us/apps/xamarin' }
                ].map((tech) => (
                  <a 
                    key={tech.name} 
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-600">{tech.name}</div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      Vezi documentația
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Database & Tools */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-orange-900 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Database & Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'MySQL', icon: '🐬', url: 'https://www.mysql.com/' },
                  { name: 'PostgreSQL', icon: '🐘', url: 'https://www.postgresql.org/' },
                  { name: 'MongoDB', icon: '🍃', url: 'https://www.mongodb.com/' },
                  { name: 'Firebase', icon: '🔥', url: 'https://firebase.google.com/' },
                  { name: 'Git', icon: '📝', url: 'https://git-scm.com/' },
                  { name: 'Docker', icon: '🐳', url: 'https://www.docker.com/' }
                ].map((tech) => (
                  <a 
                    key={tech.name} 
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <div className="font-medium text-gray-800 group-hover:text-orange-600">{tech.name}</div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      Vezi documentația
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Pregătit să Construim Ceva Extraordinar?</h3>
              <p className="text-lg mb-6 opacity-90">
                Prin combinarea expertizei umane cu asistența AI avansată, transformăm ideile tale în realitate
              </p>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full
                  hover:bg-gray-100 transform hover:scale-105 transition-all duration-300
                  shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                Să Discutăm Proiectul Tău
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Hover Cards */}
      <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-20">
          <h2 className="text-4xl font-bold text-center mb-16">
            Serviciile Noastre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <HoverCard
              title="Dezvoltare Mobilă"
              description="Aplicații mobile native și cross-platform pentru iOS și Android"
              imageUrl="/service1.jpg"
            />
            <HoverCard
              title="Dezvoltare Web"
              description="Site-uri web moderne, responsive și aplicații web progresive"
              imageUrl="/service2.jpg"
            />
            <HoverCard
              title="Mentenanță"
              description="Suport tehnic continuu și mentenanță pentru aplicațiile dvs."
              imageUrl="/service3.jpg"
            />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Știri Recente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(24,_24,_240,_0.03),_transparent_50%)] pointer-events-none" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(24,_24,_240,_0.03),_transparent_50%)] pointer-events-none" aria-hidden="true"></div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/medieval-stronghold-cyber-fortress-shielding-europes-digital-future" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-indigo-100 to-blue-100"></div>
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
                       style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 rounded-2xl p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                      <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="block mt-2 font-medium text-blue-900">Securitate Cibernetică</span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">De la Fortăreață Medievală la Fortăreață Cibernetică</h3>
                <p className="text-gray-600 mb-4">
                  Explorând abordările inovatoare ale Europei în materie de securitate digitală și protecție a infrastructurii.
                </p>
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/medieval-stronghold-cyber-fortress-shielding-europes-digital-future" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-full
                    hover:bg-blue-700 transform hover:scale-105 transition-all duration-300
                    shadow-blue-200/50 hover:shadow-blue-300/50 text-base font-semibold ring-1 ring-blue-400/20">
                  Citește Articolul
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/cracking-quantum-code-light-and-glass-are-set-transform-computing"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50"></div>
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
                       style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 rounded-2xl p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                      <svg className="w-12 h-12 mx-auto text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="block mt-2 font-medium text-emerald-900">Calcul Cuantic</span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Descoperire în Calcul Cuantic</h3>
                <p className="text-gray-600 mb-4">
                  Inovațiile cu lumină și sticlă care urmează să revoluționeze tehnologia calculului cuantic.
                </p>
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/cracking-quantum-code-light-and-glass-are-set-transform-computing"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center bg-emerald-600 text-white px-6 py-2 rounded-full
                    hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300
                    shadow-emerald-200/50 hover:shadow-emerald-300/50 text-base font-semibold ring-1 ring-emerald-400/20">
                  Citește Articolul
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/brain-chips-are-boosting-computers-and-battling-cybercrime"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-violet-50 to-indigo-100"></div>
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
                       style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 rounded-2xl p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                      <svg className="w-12 h-12 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="block mt-2 font-medium text-indigo-900">AI & Rețele Neuronale</span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Calcul Inspirat de Creier</h3>
                <p className="text-gray-600 mb-4">
                  Cum tehnologia chip-creier revoluționează calculul și securitatea cibernetică.
                </p>
                <a href="https://projects.research-and-innovation.ec.europa.eu/en/horizon-magazine/brain-chips-are-boosting-computers-and-battling-cybercrime"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-full
                    hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300
                    shadow-indigo-200/50 hover:shadow-indigo-300/50 text-base font-semibold ring-1 ring-indigo-400/20">
                  Citește Articolul
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pregătit să Începem?
            </h2>
            <p className="text-xl text-gray-200">
              Spune-ne mai multe despre afacerea ta!
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">TechnoSoft<span className="text-blue-400">Logic Labs</span></h3>
              <p className="text-gray-400 mb-4">Construim soluții inovatoare pentru provocările de mâine</p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61582684691776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all duration-300"
                  aria-label="Vizitează pagina noastră de Facebook"
                >
                  <svg
                    className="w-5 h-5"
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
                <a
                  href="https://www.linkedin.com/company/technosoft-logic-labs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 hover:bg-blue-800 p-3 rounded-full transition-all duration-300"
                  aria-label="Conectează-te cu noi pe LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://wa.me/0737072359"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-all duration-300"
                  aria-label="Contactează-ne pe WhatsApp"
                >
                  <svg
                    className="w-5 h-5"
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
            <div className="text-right">
              <h4 className="text-lg font-semibold mb-2">Contactează-ne</h4>
              <a href="mailto:technosoftlogiclabs@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                technosoftlogiclabs@gmail.com
              </a>
              <p className="text-gray-400 mt-2">
                WhatsApp: <a href="tel:0737072359" className="hover:text-green-400 transition-colors duration-300">0737 072 359</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TechnoSoftLogic Labs. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
