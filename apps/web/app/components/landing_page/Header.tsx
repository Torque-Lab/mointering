'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { MenuIcons } from '../../ui-icons/MenuIcons';
import { CloseIcons } from '../../ui-icons/CloseIcons';
import { MonitorIcon } from '../../ui-icons/MonitorIcon';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <motion.div 
        className="mx-auto transition-all duration-300"
        initial={false}
        animate={{
          maxWidth: scrolled ? '90%' : '100%',
          padding: scrolled ? '0.75rem 0' : '1rem 0',
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
        

          <div className="flex items-center space-1 cursor-pointer">
            <Link href="/" className='flex items-center space-1 cursor-pointer'>
            <MonitorIcon />
            <span className="text-xl font-bold text-gray-900">SiteWatch</span>
            </Link>
          </div>

         
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

      

          <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
          </div>

         
         
          <button 
            className="md:hidden p-2 text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <CloseIcons /> : <MenuIcons />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link 
                      key={`mobile-${item.name}`}
                      href={item.href}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <Link 
                      href="/login" 
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="block px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  </header>
  );
}