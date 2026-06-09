'use client';

import { useEffect, useState } from 'react';
import '../css/ReviewSection.css';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  status: string; // PENDING, APPROVED, DISAPPROVED
  createdAt: number;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate QR code link dynamically
    if (typeof window !== 'undefined') {
      const publicReviewUrl = `${window.location.origin}/reviews/new`;
      // Use qrserver api for clean zero-dependency QR code generation
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicReviewUrl)}`);
    }

    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Admin authentication token missing.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setReviews(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch reviews.');
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        alert(data.error || 'Failed to update review status.');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('An error occurred while updating status.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete review.');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      alert('An error occurred while deleting the review.');
    }
  };

  return (
    <div className="reviewSection">
      {/* Top Banner / Header Area */}
      <div className="sectionHeader">
        <div>
          <h1 className="mainTitle">Reviews Management</h1>
        </div>
        <button className="refreshBtn" onClick={fetchReviews} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="reviewGrid">
        {/* Left Side: QR Code Area */}
        <div className="qrContainer">
          <div className="qrCard">
            <h2 className="cardTitle">QR Code Feedback</h2>
            <p className="cardDesc">Scan this QR code with a phone to access the public review submission form directly.</p>

            {qrCodeUrl ? (
              <div className="qrImageWrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Review QR Code" className="qrImage" />
                <div className="qrOverlay">
                  <span>SCAN TO REVIEW</span>
                </div>
              </div>
            ) : (
              <div className="qrPlaceholder">Generating QR Code...</div>
            )}

            <a
              href={typeof window !== 'undefined' ? `${window.location.origin}/reviews/new` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="formLink"
            >
              Open Form in New Tab
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: Reviews List Moderation */}
        <div className="listContainer">
          <div className="listCard">
            <h2 className="cardTitle">Feedback Moderation Queue</h2>
            {error && <div className="errorBanner">{error}</div>}

            {loading ? (
              <div className="loadingContainer">
                <div className="spinner"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="emptyState">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <p>No reviews found in the system.</p>
              </div>
            ) : (
              <div className="reviewQueue">
                {reviews.map((review) => (
                  <div key={review.id} className={`reviewItem ${review.status.toLowerCase()}`}>
                    <div className="reviewMain">
                      <div className="reviewMeta">
                        <span className="reviewerName">{review.name}</span>
                        <div className="reviewStars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`starIcon ${i < review.rating ? 'active' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className={`statusBadge ${review.status.toLowerCase()}`}>
                          {review.status}
                        </span>
                      </div>
                      <p className="reviewMessage">"{review.message}"</p>
                      <span className="reviewTime">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="reviewActions">
                      {review.status !== 'APPROVED' && (
                        <button
                          className="actionBtn approveBtn"
                          onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                        >
                          Approve
                        </button>
                      )}
                      {review.status !== 'DISAPPROVED' && (
                        <button
                          className="actionBtn disapproveBtn"
                          onClick={() => handleUpdateStatus(review.id, 'DISAPPROVED')}
                        >
                          Disapprove
                        </button>
                      )}
                      <button
                        className="actionBtn deleteBtn"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
