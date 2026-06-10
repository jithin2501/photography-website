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
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    // Generate QR code link dynamically
    if (typeof window !== 'undefined') {
      const publicReviewUrl = `${window.location.origin}/reviews/new`;
      // Use qrserver api for clean zero-dependency QR code generation
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicReviewUrl)}`);
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalReviews = reviews.length;
  const pendingCount = reviews.filter(r => r.status === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'PENDING') return r.status === 'PENDING';
    if (filter === 'APPROVED') return r.status === 'APPROVED';
    return true;
  });

  return (
    <div className="reviewSectionContainer">
      {/* Top Banner / Header Area */}
      <div className="controlsRow">
        <h1 className="sectionTitle">Reviews Management</h1>
      </div>

      {error && <div className="errorBanner">{error}</div>}

      {/* Top Stat Summary Row */}
      <div className="statsSummaryRow">
        <div className="statSummaryCard">
          <div className="statSummaryNumber">{totalReviews}</div>
          <div className="statSummaryLabel">Total Reviews</div>
        </div>
        <div className="statSummaryCard">
          <div className="statSummaryNumber warningColor">{pendingCount}</div>
          <div className="statSummaryLabel">Pending</div>
        </div>
        <div className="statSummaryCard">
          <div className="statSummaryNumber successColor">{approvedCount}</div>
          <div className="statSummaryLabel">Approved</div>
        </div>
        <div className="statSummaryCard qrActionCard">
          <button className="viewQrButton" onClick={() => setShowQrModal(true)}>
            View QR
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="filterButtonGroup">
        <button
          className={`filterTabBtn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All ({totalReviews})
        </button>
        <button
          className={`filterTabBtn ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`filterTabBtn ${filter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {/* Table Data Board */}
      <div className="tableCard">
        {loading ? (
          <div className="loadingContainer">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="reviewsTable">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>RATING</th>
                  <th>REVIEW</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="noReviewsRow">
                      No reviews found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="dateCell">{formatDate(review.createdAt)}</td>
                      <td className="nameCell">{review.name}</td>
                      <td className="ratingCell">
                        <div className="tableStars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`tableStar ${i < review.rating ? 'active' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="messageCell">{review.message}</td>
                      <td className="statusCell">
                        <span className={`statusLabelBadge ${review.status.toLowerCase()}`}>
                          {review.status === 'APPROVED' ? 'Approved' : review.status === 'PENDING' ? 'Pending' : 'Disapproved'}
                        </span>
                      </td>
                      <td className="actionCell">
                        <div className="tableActionButtons">
                          {review.status === 'APPROVED' ? (
                            <button
                              className="iconActionBtn disapproveCircleBtn"
                              title="Disapprove / Make Pending"
                              onClick={() => handleUpdateStatus(review.id, 'PENDING')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="iconActionBtn approveCircleBtn"
                              title="Approve Review"
                              onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>
                          )}
                          <button
                            className="iconActionBtn deleteTrashBtn"
                            title="Delete Review"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating QR Modal */}
      {showQrModal && (
        <div className="qrModalOverlay" onClick={() => setShowQrModal(false)}>
          <div className="qrModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="qrModalClose" onClick={() => setShowQrModal(false)}>×</button>
            <h3 className="qrModalTitle">Client Feedback Link</h3>
            <p className="qrModalDesc">Scan this QR code with a mobile device to submit a review.</p>
            {qrCodeUrl ? (
              <div className="modalQrWrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Review QR Code" className="modalQrImg" />
              </div>
            ) : (
              <div className="modalQrPlaceholder">Generating QR Code...</div>
            )}
            <a
              href={typeof window !== 'undefined' ? `${window.location.origin}/reviews/new` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="modalFormLink"
            >
              Open Form in New Tab
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
