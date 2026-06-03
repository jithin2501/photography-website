'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Reviews.module.css';

interface ReviewItem {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 1,
    name: 'Ananya & Rohan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: "Absolutely magical! They captured every little emotion beautifully. We couldn't have asked for more.",
  },
  {
    id: 2,
    name: 'Meera & Arjun',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'The team is incredibly talented! Professional, patient, and they made us feel so comfortable.',
  },
  {
    id: 3,
    name: 'Sneha & Kabir',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Stunning photos! The quality and attention to detail are top-notch. Highly recommended!',
  },
];

interface PolaroidItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  styleClass: string;
}

const POLAROIDS_DATA: PolaroidItem[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80',
    alt: 'First Steps',
    caption: 'First Steps',
    styleClass: styles.pol1,
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80',
    alt: 'Sunset Love',
    caption: 'Sunset Love',
    styleClass: styles.pol2,
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    alt: 'New Beginnings',
    caption: 'New Beginnings',
    styleClass: styles.pol3,
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300&q=80',
    alt: 'Tiny Toes',
    caption: 'Tiny Toes',
    styleClass: styles.pol4,
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    alt: 'Our Family',
    caption: 'Our Family',
    styleClass: styles.pol5,
  },
];

export default function ReviewsSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className={styles.reviews}>
      <div className={styles.reviewsContainer}>
        {/* Header Title Area */}
        <div className={styles.headerArea}>
          <span className={styles.tag}>Review</span>
          <h2 className={styles.heading}>
            Experiences That Speak <span className={styles.highlightText}>Louder Than Words</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        {/* Content Section */}
        <div className={styles.contentGrid}>
          {/* Left Column: Unique Polaroid Collage */}
          <div className={styles.leftCol}>
            {POLAROIDS_DATA.map((pol) => (
              <div key={pol.id} className={`${styles.polaroid} ${pol.styleClass}`}>
                {/* Image */}
                <div className={styles.polaroidImageWrapper}>
                  <Image
                    src={pol.src}
                    alt={pol.alt}
                    fill
                    sizes="150px"
                    className={styles.polaroidImg}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Statistics & Reviews Slider */}
          <div className={styles.rightCol}>
            {/* Top Statistics Board */}
            <div className={styles.statsBoard}>
              {/* Stat 1: Overall Rating */}
              <div className={styles.statCol}>
                <span className={styles.ratingNumber}>4.9</span>
                <span className={styles.starsMini}>★★★★★</span>
                <span className={styles.statLabel}>Overall Rating</span>
              </div>

              {/* Stat 2: Happy Clients */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
                  </svg>
                </div>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Happy Clients</span>
              </div>

              {/* Stat 3: Photoshoots */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Photoshoots</span>
              </div>

              {/* Stat 4: Awards Won */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span className={styles.statNumber}>20+</span>
                <span className={styles.statLabel}>Awards Won</span>
              </div>
            </div>

            {/* Testimonials Slider */}
            <div className={styles.sliderContainer}>
              <div className={styles.reviewsGrid}>
                {REVIEWS_DATA.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    {/* Client Avatar */}
                    <div className={styles.avatarWrapper}>
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="70px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    {/* Client Name */}
                    <h3 className={styles.clientName}>{review.name}</h3>
                    {/* Rating Stars */}
                    <div className={styles.stars}>
                      {Array.from({ length: review.rating }).map((_, i) => '★')}
                    </div>
                    {/* Review Text */}
                    <p className={styles.reviewText}>"{review.text}"</p>
                  </div>
                ))}
              </div>

              {/* Slider Dots & Arrow Navigation */}
              <div className={styles.sliderControls}>
                <button 
                  className={styles.arrowBtn}
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1))}
                  aria-label="Previous Review"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
                
                <div className={styles.dots}>
                  {REVIEWS_DATA.map((_, idx) => (
                    <div
                      key={idx}
                      className={`${styles.dot} ${activeSlide === idx ? styles.dotActive : ''}`}
                      onClick={() => setActiveSlide(idx)}
                    />
                  ))}
                </div>

                <button 
                  className={styles.arrowBtn}
                  onClick={() => setActiveSlide((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1))}
                  aria-label="Next Review"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
