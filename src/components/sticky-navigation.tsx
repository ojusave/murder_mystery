'use client';

import { useState, useEffect } from 'react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  level: number;
}

interface StickyNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export default function StickyNavigation({ items, className = '' }: StickyNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolledIntoView, setIsScrolledIntoView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      // Find the current section based on scroll position
      let currentSection = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = section.id;
          break;
        }
      }

      setActiveSection(currentSection);
      
      // Show/hide navigation based on scroll position
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const mainRect = mainContent.getBoundingClientRect();
        setIsScrolledIntoView(mainRect.top < 0 && mainRect.bottom > window.innerHeight);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (item.level === 0) {
      acc.push({ ...item, children: [] });
    } else if (acc.length > 0) {
      acc[acc.length - 1].children.push(item);
    }
    return acc;
  }, [] as (NavigationItem & { children: NavigationItem[] })[]);

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-300 ${isScrolledIntoView ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className}`}>
        <nav className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent w-64">
          <div className="text-white text-sm font-semibold mb-3 text-center">
            Quick Jump
          </div>
          <div className="space-y-1">
            {groupedItems.map((group) => (
              <div key={group.id}>
                <button
                  onClick={() => scrollToSection(group.href)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200 ${
                    activeSection === group.id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white hover:bg-purple-500/30'
                  }`}
                >
                  {group.label}
                </button>
                {group.children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => scrollToSection(child.href)}
                        className={`block w-full text-left px-3 py-1 rounded text-xs transition-colors duration-200 ${
                          activeSection === child.id
                            ? 'bg-purple-600 text-white'
                            : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed bottom-4 left-4 z-50 transition-opacity duration-300 ${isScrolledIntoView ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className}`}>
        <div className="relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {isMobileMenuOpen && (
            <div className="absolute bottom-16 left-0 bg-black/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 max-h-[60vh] overflow-y-auto w-64">
              <div className="text-white text-sm font-semibold mb-3 text-center">
                Quick Jump
              </div>
              <div className="space-y-1">
                {groupedItems.map((group) => (
                  <div key={group.id}>
                    <button
                      onClick={() => {
                        scrollToSection(group.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200 ${
                        activeSection === group.id
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:text-white hover:bg-purple-500/30'
                      }`}
                    >
                      {group.label}
                    </button>
                    {group.children.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {group.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => {
                              scrollToSection(child.href);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-1 rounded text-xs transition-colors duration-200 ${
                              activeSection === child.id
                                ? 'bg-purple-600 text-white'
                                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
