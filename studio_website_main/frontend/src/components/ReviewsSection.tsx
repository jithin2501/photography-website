'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/Reviews.css';

interface ReviewItem {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [stats, setStats] = useState({ happyClients: 500, photoshoots: 1000, awardsWon: 20 });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          setStats({
            happyClients: data.data.happyClients,
            photoshoots: data.data.photoshoots,
            awardsWon: data.data.awardsWon,
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchApprovedReviews() {
      try {
        const response = await fetch('http://localhost:5000/api/reviews', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          const mappedReviews = data.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name)}&backgroundType=gradientLinear&fontFamily=Arial`,
            rating: r.rating,
            text: r.message,
          }));
          setReviews(mappedReviews);
        }
      } catch (err) {
        console.error('Error fetching approved reviews:', err);
      }
    }
    fetchApprovedReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentGroupIndex((prev) => {
          const totalGroups = Math.ceil(reviews.length / 3);
          return (prev + 1) % totalGroups;
        });
        setIsTransitioning(false);
      }, 600); // Wait for fade-out to complete
    }, 15000); // 15 seconds gap

    return () => clearInterval(interval);
  }, [reviews, isHovered]);

  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    if (reviews.length <= 3) return reviews;

    const startIndex = (currentGroupIndex * 3) % reviews.length;
    const sliced = reviews.slice(startIndex, startIndex + 3);

    if (sliced.length < 3) {
      const needed = 3 - sliced.length;
      return [...sliced, ...reviews.slice(0, needed)];
    }
    return sliced;
  };

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
                <span className={styles.statNumber}>{stats.happyClients}+</span>
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
                <span className={styles.statNumber}>{stats.photoshoots}+</span>
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
                <span className={styles.statNumber}>{stats.awardsWon}+</span>
                <span className={styles.statLabel}>Awards Won</span>
              </div>
            </div>

            {/* Testimonials Slider */}
            <div 
              className={styles.sliderContainer}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`${styles.reviewsGrid} ${isTransitioning ? styles.animating : ''}`}>
                {getVisibleReviews().map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    {/* Client Avatar */}
                    <div className={styles.avatarWrapper}>
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="70px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                    {/* Client Name */}
                    <h3 className={styles.clientName}>{review.name}</h3>
                    {/* Rating Stars */}
                    <div className={styles.stars}>
                      {Array.from({ length: review.rating }).map((_, i) => '★')}
                    </div>
                    {/* Review Text */}
                    <p className={styles.reviewText}>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
