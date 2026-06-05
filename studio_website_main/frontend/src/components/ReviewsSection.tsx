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

export default function ReviewsSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="reviews" className={styles.reviews}>
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
          {/* Left Column: Premium Grid with Badges */}
          <div className={styles.leftCol}>
            {/* Top Large Image */}
            <div className={styles.mainImageContainer}>
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                alt="Featured Portrait"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className={styles.mainImage}
                priority
              />
              {/* Overlay Badge */}
              <div className={styles.badgeOverlay}>
                <div className={styles.avatarStack}>
                  <div className={styles.stackAvatar}>
                    <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Client" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.stackAvatar}>
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Client" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.stackAvatar}>
                    <Image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" alt="Client" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.stackAvatar}>
                    <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" alt="Client" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.stackMore}>
                    500+
                  </div>
                </div>
                <span className={styles.badgeText}>Happy Clients</span>
              </div>
            </div>

            {/* Bottom Row of Three Images */}
            <div className={styles.bottomRow}>
              <div className={styles.subImageContainer}>
                <Image
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80"
                  alt="Baby Photoshoot"
                  fill
                  sizes="200px"
                  className={styles.subImage}
                />
              </div>
              <div className={styles.subImageContainer}>
                <Image
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80"
                  alt="Couple Photoshoot"
                  fill
                  sizes="200px"
                  className={styles.subImage}
                />
              </div>
              <div className={styles.subImageContainer}>
                <Image
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80"
                  alt="Maternity Photoshoot"
                  fill
                  sizes="200px"
                  className={styles.subImage}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Statistics & Reviews Slider */}
          <div className={styles.rightCol}>
            {/* Top Statistics Board */}
            <div className={styles.statsBoard}>
              {/* Stat 1: Overall Rating */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4D00" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className={styles.ratingNumber}>4.9</span>
                <span className={styles.statLabel}>Overall Rating</span>
              </div>

              {/* Stat 2: Happy Clients */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                </div>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Happy Clients</span>
              </div>

              {/* Stat 3: Photoshoots */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Photoshoots</span>
              </div>

              {/* Stat 4: Awards Won */}
              <div className={styles.statCol}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M12 2a6 6 0 0 0-6 6v3.5a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6z" />
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
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
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
