'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Gallery.module.css';

interface GalleryColumn {
  id: number;
  images: {
    src: string;
    alt: string;
    styleClass: string;
  }[];
}

const GALLERY_DATA: GalleryColumn[] = [
  {
    id: 1,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80',
        alt: 'Newborn Baby Portrait',
        styleClass: styles.col1,
      },
      {
        src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=500&q=80',
        alt: 'Parents Holding Newborn',
        styleClass: styles.col1,
      },
    ],
  },
  {
    id: 2,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80',
        alt: 'Sleeping Baby Hammock',
        styleClass: styles.col2,
      },
      {
        src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=500&q=80',
        alt: 'Maternity Dress Scenic',
        styleClass: styles.col2,
      },
      {
        src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80',
        alt: 'Baby Hanging Nest',
        styleClass: styles.col2,
      },
    ],
  },
  {
    id: 3,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
        alt: 'Maternity Red Gown Portrait',
        styleClass: styles.col3,
      },
    ],
  },
  {
    id: 6,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        alt: 'Green Maternity Gown Session',
        styleClass: styles.col6,
      },
    ],
  },
  {
    id: 7,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdda4b?auto=format&fit=crop&w=500&q=80',
        alt: 'Baby Nest Hanging Portrait',
        styleClass: styles.col7,
      },
      {
        src: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80',
        alt: 'Child Sitting in Chair',
        styleClass: styles.col7,
      },
      {
        src: 'https://images.unsplash.com/photo-1546167198-4f968798af4f?auto=format&fit=crop&w=500&q=80',
        alt: 'Newborn Sleeping Cozy Hammock',
        styleClass: styles.col7,
      },
    ],
  },
  {
    id: 8,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1551972251-12cb7248e47f?auto=format&fit=crop&w=500&q=80',
        alt: 'Outdoor Blue Maternity Gown',
        styleClass: styles.col8,
      },
      {
        src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80',
        alt: 'Scenic Maternity Photoshoot Forest',
        styleClass: styles.col8,
      },
    ],
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.galleryContainer}>
        {/* Header Title Area */}
        <div className={styles.headerArea}>
          <span className={styles.tag}>Gallery</span>
          <h2 className={styles.heading}>
            A Visual Showcase <span className={styles.highlightText}>of Our Work</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        {/* Gallery Arch Grid */}
        <div className={styles.galleryGrid}>
          {GALLERY_DATA.map((column) => (
            <div key={column.id} className={styles.column}>
              {column.images.map((img, idx) => (
                <div key={idx} className={`${styles.imageWrapper} ${img.styleClass}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16.6vw"
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className={styles.btnContainer}>
          <Link href="/gallery" style={{ textDecoration: 'none' }}>
            <button className={styles.viewAllBtn}>View Gallery</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
