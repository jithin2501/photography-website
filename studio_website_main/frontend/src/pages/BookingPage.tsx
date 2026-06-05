'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Booking.module.css';

export default function BookingPageContent() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    photoshootType: '',
    date: '',
    time: '',
    locationPreference: '',
    packageName: '',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        photoshootType: '',
        date: '',
        time: '',
        locationPreference: '',
        packageName: '',
        details: '',
      });
    }, 1500);
  };

  return (
    <main className={styles.bookingPage}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextTop}>
              <span className={styles.heroTag}>Let's create something beautiful</span>
              <h1 className={styles.heroTitle}>
                Book Your <span className={styles.titleHighlight}>Photoshoot</span>
              </h1>

              <div className={styles.dividerContainer}>
                <div className={styles.dividerLine} />
                <div className={styles.cameraIcon}>
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
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <div className={styles.dividerLine} />
              </div>

              <p className={styles.heroDesc}>
                We can't wait to capture your special moments. Fill out the form below, customize your session details, and let's plan your perfect photoshoot experience.
              </p>
            </div>

            {/* Quick Features Row */}
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <div className={styles.featureBadge}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <polyline points="16 13 9 20 6 17" />
                  </svg>
                </div>
                <span className={styles.featureTitle}>Easy Booking</span>
                <span className={styles.featureDesc}>Simple & quick digital process</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureBadge}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className={styles.featureTitle}>Secure & Safe</span>
                <span className={styles.featureDesc}>Your information is protected</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureBadge}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className={styles.featureTitle}>Quick Response</span>
                <span className={styles.featureDesc}>Get a reply within 24 hours</span>
              </div>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <Image
              src="/images/booking-hero.png"
              alt="Professional camera on stand next to a vase with dried flowers in a dark studio setting"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* 2. Form & Details Grid */}
      <section className={styles.bookingSection} id="booking-form-section">
        <div className={styles.bookingContainer}>
          {/* Left Column: Form Card */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIcon}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h2 className={styles.formCardTitle}>Book Your Session</h2>
              </div>

              {isSubmitted ? (
                <div className={styles.successCard}>
                  <div className={styles.successIcon}>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className={styles.successTitle}>Booking Requested!</h3>
                  <p className={styles.successText}>
                    Thank you for requesting a session. Our team will review your preferred date and contact you within 24 hours to confirm your booking and plan details.
                  </p>
                  <button
                    className={styles.submitBtn}
                    onClick={() => setIsSubmitted(false)}
                    style={{ width: 'auto', padding: '12px 30px' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.bookingForm}>
                  <div className={styles.rowInputs}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="fullName" className={styles.inputLabel}>
                        Full Name<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.inputLabel}>
                        Email Address<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.rowInputs}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="phone" className={styles.inputLabel}>
                        Phone Number<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="photoshootType" className={styles.inputLabel}>
                        Photoshoot Type<span className={styles.required}>*</span>
                      </label>
                      <select
                        id="photoshootType"
                        name="photoshootType"
                        required
                        value={formData.photoshootType}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                      >
                        <option value="" disabled>Select photoshoot type</option>
                        <option value="maternity">Maternity Photoshoot</option>
                        <option value="newborn">Newborn Photoshoot</option>
                        <option value="milestone">Milestone Photoshoot</option>
                        <option value="classes">Photoshoot Classes</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.rowInputs}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="date" className={styles.inputLabel}>
                        Photoshoot Date<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="time" className={styles.inputLabel}>
                        Preferred Time<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.rowInputs}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="locationPreference" className={styles.inputLabel}>
                        Location Preference
                      </label>
                      <select
                        id="locationPreference"
                        name="locationPreference"
                        value={formData.locationPreference}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                      >
                        <option value="">Select location preference</option>
                        <option value="studio">In Studio</option>
                        <option value="outdoor">Outdoor / On-location</option>
                        <option value="custom">Custom Location (Detail below)</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="packageName" className={styles.inputLabel}>
                        Packages
                      </label>
                      <select
                        id="packageName"
                        name="packageName"
                        value={formData.packageName}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                      >
                        <option value="">Select package tier</option>
                        <option value="basic">Basic Package</option>
                        <option value="standard">Standard Package</option>
                        <option value="premium">Premium Package</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="details" className={styles.inputLabel}>
                      Tell us more about your session
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      placeholder="Any specific ideas, themes, locations or custom requests?"
                      value={formData.details}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? 'Requesting Booking...' : 'Book Now →'}
                  </button>

                  <p className={styles.submitNote}>
                    * Your information is secure and will never be shared.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Information Card */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIcon}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h2 className={styles.formCardTitle}>Session Information</h2>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Photoshoot Types</span>
                    <span className={styles.infoValue}>
                      Maternity, Newborn, Milestone, and Photoshoot Classes
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Session Duration</span>
                    <span className={styles.infoValue}>
                      1 - 3 Hours (Depending on the selected package tier)
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Location</span>
                    <span className={styles.infoValue}>
                      In Studio or Outdoor (As per your custom preference)
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>What's Included?</span>
                    <span className={styles.infoValue}>
                      Professional styling, Edited high-res images, Prints & Digital gallery access
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Area */}
              <div className={styles.questionsBox}>
                <h3 className={styles.questionsTitle}>Have Questions?</h3>
                <p className={styles.questionsText}>
                  We're here to help! Reach out to us and we'll guide you through our session choices.
                </p>
                <Link href="/contact" className={styles.contactBtn}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Booking Process Section */}
      <section className={styles.processSection}>
        <h2 className={styles.processTitle}>Our Booking Process</h2>
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={styles.stepBadge}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>01. Book</h3>
            <p className={styles.stepDesc}>
              Fill out the booking form with your desired photoshoot details.
            </p>
          </div>

          <div className={styles.processStep}>
            <div className={styles.stepBadge}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>02. Confirm</h3>
            <p className={styles.stepDesc}>
              Our team checks availability and confirms your session window.
            </p>
          </div>

          <div className={styles.processStep}>
            <div className={styles.stepBadge}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>03. Photoshoot</h3>
            <p className={styles.stepDesc}>
              Enjoy your customized photoshoot session at our studio or location.
            </p>
          </div>

          <div className={styles.processStep}>
            <div className={styles.stepBadge}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>04. Editing</h3>
            <p className={styles.stepDesc}>
              Our experts select and professionally color-grade/retouch your images.
            </p>
          </div>

          <div className={styles.processStep}>
            <div className={styles.stepBadge}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>05. Delivery</h3>
            <p className={styles.stepDesc}>
              Access and download your digital collection through our premium gallery portal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
