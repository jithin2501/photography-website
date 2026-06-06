'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import styles from '@/styles/Hero.css';
import ArchWheel from './ArchWheel';
import { archIcons } from '@/data/archIcons';
import { ArchIcon, HeroState } from '@/types';

export default function HeroSection() {
  const [heroState, setHeroState] = useState<HeroState>({
    activeIndex: 0,
    title: archIcons[0].title,
    description: archIcons[0].description,
    bgImageUrl: archIcons[0].imageUrl,
  });

  const [layer1Url, setLayer1Url] = useState<string>(archIcons[0].imageUrl);
  const [layer2Url, setLayer2Url] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<1 | 2>(1);
  const [textFade, setTextFade] = useState<boolean>(false);

  const handleIconClick = useCallback(
    (index: number, icon: ArchIcon) => {
      if (index === heroState.activeIndex) return;

      // Fade text out
      setTextFade(true);

      // Preload image
      const img = new window.Image();
      img.src = icon.imageUrl;
      img.onload = () => {
        if (activeLayer === 1) {
          setLayer2Url(icon.imageUrl);
          setActiveLayer(2);
        } else {
          setLayer1Url(icon.imageUrl);
          setActiveLayer(1);
        }
      };

      setTimeout(() => {
        setHeroState({
          activeIndex: index,
          title: icon.title,
          description: icon.description,
          bgImageUrl: icon.imageUrl,
        });
        setTextFade(false);
      }, 300);
    },
    [heroState.activeIndex, activeLayer]
  );

  return (
    <section className={styles.hero}>
      {/* Background layers */}
      <div
        className={`${styles.heroBgLayer} ${activeLayer !== 1 ? styles.hidden : ''}`}
        style={{ backgroundImage: layer1Url ? `url('${layer1Url}')` : undefined }}
      />
      <div
        className={`${styles.heroBgLayer} ${activeLayer !== 2 ? styles.hidden : ''}`}
        style={{ backgroundImage: layer2Url ? `url('${layer2Url}')` : undefined }}
      />

      {/* Dark overlay */}
      <div className={styles.heroOverlay} />

      {/* Centered content container */}
      <div className={styles.heroContainer}>
        {/* Left hero content */}
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>Professional Excellence</div>
          <h1 className={styles.heroH1}>
            Turning moments
            <br />
            into timeless
            <br />
            memories.
          </h1>
          <p className={styles.heroP}>
            Curated photography across portraits, lifestyle, and events. Experience
            storytelling through a lens of precision and creativity.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="#" className={styles.whatsappBtn}>
              Get Started
            </Link>
            <Link href="#" className={styles.viewBtn}>
              Full Portfolio
            </Link>
          </div>
        </div>

        {/* Arch / Wheel UI */}
        <div className={styles.archSection}>
          <div className={styles.archContainer}>
            <ArchWheel
              icons={archIcons}
              activeIndex={heroState.activeIndex}
              onIconClick={handleIconClick}
            />

            <div className={styles.archCenterText}>
              <h2 className={textFade ? styles.fade : ''}>
                {heroState.title}
              </h2>
              <p className={textFade ? styles.fade : ''}>
                {heroState.description}
              </p>
              <Link href="#" className={styles.followBtn}>
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
