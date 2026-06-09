'use client';

import { useState } from 'react';
import Link from 'next/link';
import './SubmitReview.css';

export default function SubmitReviewPage() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!message.trim()) {
      setError('Please share your experience in the review message.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          rating,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      setError('Could not connect to the server. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="submitReviewPage">
      <div className="reviewContainer">
        {!isSuccess ? (
          <>
            <div className="header">
              <h1 className="logoText">AURA<span className="highlight">LENS</span></h1>
              <p className="subtitle">Share your experience with us. Your feedback helps us capture memories even better!</p>
            </div>

            {error && <div className="errorBox">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label">Your Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Ananya Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Rating</label>
                <div className="ratingSelector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`starBtn ${(hoverRating !== null ? star <= hoverRating : star <= rating) ? 'starBtnActive' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      disabled={isLoading}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="formGroup">
                <label className="label">Your Review Message</label>
                <textarea
                  className="input textarea"
                  placeholder="Tell us about your shoot experience, our team, or your final gallery photos..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <button type="submit" className="submitBtn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 38 38" stroke="#ffffff" style={{ animation: 'spin 1s linear infinite' }}>
                      <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)" strokeWidth="3">
                          <circle strokeOpacity=".3" cx="18" cy="18" r="18"/>
                          <path d="M36 18c0-9.94-8.06-18-18-18"/>
                        </g>
                      </g>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="successCard">
            <div className="successIconWrapper">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="successTitle">Thank you!</h2>
            <p className="successText">
              Your review has been successfully submitted! It has been sent to our team for moderation and will appear on the main website once approved.
            </p>
            <Link href="/" className="backBtn">
              Back to Home
            </Link>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
