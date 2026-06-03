'use client';

import Image from 'next/image';
import styles from '@/styles/About.module.css';

export default function AboutSection() {
  return (
    <section className={styles.about}>
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
              <span className={styles.statValue}>150+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>2000+</span>
              <span className={styles.statLabel}>Captures</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>99%</span>
              <span className={styles.statLabel}>Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
