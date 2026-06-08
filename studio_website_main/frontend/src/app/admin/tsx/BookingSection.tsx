'use client';

import React, { useEffect, useState } from 'react';
import '../css/BookingSection.css';

interface Booking {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  photoshootType: string;
  date: string;
  time?: string;
  locationPreference: string;
  packageName: string;
  details?: string;
  createdAt: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentId?: string;
  razorpayOrderId?: string;
}

export default function BookingSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/bookings/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const list = data.data || [];
        setBookings(list);
        if (list.length > 0) {
          setSelectedBooking(list[0]);
        } else {
          setSelectedBooking(null);
        }
      } else {
        console.error('Failed to fetch bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings((prev) => {
          const updated = prev.filter((b) => b.id !== id);
          if (selectedBooking?.id === id) {
            setSelectedBooking(updated.length > 0 ? updated[0] : null);
          }
          return updated;
        });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred while deleting the booking');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimestamp = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPhotoshootTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'maternity': return 'Maternity';
      case 'newborn': return 'Newborn';
      case 'milestone': return 'Milestone';
      case 'classes': return 'Classes';
      default: return type;
    }
  };

  const getPackageBadgeClass = (pack: string) => {
    switch (pack.toLowerCase()) {
      case 'basic': return 'packageBadge basic';
      case 'standard': return 'packageBadge standard';
      case 'premium': return 'packageBadge premium';
      default: return 'packageBadge';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.phone.includes(searchTerm);
    const matchesFilter = typeFilter === 'all' || b.photoshootType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bookingSectionContainer">
      <div className="controlsRow">
        <div>
          <h1 className="sectionTitle">Booking Requests</h1>

        </div>
      </div>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="emptyStateCard">
          No bookings submitted yet.
        </div>
      ) : (
        <div className="bookingDashboardGrid">
          {/* Left Panel: Bookings List */}
          <div className="bookingsListPanel">
            <div className="filterControls">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchBar"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filterSelect"
              >
                <option value="all">All Service Types</option>
                <option value="maternity">Maternity</option>
                <option value="newborn">Newborn</option>
                <option value="milestone">Milestone</option>
                <option value="classes">Classes</option>
              </select>
            </div>

            <div className="bookingsScrollList">
              {filteredBookings.length === 0 ? (
                <div className="noResults">No matches found.</div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className={`bookingListItem ${selectedBooking?.id === b.id ? 'active' : ''}`}
                    onClick={() => setSelectedBooking(b)}
                  >
                    <div className="listHeader">
                      <h4>{b.fullName}</h4>
                      <span className={getPackageBadgeClass(b.packageName)}>
                        {b.packageName}
                      </span>
                    </div>
                    <div className="listDetails">
                      <span>{getPhotoshootTypeLabel(b.photoshootType)}</span>
                      <span>{b.date}</span>
                    </div>
                    <div className="listPaymentDetails">
                      <span className={`paymentStatusBadge ${b.paymentStatus || 'pending'}`}>
                        {b.paymentStatus === 'paid' ? '● Paid' : b.paymentStatus === 'failed' ? '● Failed' : '○ Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Detailed View */}
          <div className="bookingDetailPanel">
            {selectedBooking ? (
              <div className="bookingDetailCard">
                <div className="detailCardHeader">
                  <div>
                    <h2>{selectedBooking.fullName}</h2>
                    <span className="submittedAt">Submitted on {formatTimestamp(selectedBooking.createdAt)}</span>
                  </div>
                  <button
                    className="deleteBookingBtn"
                    onClick={() => handleDelete(selectedBooking.id)}
                  >
                    Delete Booking
                  </button>
                </div>

                <div className="detailGrid">
                  <div className="detailField">
                    <span className="fieldLabel">Photoshoot Type</span>
                    <span className="fieldValue highlightedVal">
                      {getPhotoshootTypeLabel(selectedBooking.photoshootType)}
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Selected Package</span>
                    <span className="fieldValue">
                      <span className={getPackageBadgeClass(selectedBooking.packageName)}>
                        {selectedBooking.packageName.toUpperCase()}
                      </span>
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Photoshoot Date</span>
                    <span className="fieldValue">{selectedBooking.date}</span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Preferred Time</span>
                    <span className="fieldValue">
                      {selectedBooking.time || 'Not specified'}
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Location Preference</span>
                    <span className="fieldValue capitalized">
                      {selectedBooking.locationPreference}
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Phone Number</span>
                    <span className="fieldValue">
                      <a href={`tel:${selectedBooking.phone}`} className="link">{selectedBooking.phone}</a>
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Payment Status</span>
                    <span className="fieldValue">
                      <span className={`paymentStatusBadge large ${selectedBooking.paymentStatus || 'pending'}`}>
                        {(selectedBooking.paymentStatus || 'pending').toUpperCase()}
                      </span>
                    </span>
                  </div>

                  <div className="detailField">
                    <span className="fieldLabel">Payment Method</span>
                    <span className="fieldValue">
                      {selectedBooking.paymentMethod || 'N/A'}
                    </span>
                  </div>

                  {selectedBooking.paymentId && (
                    <div className="detailField fullWidth">
                      <span className="fieldLabel">Razorpay Payment ID</span>
                      <span className="fieldValue textCode">{selectedBooking.paymentId}</span>
                    </div>
                  )}

                  <div className="detailField fullWidth">
                    <span className="fieldLabel">Email Address</span>
                    <span className="fieldValue">
                      {selectedBooking.email ? (
                        <a href={`mailto:${selectedBooking.email}`} className="link">{selectedBooking.email}</a>
                      ) : (
                        <em className="textMuted">Not specified</em>
                      )}
                    </span>
                  </div>

                  <div className="detailField fullWidth">
                    <span className="fieldLabel">Session Details & Requests</span>
                    <div className="detailsBox">
                      {selectedBooking.details ? (
                        <p>{selectedBooking.details}</p>
                      ) : (
                        <p className="noDetailsText">No special custom requests specified.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="noSelectionState">
                <p>Select a booking request from the list to view full details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
