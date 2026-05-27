'use client';

import { useRef, useEffect } from 'react';
import styles from '@/styles/Hero.module.css';
import { ArchIcon } from '@/types';

interface ArchWheelProps {
  icons: ArchIcon[];
  activeIndex: number;
  onIconClick: (index: number, icon: ArchIcon) => void;
}

const iconPositionClasses: string[] = [
  styles.icon1,
  styles.icon2,
  styles.icon3,
  styles.icon4,
  styles.icon5,
  styles.icon6,
  styles.icon7,
  styles.icon8,
  styles.icon9,
  styles.icon10,
];

export default function ArchWheel({ icons, activeIndex, onIconClick }: ArchWheelProps) {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastApexIndex = useRef<number>(-1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const monitorApex = () => {
      const iconEls = iconRefs.current.filter(Boolean) as HTMLDivElement[];
      if (iconEls.length === 0) {
        rafRef.current = requestAnimationFrame(monitorApex);
        return;
      }

      const centerY = window.innerHeight / 2;
      let closestIcon: HTMLDivElement | null = null;
      let minDistance = Infinity;
      let closestIndex = -1;

      iconEls.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(iconCenterY - centerY);

        const thresholdX = window.innerWidth - 80;
        if (iconCenterX > thresholdX) {
          icon.style.opacity = '0';
          icon.style.pointerEvents = 'none';
        } else {
          icon.style.opacity = '1';
          icon.style.pointerEvents = 'auto';
          if (distance < minDistance) {
            minDistance = distance;
            closestIcon = icon;
            closestIndex = index;
          }
        }
      });

      if (
        closestIndex !== -1 &&
        closestIndex !== lastApexIndex.current &&
        minDistance < 30
      ) {
        closestIcon!.click();
        lastApexIndex.current = closestIndex;
      }

      rafRef.current = requestAnimationFrame(monitorApex);
    };

    rafRef.current = requestAnimationFrame(monitorApex);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={styles.archWheel}>
      {icons.map((icon, index) => (
        <div
          key={icon.id}
          ref={(el: HTMLDivElement | null) => { iconRefs.current[index] = el; }}
          className={`${styles.archIcon} ${iconPositionClasses[index]} ${
            activeIndex === index ? styles.active : ''
          }`}
          style={{ backgroundImage: `url('${icon.imageUrl}')` }}
          onClick={() => onIconClick(index, icon)}
          role="button"
          tabIndex={0}
          aria-label={icon.title}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') onIconClick(index, icon);
          }}
        />
      ))}
    </div>
  );
}
