'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import styles from '@/styles/Contact.module.css';

export default function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <main className={styles.contactPage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Get in touch</span>
            <h1 className={styles.heroTitle}>
              Contact <span className={styles.titleHighlight}>Us</span>
            </h1>

            <div className={styles.dividerContainer}>
              <div className={styles.dividerLine} />
              <div className={styles.houseIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className={styles.dividerLine} />
            </div>

            <p className={styles.heroDesc}>
              We'd love to hear from you! Whether you have a question about our
              services, want to book a session, or just want to say hello, feel
              free to reach out.
            </p>

            <button
              className={styles.bookBtn}
              onClick={() => {
                const element = document.getElementById('book-now-btn');
                if (element) {
                  element.click();
                } else {
                  alert('Booking calendar is loading, please try again shortly!');
                }
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book a session
            </button>
          </div>

          <div className={styles.heroImageContainer}>
            <Image
              src="https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80"
              alt="Camera resting on photo prints with warm light bokeh"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* 2. Contact Details & Message Form Section */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          {/* Left Column: Contact Information */}
          <div className={styles.infoCol}>
            <div className={styles.infoIntro}>
              <h2 className={styles.infoTitle}>
                Contact <span className={styles.titleHighlight}>Information</span>
              </h2>
              <p className={styles.infoText}>
                Reach out to us for bookings, inquiries, or any questions — we're
                here to capture your perfect moments.
              </p>
            </div>

            <div className={styles.infoList}>
              {/* Item: Phone */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemLabel}>Phone</span>
                  <span className={styles.itemValue}>+1 (123) 456-7890</span>
                </div>
              </div>

              {/* Item: Studio Hours */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemLabel}>Studio Hours</span>
                  <span className={styles.itemValue}>
                    Mon - Sat: 9:00 AM - 7:00 PM{'\n'}Sunday: By Appointment
                  </span>
                </div>
              </div>

              {/* Item: Email */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemLabel}>Email</span>
                  <span className={styles.itemValue}>hello@auralensstudio.com</span>
                </div>
              </div>

              {/* Item: Studio Address */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemLabel}>Studio Address</span>
                  <span className={styles.itemValue}>
                    123 Studio Lane, Creative City,{'\n'}CA 90210, USA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Us a Message Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formCardTitle}>
                Send Us a <span className={styles.titleHighlight}>Message</span>
              </h3>

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder="Message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.formTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>

                {submitMessage && (
                  <p
                    style={{
                      color: '#4caf50',
                      marginTop: '15px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          {/* Map Card */}
          <div className={styles.mapCard}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.2666666666665!2d77.556!3d12.971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c58f0db9%3A0x670f5e4e0bbae5e0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1780550000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Map Description Info */}
          <div className={styles.mapTextCol}>
            <div className={styles.mapTextTop}>
              <span className={styles.mapTag}>Visit our studio</span>
              <h2 className={styles.mapTitle}>
                We'd Love To <span className={styles.titleHighlight}>See You!</span>
              </h2>
              <p className={styles.mapDesc}>
                Our studio is located in the heart of Creative City. Feel free to
                stop by or schedule an appointment Our studio is located in the heart of Creative City. Feel free to stop by or schedule an appointment Our studio is located in the heart of Creative City. Feel free to stop by or schedule an appointment.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=123+Studio+Lane+Creative+City+CA+90210+USA"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button className={styles.directionsBtn}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Get Directions
              </button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
