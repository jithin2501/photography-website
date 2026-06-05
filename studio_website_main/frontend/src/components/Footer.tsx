'use client';

import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Top Columns Grid */}
        <div className={styles.columnsGrid}>
          {/* Brand/Logo Column */}
          <div className={styles.brandCol}>
            <div className={styles.logoArea}>
              <div className={styles.logoText}>
                <span className={styles.logoNameTop}>AuraLens</span>
                <span className={styles.logoNameBottom}>photography</span>
              </div>
            </div>

            <h4 className={styles.slogan}>
              Capturing Timeless Moments <span className={styles.sloganHighlight}>with Creativity & Passion.</span>
            </h4>

            <p className={styles.brandDesc}>
              We don't just take pictures, we <span className={styles.descHighlight}>create memories</span> that last forever.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className={styles.brandCol}>
            <h3 className={styles.colTitle}>
              <span className={styles.pipe}>|</span> Quick Links
            </h3>
            <ul className={styles.linksList}>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/">Home</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/#about">About Us</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/#services">Services</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/#gallery">Gallery</Link>
              </li>

              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className={`${styles.brandCol} ${styles.servicesCol}`}>
            <h3 className={styles.colTitle}>
              <span className={styles.pipe}>|</span> Services
            </h3>
            <ul className={styles.linksList}>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="#">Portrait Photography</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="#">Wedding Photography</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="/services/milestone">Milestone Photoshoot</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="#">Family Photography</Link>
              </li>
              <li className={styles.linkItem}>
                <span className={styles.bullet}>•</span>
                <Link href="#">Event Photography</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.contactCol}>
            <h3 className={styles.colTitle}>
              <span className={styles.pipe}>|</span> Contact Us
            </h3>
            <div className={styles.contactList}>
              {/* Phone */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className={styles.contactText}>+1 (123) 456-7890</div>
              </div>

              {/* Email */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className={styles.contactText}>hello@auralensstudio.com</div>
              </div>

              {/* Address */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.contactText}>
                  123 Studio Lane,{"\n"}Creative City, CA 90210,{"\n"}USA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Follow Us Bar */}
        <div className={styles.followBar}>
          <span className={styles.followTitle}>Follow Us</span>
          <div className={styles.followLine} />

          <div className={styles.socials}>
            <button className={styles.socialBtn} aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </button>
            <button className={styles.socialBtn} aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </button>
            <button className={styles.socialBtn} aria-label="Pinterest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.91 6.48 9.32-.08-.8-.16-2.02.03-2.9.18-.79 1.17-4.97 1.17-4.97s-.3-.59-.3-1.47c0-1.38.8-2.41 1.8-2.41.85 0 1.26.64 1.26 1.4 0 .85-.54 2.13-.82 3.31-.24 1.01.5 1.83 1.5 1.83 1.8 0 3.18-1.9 3.18-4.65 0-2.43-1.75-4.13-4.24-4.13-2.89 0-4.59 2.17-4.59 4.41 0 .88.34 1.81.76 2.31.08.1.1.19.07.29-.08.33-.26 1.07-.3 1.23-.05.21-.17.26-.39.16-1.46-.68-2.38-2.82-2.38-4.54 0-3.69 2.68-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.76 0 4.03-2.54 7.28-6.07 7.28-1.18 0-2.3-.61-2.68-1.34l-.73 2.78c-.26 1.02-1 2.3-1.49 3.1C10.74 21.78 11.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </button>
            <button className={styles.socialBtn} aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
              </svg>
            </button>
          </div>

          <div className={styles.followLine} />
          <div className={styles.followBrandText}>AuraLens</div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; 2026 <span className={styles.copyrightHighlight}>AURALENS PHOTO STUDIO</span>. ALL RIGHTS RESERVED.
          </div>
          <div className={styles.legalLinks}>
            <Link href="#">TERMS OF USE</Link>
            <Link href="#">PRIVACY POLICY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
