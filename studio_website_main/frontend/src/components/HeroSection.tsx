'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Hero.css';
import ArchWheel from './ArchWheel';
import { ArchIcon, HeroState } from '@/types';

export default function HeroSection() {
  const [icons, setIcons] = useState<ArchIcon[]>([]);
  const [heroState, setHeroState] = useState<HeroState | null>(null);

  const [layer1Url, setLayer1Url] = useState<string>('');
  const [layer2Url, setLayer2Url] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<1 | 2>(1);
  const [textFade, setTextFade] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/wheel-images')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          const mapped = data.data
            .filter((item: any) => item.slot >= 1 && item.slot <= 9)
            .map((item: any) => ({
              id: item.slot,
              imageUrl: item.imageUrl,
              title: item.title,
              description: item.description,
            }));
          setIcons(mapped);
          setHeroState({
            activeIndex: 0,
            title: mapped[0].title,
            description: mapped[0].description,
            bgImageUrl: mapped[0].imageUrl,
          });
          setLayer1Url(mapped[0].imageUrl);
        }
      })
      .catch((err) => console.error('Error fetching dynamic wheel images:', err));
  }, []);

  const handleIconClick = useCallback(
    (index: number, icon: ArchIcon) => {
      if (!heroState || index === heroState.activeIndex) return;

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
    [heroState, activeLayer]
  );

  return (
    <section className={styles.hero}>
      {/* Background layers */}
      {layer1Url && (
        <div
          className={`${styles.heroBgLayer} ${activeLayer !== 1 ? styles.hidden : ''}`}
          style={{ backgroundImage: `url('${layer1Url}')` }}
        />
      )}
      {layer2Url && (
        <div
          className={`${styles.heroBgLayer} ${activeLayer !== 2 ? styles.hidden : ''}`}
          style={{ backgroundImage: `url('${layer2Url}')` }}
        />
      )}

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

        {/* Arch / Wheel UI (Only rendered when dynamic icons are loaded) */}
        {icons.length > 0 && heroState && (
          <div className={styles.archSection}>
            <div className={styles.archContainer}>
              <ArchWheel
                icons={icons}
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
        )}
      </div>
    </section>
  );
}
