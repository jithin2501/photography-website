'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/MilestoneServicePage.module.css';

export default function MilestoneServicePageContent() {
  return (
    <main className={styles.servicePage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextTop}>
              <span className={styles.heroTag}>Capture Every Milestone</span>
              <h1 className={styles.heroTitle}>
                Milestone <span className={styles.titleHighlight}>Photoshoot</span>
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
                From tiny smiles to big achievements, we capture every special milestone in your little one's journey. Timeless photos that you'll treasure forever.
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
              src="https://images.unsplash.com/photo-1544126592-807daf215a3c?auto=format&fit=crop&w=800&q=80"
              alt="Milestone photoshoot of a sweet sleeping newborn baby in a rustic basket setup"
              fill
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* 2. Features Row (Banner) */}
      <section className={styles.featuresBanner}>
        <div className={styles.bannerContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Professional Photography</span>
              <span className={styles.featureDesc}>High-quality gear & professional crew for perfect captures.</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Artistic Props</span>
              <span className={styles.featureDesc}>Wide range of custom props to match your baby's theme.</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Safe Sessions</span>
              <span className={styles.featureDesc}>Warm, friendly environment with priority on baby's safety.</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.37 8.91l-8.17-6.07a1 1 0 0 0-1.2 0L2.83 8.91A1 1 0 0 0 2.5 9.8v9.7a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9.8a1 1 0 0 0-.13-.89z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Exclusive Apparels</span>
              <span className={styles.featureDesc}>Access to beautiful studio outfits for newborn & baby shoots.</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Online Gallery</span>
              <span className={styles.featureDesc}>Easy access to download & share your digital collection.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Everything You Need Section */}
      <section className={styles.whatsExpect}>
        <div className={styles.whatsExpectContainer}>
          <div className={styles.expectContent}>
            <span className={styles.sectionTag}>What to Expect</span>
            <h2 className={styles.sectionHeading}>
              Everything You Need, <span className={styles.sectionHighlight}>Beautifully</span> Planned
            </h2>

            <div className={styles.checkList}>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Pre-shoot consultation & theme planning</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Access to outfits, props & backdrops</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Professional styling and layout setup</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Relaxed & guided session pace</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>High-resolution edited images</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Online gallery for easy viewing & sharing</span>
              </div>
              <div className={styles.checkItem}>
                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={styles.checkText}>Print release for personal use</span>
              </div>
            </div>

          </div>

          <div className={styles.expectImageContainer}>
            <Image
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
              alt="Professional camera on studio table with book and lenses"
              fill
              className={styles.expectImage}
            />
          </div>
        </div>
      </section>

      {/* 4. Packages Section */}
      <section className={styles.packages}>
        <div className={styles.packagesContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Our Packages</span>
            <h2 className={styles.sectionHeading}>
              Choose the <span className={styles.sectionHighlight}>Perfect Package</span>
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
                    1 Hour Shoot Session
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    1 Theme & 1 Outfit
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
                    Online Gallery
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Print Release
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
                    2 Hour Shoot Session
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    2 Themes & 2 Outfits
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    20 Edited High-Res Images
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Professional Styling Setup
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
                    3 Hour Shoot Session
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    3+ Themes & Outfits
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    35 Edited High-Res Images
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Professional Styling Setup & Photo Book
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Online Gallery & Print Release
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
            <span className={styles.sectionTag}>Simple Process</span>
            <h2 className={styles.sectionHeading}>
              Simple Steps to <span className={styles.sectionHighlight}>Timeless</span> Memories
            </h2>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepBadge}>01</div>
              <h4 className={styles.stepTitle}>Book</h4>
              <p className={styles.stepText}>Choose your package and request a date.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>02</div>
              <h4 className={styles.stepTitle}>Plan</h4>
              <p className={styles.stepText}>We define themes, outfits and creative details.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>03</div>
              <h4 className={styles.stepTitle}>Photoshoot</h4>
              <p className={styles.stepText}>Enjoy the professional shoot in studio or outdoor.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>04</div>
              <h4 className={styles.stepTitle}>Editing</h4>
              <p className={styles.stepText}>We carefully retouch and color-grade your images.</p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepBadge}>05</div>
              <h4 className={styles.stepTitle}>Delivery</h4>
              <p className={styles.stepText}>Access your private online gallery for download.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Portfolio Showcase */}
      <section className={styles.portfolio}>
        <div className={styles.portfolioContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Our Work</span>
            <h2 className={styles.sectionHeading}>
              Little Moments, <span className={styles.sectionHighlight}>Big Memories</span>
            </h2>
          </div>

          <div className={styles.portfolioGrid}>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                alt="Newborn sleeping on blanket"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                alt="Cute baby smile portrait"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                alt="Toddler laughing with wooden toys"
                fill
                className={styles.portfolioImage}
              />
            </div>
            <div className={styles.portfolioCard}>
              <Image
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                alt="Cozy newborn wrapped in organic wool"
                fill
                className={styles.portfolioImage}
              />
            </div>
          </div>

          <Link href="/gallery" className={styles.viewAllLink}>
            Visit Full Gallery
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
