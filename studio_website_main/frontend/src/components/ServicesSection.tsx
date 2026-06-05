'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Services.module.css';

interface ServiceItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    title: 'Newborn',
    subtitle: 'Photoshoot',
    image: 'https://images.unsplash.com/photo-1544126592-807daf215a3c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Maternity',
    subtitle: 'Photoshoot',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Milestone',
    subtitle: 'Photoshoot',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Travel',
    subtitle: 'Photography',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesContainer}>
        {/* Header Title Area */}
        <div className={styles.headerArea}>
          <span className={styles.tag}>What We Do</span>
          <h2 className={styles.heading}>
            Our Perfect <span className={styles.highlightText}>Services</span>
          </h2>
          <div className={styles.titleLine} />
        </div>

        {/* Services Staggered Grid */}
        <div className={styles.servicesGrid}>
          {SERVICES_DATA.map((service) => {
            const cardInner = (
              <>
                {/* Card Image */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={service.image}
                    alt={`${service.title} ${service.subtitle}`}
                    fill
                    sizes="(max-width: 550px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={styles.cardImage}
                  />
                </div>

                {/* Dark Overlay */}
                <div className={styles.overlay} />

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {service.title}
                    <br />
                    {service.subtitle}
                  </h3>
                </div>
              </>
            );

            if (service.id === 1) {
              return (
                <Link
                  key={service.id}
                  href="/services/newborn"
                  className={styles.card}
                  style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {cardInner}
                </Link>
              );
            }

            if (service.id === 2) {
              return (
                <Link
                  key={service.id}
                  href="/services/maternity"
                  className={styles.card}
                  style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {cardInner}
                </Link>
              );
            }

            if (service.id === 3) {
              return (
                <Link
                  key={service.id}
                  href="/services/milestone"
                  className={styles.card}
                  style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {cardInner}
                </Link>
              );
            }

            return (
              <div key={service.id} className={styles.card}>
                {cardInner}
              </div>
            );
          })}
        </div>

        {/* Bottom Call To Action Button */}
        <div className={styles.btnContainer}>
          <button className={styles.viewAllBtn}>View All Services</button>
        </div>
      </div>
    </section>
  );
}
