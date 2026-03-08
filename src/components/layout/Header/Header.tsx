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

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, closeMenu]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`${styles.navLink} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
          <div ref={mobileMenuRef} className={styles.mobileMenu} role="dialog" aria-label="Navigation menu">
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.mobileNavLink} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                    onClick={(e) => handleNavClick(e, item.href)}
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
