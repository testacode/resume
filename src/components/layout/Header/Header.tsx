'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './Header.module.css';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileMenuRef, isMenuOpen);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const desktopQuery = window.matchMedia('(min-width: 641px)');
    const handleDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu();
    };

    document.addEventListener('keydown', handleEscape);
    desktopQuery.addEventListener('change', handleDesktop);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      desktopQuery.removeEventListener('change', handleDesktop);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`${styles.navLink} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {isMenuOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
          <div ref={mobileMenuRef} className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Navigation menu">
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.mobileNavLink} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
