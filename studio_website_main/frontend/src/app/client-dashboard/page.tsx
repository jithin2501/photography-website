'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './ClientDashboard.css';

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
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const bookingId = localStorage.getItem('clientBookingId');
    const name = localStorage.getItem('clientFullName');

    if (!token || !bookingId) {
      router.push('/login');
      return;
    }

    setClientName(name || 'Client');
    fetchBookingDetails(bookingId, token);
  }, [router]);

  const fetchBookingDetails = async (id: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/client/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setBooking(data.data);
      } else {
        setError(data.error || 'Failed to retrieve booking details.');
      }
    } catch (err) {
      console.error('Error fetching client booking:', err);
      setError('A connection error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientUsername');
    localStorage.removeItem('clientFullName');
    localStorage.removeItem('clientBookingId');
    router.push('/login');
  };

  const getPhotoshootTypeLabel = (type: string) => {
    if (!type) return '';
    switch (type.toLowerCase()) {
      case 'maternity': return 'Maternity Session';
      case 'newborn': return 'Newborn Session';
      case 'milestone': return 'Milestone Session';
      case 'classes': return 'Photography Class';
      default: return type.charAt(0).toUpperCase() + type.slice(1) + ' Session';
    }
  };

  if (loading) {
    return (
      <div className="clientDashboardLoading">
        <div className="clientSpinner"></div>
        <p>Retrieving your portal details...</p>
      </div>
    );
  }

  return (
    <div className="clientDashboardPage">
      <header className="clientDashboardHeader">
        <div className="headerContainer">
          <div className="brandLogo">AuraLens Studio</div>
          <button className="clientSignOutBtn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="clientDashboardContent">
        <div className="welcomeBanner">
          <h1>Hello, {clientName}!</h1>
          <p>Welcome to your personal client portal. Track your session status, check package details, and view payment history below.</p>
        </div>

        {error ? (
          <div className="clientDashboardErrorCard">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        ) : booking ? (
          <div className="clientDashboardGrid">
            {/* Session Details Card */}
            <section className="clientCard sessionDetailsCard">
              <div className="clientCardHeader">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h2>Session Schedule</h2>
              </div>

              <div className="detailsList">
                <div className="detailRow">
                  <span className="rowLabel">Session Type</span>
                  <span className="rowValue highlightedValue">{getPhotoshootTypeLabel(booking.photoshootType)}</span>
                </div>
                <div className="detailRow">
                  <span className="rowLabel">Package Tier</span>
                  <span className="rowValue uppercaseValue">{booking.packageName} Package</span>
                </div>
                <div className="detailRow">
                  <span className="rowLabel">Scheduled Date</span>
                  <span className="rowValue">{booking.date}</span>
                </div>
                <div className="detailRow">
                  <span className="rowLabel">Preferred Time</span>
                  <span className="rowValue">{booking.time || 'To be coordinated'}</span>
                </div>
                <div className="detailRow">
                  <span className="rowLabel">Location Preference</span>
                  <span className="rowValue capitalizedValue">{booking.locationPreference}</span>
                </div>
              </div>
            </section>

            {/* Payment Details Card */}
            <section className="clientCard paymentDetailsCard">
              <div className="clientCardHeader">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <h2>Payment & Order Status</h2>
              </div>

              <div className="detailsList">
                <div className="detailRow">
                  <span className="rowLabel">Transaction Status</span>
                  <span className={`paymentBadge ${booking.paymentStatus || 'pending'}`}>
                    {(booking.paymentStatus || 'pending').toUpperCase()}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="rowLabel">Payment Mode</span>
                  <span className="rowValue">{booking.paymentMethod || 'N/A'}</span>
                </div>
                {booking.paymentId && (
                  <div className="detailRow fullWidthRow">
                    <span className="rowLabel">Payment Reference ID</span>
                    <span className="rowValue codeValue">{booking.paymentId}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="clientDashboardErrorCard">
            <p>No booking is currently linked to your portal account.</p>
          </div>
        )}
      </main>
    </div>
  );
}
