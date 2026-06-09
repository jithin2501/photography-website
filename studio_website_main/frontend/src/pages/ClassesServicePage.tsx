'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/ClassesServicePage.css';

export default function ClassesServicePageContent() {
  const [prices, setPrices] = useState({
    basic: '₹14,999',
    standard: '₹24,999',
    premium: '₹39,999',
  });

  const [portfolioImages, setPortfolioImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=600&q=80"
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch prices
        const priceRes = await fetch('http://localhost:5000/api/service-package-prices', { cache: 'no-store' });
        const priceData = await priceRes.json();
        if (priceRes.ok && priceData.data) {
          const item = priceData.data.find((p: any) => p.id === 'classes');
          if (item) {
            setPrices({
              basic: item.basicPrice || '₹14,999',
              standard: item.standardPrice || '₹24,999',
              premium: item.premiumPrice || '₹39,999',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
      }

      try {
        // Fetch dynamic portfolio images
        const galleryRes = await fetch('http://localhost:5000/api/gallery-images', { cache: 'no-store' });
        const galleryData = await galleryRes.json();
        if (galleryRes.ok && galleryData.data) {
          const serviceImages = galleryData.data.filter(
            (img: any) => img.serviceType === 'classes' && img.servicePosition >= 1 && img.servicePosition <= 4
          );

          if (serviceImages.length > 0) {
            setPortfolioImages((prev) => {
              const updated = [...prev];
              serviceImages.forEach((img: any) => {
                const idx = img.servicePosition - 1;
                if (idx >= 0 && idx < 4) {
                  updated[idx] = img.imageUrl;
                }
              });
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching portfolio images:', err);
      }
    }
    fetchData();
  }, []);

  return (
    <main className={styles.servicePage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextTop}>
              <span className={styles.heroTag}>Learn. Create. Inspire.</span>
              <h1 className={styles.heroTitle}>
                Photoshoot <span className={styles.titleHighlight}>Classes</span>
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className={styles.dividerLine} />
              </div>

              <p className={styles.heroDesc}>
                Master the art of photography with hands-on classes taught by industry professionals. Whether you are just picking up a camera for the first time or looking to refine your advanced creative skills, our courses are designed to help you understand your gear, control lighting, and master composition.
              </p>
              <p className={styles.heroDesc}>
                Step beyond auto mode and learn to capture emotions, movement, and light in ways that tell powerful visual stories. Join a vibrant community of passionate learners and gain the confidence to create stunning, exhibition-worthy portraits and landscape frames.
              </p>
            </div>

            <div className={styles.btnGroup}>
              <Link href="/booking" className={styles.btnSolid}>
                Book a Class
              </Link>
              <Link href="/gallery" className={styles.btnOutline}>
                View Schedule
              </Link>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <Image
              src="/images/Photography classes.png"
              alt="DSLR Camera on wooden desk with notebooks, lens, and stationery"
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
          {/* Feature 1 */}
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Beginner to Advanced</span>
              <span className={styles.featureDesc}>Courses for all skill levels and goals.</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Practical & Hands-On</span>
              <span className={styles.featureDesc}>Learn by doing with real shoots and assignments.</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Latest Equipment</span>
              <span className={styles.featureDesc}>Access to professional gear and lighting.</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Creative Community</span>
              <span className={styles.featureDesc}>Connect with fellow photographers.</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Certificate</span>
              <span className={styles.featureDesc}>Get a completion certificate for every course.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Courses Section */}
      <section className={styles.courses}>
        <div className={styles.coursesContainer}>
          <div className={styles.coursesHeader}>
            <span className={styles.sectionTag}>Our Courses</span>
            <h2 className={styles.sectionHeading}>
              Choose the <span className={styles.sectionHighlight}>Right Class</span> for You
            </h2>
          </div>

          <div className={styles.coursesGrid}>
            {/* Course 1 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseName}>Basic Photography</h3>
                <p className={styles.courseDesc}>
                  Understand your camera, exposure, composition and capture better photos.
                </p>
              </div>
              <div className={styles.courseFooter}>
                <div className={styles.courseMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duration</span>
                    <span className={styles.metaVal}>4 Weeks</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Level</span>
                    <span className={styles.metaVal}>Beginner</span>
                  </div>
                </div>
                <button className={styles.detailsBtn}>View Details</button>
              </div>
            </div>

            {/* Course 2 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseName}>DSLR Essentials</h3>
                <p className={styles.courseDesc}>
                  Master your DSLR camera settings and capture stunning images in any situation.
                </p>
              </div>
              <div className={styles.courseFooter}>
                <div className={styles.courseMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duration</span>
                    <span className={styles.metaVal}>6 Weeks</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Level</span>
                    <span className={styles.metaVal}>Beginner to Intermediate</span>
                  </div>
                </div>
                <button className={styles.detailsBtn}>View Details</button>
              </div>
            </div>

            {/* Course 3 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseName}>Studio Lighting</h3>
                <p className={styles.courseDesc}>
                  Learn studio lighting techniques and create professional portraits and product...
                </p>
              </div>
              <div className={styles.courseFooter}>
                <div className={styles.courseMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duration</span>
                    <span className={styles.metaVal}>8 Weeks</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Level</span>
                    <span className={styles.metaVal}>Intermediate</span>
                  </div>
                </div>
                <button className={styles.detailsBtn}>View Details</button>
              </div>
            </div>

            {/* Course 4 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseName}>Advanced Composition</h3>
                <p className={styles.courseDesc}>
                  Take your creativity to the next level and develop your unique visual style.
                </p>
              </div>
              <div className={styles.courseFooter}>
                <div className={styles.courseMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duration</span>
                    <span className={styles.metaVal}>4 Weeks</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Level</span>
                    <span className={styles.metaVal}>Advanced</span>
                  </div>
                </div>
                <button className={styles.detailsBtn}>View Details</button>
              </div>
            </div>
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
            {/* Package 1 */}
            <div className={styles.packageCard}>
              <div>
                <span className={styles.packageName}>Basic</span>
                <div className={styles.packagePrice}>{prices.basic}</div>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>4 Weeks Course Duration</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Weekly Hands-on Assignments</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Basic Camera & Gear Guide</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Certificate of Completion</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Access to Student Community</span>
                  </li>
                </ul>
              </div>
              <Link href="/booking" className={styles.chooseBtn}>
                Choose Package
              </Link>
            </div>

            {/* Package 2 */}
            <div className={`${styles.packageCard} ${styles.highlightedCard}`}>
              <span className={styles.popularBadge}>Most Popular</span>
              <div>
                <span className={styles.packageName}>Standard</span>
                <div className={styles.packagePrice}>{prices.standard}</div>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>8 Weeks Course Duration</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Studio Lighting & Gear Access</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Live Shoot Sessions</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>1-on-1 Portfolio Reviews</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Certificate of Completion</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Access to Student Community</span>
                  </li>
                </ul>
              </div>
              <Link href="/booking" className={styles.chooseBtnSolid}>
                Choose Package
              </Link>
            </div>

            {/* Package 3 */}
            <div className={styles.packageCard}>
              <div>
                <span className={styles.packageName}>Premium</span>
                <div className={styles.packagePrice}>{prices.premium}</div>
                <ul className={styles.packageInclusionsList}>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>12 Weeks Masterclass</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Unlimited Studio Access</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Agency Placement Prep</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Personal Exhibition Gallery</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Lifetime Mentorship Access</span>
                  </li>
                  <li className={styles.inclusionItem}>
                    <svg className={styles.inclusionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Certificate of Completion</span>
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

      {/* 5. Portfolio Showcase */}
      <section className={styles.portfolio}>
        <div className={styles.portfolioContainer}>
          <div className={styles.packagesHeader}>
            <span className={styles.sectionTag}>Classes Portfolio</span>
            <h2 className={styles.sectionHeading}>
              Captured by <span className={styles.sectionHighlight}>Our Students & Mentors</span>
            </h2>
          </div>

          <div className={styles.portfolioGrid}>
            {portfolioImages.map((src, idx) => (
              <div key={idx} className={styles.portfolioCard}>
                <Image
                  src={src}
                  alt={`Classes portfolio showcase ${idx + 1}`}
                  fill
                  className={styles.portfolioImage}
                />
              </div>
            ))}
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
