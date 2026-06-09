'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/WhyChooseUs.css';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    id: 1,
    title: 'Professional Equipment',
    description: 'We use industry-leading cameras, lighting, and lenses to ensure every shot is crisp, clear, and perfectly lit.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Creative Vision',
    description: 'Our experienced photographers bring a unique, artistic perspective to every shoot, ensuring your photos stand out.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Fast Turnaround',
    description: 'Get your professionally edited, high-resolution photos delivered quickly without compromising on quality.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export default function WhyChooseUsSection() {
  const [happyClients, setHappyClients] = useState(500);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          setHappyClients(data.data.happyClients);
        }
      } catch (err) {
        console.error('Error fetching settings for WhyChooseUs:', err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className={styles.whyChoose}>
      <div className={styles.whyChooseContainer}>
        {/* Header Title Area */}
        <div className={styles.headerArea}>
          <span className={styles.tag}>Why Choosing Us</span>
          <h2 className={styles.heading}>
            Why Choose Our <span className={styles.highlightText}>Photography Studio</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        {/* Content Section: 2 Columns */}
        <div className={styles.contentGrid}>
          {/* Left Column: Info & Feature List */}
          <div className={styles.leftCol}>
            <p className={styles.description}>
              We specialize in capturing your most precious moments with an
              artistic approach. Our team uses top-tier equipment and creative
              vision to deliver stunning, high-quality images that tell your unique
              story beautifully.
            </p>

            <div className={styles.featuresList}>
              {FEATURES_DATA.map((feature) => (
                <div key={feature.id} className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    {feature.icon}
                  </div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Layered Layout with Images & Circular Badge */}
          <div className={styles.rightCol}>
            <div className={styles.imageContainer}>
              {/* Background Image (Larger, shifted right) */}
              <div className={styles.bgImageWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                  alt="AuraLens Couple Portrait Session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={styles.image}
                />
              </div>

              {/* Foreground Image (Smaller, overlapping, shifted left) */}
              <div className={styles.fgImageWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="AuraLens Outdoor Photoshoot Model"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className={styles.image}
                />
              </div>

              {/* Overlapping circular badge */}
              <div className={styles.badge}>
                <span className={styles.badgeNumber}>{happyClients.toLocaleString()}+</span>
                <span className={styles.badgeLabel}>Trusted Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
