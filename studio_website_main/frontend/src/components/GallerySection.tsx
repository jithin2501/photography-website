'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Gallery.css';

interface GalleryColumn {
  id: number;
  images: {
    src: string;
    alt: string;
    styleClass: string;
  }[];
}

interface DBGalleryImage {
  id?: string;
  _id?: string;
  imageUrl: string;
  category: string;
  title: string;
  showcasePosition?: number;
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
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80',
        alt: 'Baby Nest Hanging Portrait',
        styleClass: styles.col7,
      },
      {
        src: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80',
        alt: 'Child Sitting in Chair',
        styleClass: styles.col7,
      },
      {
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80',
        alt: 'Newborn Sleeping Cozy Hammock',
        styleClass: styles.col7,
      },
    ],
  },
  {
    id: 8,
    images: [
      {
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80',
        alt: 'Outdoor Blue Maternity Gown',
        styleClass: styles.col8,
      },
      {
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80',
        alt: 'Scenic Maternity Photoshoot Forest',
        styleClass: styles.col8,
      },
    ],
  },
];

export default function GallerySection() {
  const [columns, setColumns] = useState<GalleryColumn[]>(GALLERY_DATA);

  useEffect(() => {
    async function loadShowcase() {
      try {
        const response = await fetch('http://localhost:5000/api/gallery-images', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          const allImages: DBGalleryImage[] = data.data;
          
          const newColumns = GALLERY_DATA.map(col => ({
            ...col,
            images: col.images.map(img => ({ ...img }))
          }));

          allImages.forEach((img) => {
            const pos = img.showcasePosition;
            if (pos && pos >= 1 && pos <= 12) {
              let colIdx = 0;
              let imgIdx = 0;

              if (pos === 1) { colIdx = 0; imgIdx = 0; }
              else if (pos === 2) { colIdx = 0; imgIdx = 1; }
              else if (pos === 3) { colIdx = 1; imgIdx = 0; }
              else if (pos === 4) { colIdx = 1; imgIdx = 1; }
              else if (pos === 5) { colIdx = 1; imgIdx = 2; }
              else if (pos === 6) { colIdx = 2; imgIdx = 0; }
              else if (pos === 7) { colIdx = 3; imgIdx = 0; }
              else if (pos === 8) { colIdx = 4; imgIdx = 0; }
              else if (pos === 9) { colIdx = 4; imgIdx = 1; }
              else if (pos === 10) { colIdx = 4; imgIdx = 2; }
              else if (pos === 11) { colIdx = 5; imgIdx = 0; }
              else if (pos === 12) { colIdx = 5; imgIdx = 1; }

              newColumns[colIdx].images[imgIdx].src = img.imageUrl;
              newColumns[colIdx].images[imgIdx].alt = img.title || 'Showcase Image';
            }
          });

          setColumns(newColumns);
        }
      } catch (err) {
        console.error('Error fetching showcase images:', err);
      }
    }
    loadShowcase();
  }, []);

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
          {columns.map((column) => (
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
