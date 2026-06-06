'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/NewbornServicePage.css';

export default function NewbornServicePageContent() {
  return (
    <main className={styles.servicePage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextTop}>
              <span className={styles.heroTag}>Tiny Moments, Timeless Memories</span>
              <h1 className={styles.heroTitle}>
                Newborn <span className={styles.titleHighlight}>Photoshoot</span>
              </h1>

              <div className={styles.dividerContainer}>
                <div className={styles.dividerLine} />
                <div className={styles.cameraIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <div className={styles.dividerLine} />
              </div>

              <p className={styles.heroDesc}>
                Capture your baby's first moments with love, care, and creativity. We create cozy, beautiful, and artistic portraits of your tiny bundle of joy that you will cherish forever.
              </p>
              <p className={styles.heroDesc}>
                Every session is fully customized with warm organic wraps, hand-crafted props, and soft blankets to keep your baby safe and comfortable. Relax in our specialized temperature-controlled studio while we preserve these fleeting early days.
              </p>
            </div>

            <div className={styles.btnGroup}>
              <Link href="/booking" className={styles.btnSolid}>
                Book a Session
              </Link>
              <Link href="/gallery" className={styles.btnOutline}>
                View Portfolio
              </Link>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <Image
              src="/images/Newborn.png"
              alt="Cozy newborn baby sleeping soundly in a warm wooden basket with a small teddy bear"
              fill
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* 2. Feature Row (Banner) */}
      <section className={styles.featuresBanner}>
        <div className={styles.bannerContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Safe Session Care</span>
              <span className={styles.featureDesc}>Your baby's safety is our absolute top priority</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Professional Editing</span>
              <span className={styles.featureDesc}>Natural skin tone retouches and softening</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Premium Props & Setup</span>
              <span className={styles.featureDesc}>Cozy customized wraps, setups, & blankets</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Years of Experience</span>
              <span className={styles.featureDesc}>Over 500+ newborn photoshoot sessions completed</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>High Resolution</span>
              <span className={styles.featureDesc}>Retouched print-ready digital images</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What's Included Section */}
      <section className={styles.whatsIncluded}>
        <div className={styles.whatsIncludedContainer}>
          {/* Images Showcase */}
          <div className={styles.imageShowcase}>
            <div className={styles.tallImageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80"
                alt="Cozy newborn baby sleeping portrait"
                fill
                className={styles.showcaseImage}
              />
            </div>
            <div className={styles.stackedImages}>
              <div className={styles.smallImageWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                  alt="Baby swaddled and sleeping in white sheet"
                  fill
                  className={styles.showcaseImage}
                />
              </div>
              <div className={styles.smallImageWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                  alt="Newborn session props and toys setup"
                  fill
                  className={styles.showcaseImage}
                />
              </div>
            </div>
          </div>

          {/* List of Inclusions */}
          <div className={styles.inclusionsCard}>
            <span className={styles.sectionTag}>What's Included</span>
            <h2 className={styles.sectionHeading}>
              Everything You Need, <span className={styles.sectionHighlight}>Beautifully</span> Planned
            </h2>
            <div className={styles.checkList}>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Pre-shoot consultation & planning</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Access to props, wraps & outfits</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Safe handling & posing of your baby</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Professional photography & editing</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Studio session (2-4 hours)</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Online gallery for easy viewing & sharing</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Print release for personal use</span>
              </div>
            </div>
          </div>

          {/* Recommended Booking Card */}
          <div className={styles.bookingCard}>
            <div className={styles.bookingIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className={styles.bookingTitle}>Best Time For Newborn Photoshoot</span>
            <h3 className={styles.bookingHighlight}>3 to 15</h3>
            <span className={styles.bookingSubtext}>days after birth</span>
            <p className={styles.bookingDesc}>
              This is the ideal window to capture those sleepy, curled-up baby poses before they start stretching and waking up more frequently.stretching and waking up more frequently stretching and waking up more frequently
            </p>
          </div>
        </div>
      </section>

      {/* 4. Packages Section */}
      <section className={styles.packages}>
        <div className={styles.packagesContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Our Packages</span>
            <h2 className={styles.sectionHeading}>
              Choose the <span className={styles.sectionHighlight}>Perfect Package</span> for You
            </h2>
          </div>

          <div className={styles.packagesGrid}>
            {/* Basic Package */}
            <div className={styles.packageCard}>
              <div>
                <span className={styles.packageName}>Basic</span>
                <h3 className={styles.packagePrice}>₹15,000</h3>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    2 Hours Photoshoot
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    1 Setup / Theme
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    10 Edited High-Res Images
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Online Gallery Delivery
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Full Personal Print Release
                  </li>
                </ul>
              </div>
              <Link href="/booking" className={styles.chooseBtn}>
                Choose Package
              </Link>
            </div>

            {/* Standard Package */}
            <div className={`${styles.packageCard} ${styles.highlightedCard}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <div>
                <span className={styles.packageName}>Standard</span>
                <h3 className={styles.packagePrice}>₹25,000</h3>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    3 Hours Photoshoot
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    2-3 Setups / Themes
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    25 Edited High-Res Images
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Parents & Siblings Included
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Online Gallery & Print Release
                  </li>
                </ul>
              </div>
              <Link href="/booking" className={styles.chooseBtnSolid}>
                Choose Package
              </Link>
            </div>

            {/* Premium Package */}
            <div className={styles.packageCard}>
              <div>
                <span className={styles.packageName}>Premium</span>
                <h3 className={styles.packagePrice}>₹40,000</h3>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    4 Hours Photoshoot
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    3-4 Setups / Themes
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    40 Edited High-Res Images
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Parents & Siblings + 8x8 Custom Photo Book
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Online Gallery & Full Print Release
                  </li>
                </ul>
              </div>
              <Link href="/booking" className={styles.chooseBtn}>
                Choose Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Steps Timeline */}
      <section className={styles.process}>
        <div className={styles.processContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Our Process</span>
            <h2 className={styles.sectionHeading}>
              Simple Steps to <span className={styles.sectionHighlight}>Beautiful</span> Memories
            </h2>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepBadge}>01</div>
              <h4 className={styles.stepTitle}>Book</h4>
              <p className={styles.stepText}>Reserve your session around your estimated due date.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>02</div>
              <h4 className={styles.stepTitle}>Consult</h4>
              <p className={styles.stepText}>Select color palettes, themes, and setups beforehand.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>03</div>
              <h4 className={styles.stepTitle}>Shoot</h4>
              <p className={styles.stepText}>Relax in our cozy studio while we capture poses safely.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>04</div>
              <h4 className={styles.stepTitle}>Edit</h4>
              <p className={styles.stepText}>Meticulous professional editing for skin tones & lighting.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>05</div>
              <h4 className={styles.stepTitle}>Delivery</h4>
              <p className={styles.stepText}>Download and print your high-res digital memories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Portfolio Showcase */}
      <section className={styles.portfolio}>
        <div className={styles.portfolioContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Newborn Portfolio</span>
            <h2 className={styles.sectionHeading}>
              A Glimpse of <span className={styles.sectionHighlight}>Our Work</span>
            </h2>
          </div>

          <div className={styles.portfolioGrid}>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80"
                alt="Newborn baby face close up"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                alt="Sleeping swaddled baby"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80"
                alt="Newborn baby sleeping in wooden basket"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                alt="Sleeping baby on warm blanket"
                fill
                className={styles.portfolioImage}
              />
            </div>
          </div>

          <Link href="/gallery" className={styles.viewAllLink}>
            View Full Gallery
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
