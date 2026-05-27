'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';
import { useScrolled } from '@/hooks/useScrolled';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Portfolio', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Header() {
  const scrolled = useScrolled(50);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
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

      <Link href="#" className={styles.bookBtn}>
        Book Now
      </Link>
    </header>
  );
}
