'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Review', href: '#reviews' },
  { label: 'Contact', href: '#' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      setScrolled(scrollPos > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call handler right away so state is updated on initial load/refresh
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className={styles.headerContainer}>
        <Link href="#" className={styles.logo}>
          <div className={styles.logoCircle}>
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=100&q=80"
              alt="AuraLens Photography Logo"
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoNameTop}>AuraLens</span>
            <span className={styles.logoNameBottom}>photography</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="#" id="book-now-btn" className={styles.bookBtn}>
          Book Now
        </Link>
      </div>
    </header>
  );
}
