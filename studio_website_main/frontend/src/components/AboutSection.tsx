'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/About.css';

export default function AboutSection() {
  const [stats, setStats] = useState({ happyClients: 500, photoshoots: 1000, clientSatisfaction: 99 });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          setStats({
            happyClients: data.data.happyClients,
            photoshoots: data.data.photoshoots,
            clientSatisfaction: data.data.clientSatisfaction !== undefined ? data.data.clientSatisfaction : 99,
          });
        }
      } catch (err) {
        console.error('Error fetching settings for AboutSection:', err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutContainer}>
        {/* Left Side: Dynamic Masonry Image Grid */}
        <div className={styles.aboutGrid}>
          <div className={`${styles.aboutImage} ${styles.imgTopLeft}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80"
              alt="Transforming Vision - Mountains Sunset Gown Portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className={`${styles.aboutImage} ${styles.imgTopRight}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
              alt="Cinematic Maternity Portrait Sunset Desert"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={`${styles.aboutImage} ${styles.imgBottomLeft}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=800&q=80"
              alt="Visual Reality - Outdoor Scenic Hills Couple Photoshoot"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={`${styles.aboutImage} ${styles.imgBottomRight}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
              alt="Cozy Family Maternity Newborn Moments"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right Side: Typography and Stats */}
        <div className={styles.aboutContent}>
          <span className={styles.tag}>About Us</span>
          <h2 className={styles.heading}>
            <span className={styles.highlightText}>Transforming</span>
            <br />
            <span className={styles.highlightText}>Vision</span>
            <br />
            into Visual Reality
          </h2>
          <p className={styles.description}>
            At AuraLens Studio, we believe every frame tells a story. Our
            cinematic approach to photography blends high-end technical precision
            with a profound understanding of lighting and mood. We don't just
            capture images; we sculpt visual narratives that resonate with depth
            and emotion, elevating your brand to its most compelling visual expression.
          </p>

          {/* Statistics Grid */}
          <div className={styles.statsWrapper}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.happyClients}+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.photoshoots}+</span>
              <span className={styles.statLabel}>Captures</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.clientSatisfaction}%</span>
              <span className={styles.statLabel}>Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
