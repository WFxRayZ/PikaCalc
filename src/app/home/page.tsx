'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PikaCalc</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/home" className="text-gray-700 dark:text-gray-300 font-medium hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/calculator" className="text-gray-700 dark:text-gray-300 font-medium hover:text-red-500 transition-colors">
              Calculator
            </Link>
            <Link href="/home/about" className="text-gray-700 dark:text-gray-300 font-medium hover:text-red-500 transition-colors">
              About
            </Link>
            <Link href="#blog" className="text-gray-700 dark:text-gray-300 font-medium hover:text-red-500 transition-colors">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/calculator" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 space-y-3">
            <Link href="/home" className="block text-gray-700 dark:text-gray-300 font-medium py-2">
              Home
            </Link>
            <Link href="/calculator" className="block text-gray-700 dark:text-gray-300 font-medium py-2">
              Calculator
            </Link>
            <Link href="/home/about" className="block text-gray-700 dark:text-gray-300 font-medium py-2">
              About
            </Link>
            <Link href="#" className="block text-gray-700 dark:text-gray-300 font-medium py-2">
              Blog
            </Link>
            <Link href="/calculator" className="block w-full px-6 py-2 bg-blue-500 text-white font-bold rounded-lg text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

{/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Card with Gradient Background */}
          <div className="relative bg-linear-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 lg:p-16">
            
            {/* Pokemon Decorations - Absolute Positioned */}

            {/* Pokéball - Top Left */}
            <img 
              src="/pokeball.svg" 
              alt="Pokéball" 
              className="absolute top-6 left-6 w-16 h-16 animate-bounce"
              style={{ animationDelay: '0s' }}
            />

            {/* --- FIX START: Removed the wrapper div, used just the img --- */}
            {/* Pikachu - Left Center */}
            <img 
              src="/pikachu-10.svg" 
              alt="Running Pikachu" 
              className="absolute left-8 top-1/3 w-24 md:w-32 h-auto"
              style={{ transform: 'scaleX(-1)' }} 
            />
            {/* --- FIX END --- */}

            {/* --- FIX START: Removed the wrapper div --- */}
            {/* Pikachu Main - Center (larger) */}
            <img 
              src="/pikachu-1.svg" 
              alt="Main Pikachu" 
              className="absolute right-12 top-12 w-32 md:w-48 h-auto drop-shadow-lg"
            />
            {/* --- FIX END --- */}

            {/* Content - Center */}
            <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                Master the<br />Meta Game.
              </h1>
              <p className="text-lg text-white/90">
                Analyze stats, optimize EVs, and build winning teams.
              </p>
              <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-linear-to-b from-transparent to-gray-50 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Pokemon Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <div className="text-6xl mb-3">🎮</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pokémon Stats</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comprehensive database with 1025+ Pokémon and their stats.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pokémon:</span>
                  <span className="font-bold text-gray-900 dark:text-white">1025+</span>
                </div>
              </div>
            </div>

            {/* EV/IV Calculator Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <div className="text-6xl mb-3">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">EV/IV Calculator</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">HP Progress</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div className="h-3 bg-red-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Attack Progress</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div className="h-3 bg-orange-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Type Matchups Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <div className="text-6xl mb-3">⚔️</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Type Matchups</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Instantly see weaknesses, resistances, and immunities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-400">Weaknesses</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-400">Resistances</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start optimizing your Pokémon team today.
          </p>
          <Link
            href="/calculator"
            className="inline-block px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 PikaCalc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
