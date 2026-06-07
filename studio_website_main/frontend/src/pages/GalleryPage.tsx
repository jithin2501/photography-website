'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/GalleryPage.css';

const categories = ['All', 'Maternity', 'Newborn', 'Milestone', 'Family', 'Couples', 'Events'];

export default function GalleryPageContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/gallery-images');
        const data = await res.json();
        if (res.ok && data.data) {
          const mapped = data.data.map((item: any) => ({
            id: item.id || item._id,
            category: item.category,
            title: item.title || '',
            image: item.imageUrl || item.image || '',
          }));
          setGalleryItems(mapped);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter Logic
  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setIsLoadingMore(false);
    }, 800);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(9); // Reset initial view size when filters change
  };

  return (
    <main className={styles.galleryPage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextTop}>
              <span className={styles.heroTag}>Capturing Real Moments</span>
              <h1 className={styles.heroTitle}>
                Our Gallery <span className={styles.titleHighlight}>Timeless Memories</span>
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className={styles.dividerLine} />
              </div>

              <p className={styles.heroDesc}>
                Every picture has a beautiful story to tell. Explore our curated photography gallery portfolios and get inspired by magical moments captured with absolute love, premium creativity, and artistic passion.Every picture has a beautiful story to tell. Explore our curated photography gallery portfolios and get inspired by magical
              </p>
            </div>

            <div className={styles.btnGroup}>
              <Link href="/booking" className={styles.btnSolid}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a Class
              </Link>
              <Link href="/booking#booking-form-section" className={styles.btnOutline}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                View Schedule
              </Link>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <Image
              src="/images/gallery-hero.png"
              alt="Professional camera bag backpack, camera equipment body, lenses, plant on dark concrete workspace table"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* 2. Feature Banner Section */}
      <section className={styles.featuresBanner}>
        <div className={styles.bannerContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>High Quality</span>
              <span className={styles.featureDesc}>Professionally edited high-resolution images</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Real Moments</span>
              <span className={styles.featureDesc}>Natural expressions and candid captures</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Creative Vision</span>
              <span className={styles.featureDesc}>Unique angles, directions & storytelling</span>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.featureDetails}>
              <span className={styles.featureTitle}>Client Happiness</span>
              <span className={styles.featureDesc}>Your memories are our absolute top priority</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Navigation & Main Gallery Grid */}
      <section className={styles.galleryMain}>
        {/* Pills */}
        <div className={styles.filterContainer}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterPill} ${activeCategory === category ? styles.activePill : ''
                }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className={styles.gridContainer}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
              <p>Loading Timeless Memories...</p>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {displayedItems.map((item) => (
                <div key={item.id} className={styles.imageCard}>
                  <Image
                    src={item.image}
                    alt={`${item.category} photoshoot: ${item.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.galleryImage}
                  />
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardCategory}>{item.category}</span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Trigger */}
        {filteredItems.length > visibleCount && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={styles.loadMoreBtn}
          >
            {isLoadingMore ? (
              <>Loading More...</>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Load More
              </>
            )}
          </button>
        )}
      </section>

      {/* 4. Bottom Instagram Promotion Banner */}
      <section className={styles.instagramBanner}>
        <div className={styles.instaCard}>
          <div className={styles.instaContent}>
            <div className={styles.instaIconBox}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div className={styles.instaText}>
              <h3 className={styles.instaTitle}>Want to See More Beautiful Moments?</h3>
              <p className={styles.instaDesc}>
                Follow us on Instagram for daily updates, gorgeous photoshoot sessions, and behind-the-scenes.
              </p>
            </div>
          </div>
          <Link href="https://instagram.com" target="_blank" className={styles.instaBtn}>
            Follow Us On Instagram
          </Link>
        </div>
      </section>
    </main>
  );
}
