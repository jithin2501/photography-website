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
  clientId?: string;
  clientImages?: { name: string; url: string; reeditRequested?: boolean }[];
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientName, setClientName] = useState('');
  const [isShowingReceipt, setIsShowingReceipt] = useState(false);
  const [prices, setPrices] = useState<any[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [updatingReeditIndex, setUpdatingReeditIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null || !booking || !booking.clientImages) return;
      const totalImages = booking.clientImages.length;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + totalImages) % totalImages : 0
        );
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % totalImages : 0
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, booking]);

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
    fetchPrices();
  }, [router]);

  const fetchPrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/service-package-prices');
      if (response.ok) {
        const data = await response.json();
        setPrices(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
    }
  };

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

  const handleToggleReedit = async (index: number) => {
    if (!booking || !booking.clientImages) return;

    const updatedImages = booking.clientImages.map((img, idx) => 
      idx === index ? { ...img, reeditRequested: !img.reeditRequested } : img
    );

    setUpdatingReeditIndex(index);
    const token = localStorage.getItem('clientToken');

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/client/${booking.id}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedImages),
      });

      if (response.ok) {
        setBooking(prev => prev ? { ...prev, clientImages: updatedImages } : null);
      } else {
        alert('Failed to update re-edit request.');
      }
    } catch (err) {
      console.error('Error updating re-edit request:', err);
      alert('An error occurred while submitting your re-edit request.');
    } finally {
      setUpdatingReeditIndex(null);
    }
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

  const getPackagePriceVal = (photoshootType: string, packageName: string, pricesList: any[]): number => {
    const serviceId = photoshootType ? photoshootType.toLowerCase() : '';
    const packageTier = packageName ? packageName.toLowerCase() : 'basic';
    const match = pricesList.find((p: any) => p.id === serviceId);
    let priceStr = '';
    if (match) {
      if (packageTier === 'standard') {
        priceStr = match.standardPrice;
      } else if (packageTier === 'premium') {
        priceStr = match.premiumPrice;
      } else {
        priceStr = match.basicPrice;
      }
    }
    if (!priceStr) {
      if (packageTier === 'standard') return 25000;
      if (packageTier === 'premium') return 35000;
      return 15000;
    }
    const cleanStr = priceStr.replace(/[^0-9]/g, '');
    return parseInt(cleanStr) || 15000;
  };

  const formatReceiptDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatReceiptTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
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
          <>
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
                  <span className="rowValue uppercaseValue">{booking.packageName} Package ({getPackagePriceVal(booking.photoshootType, booking.packageName, prices)})</span>
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
                {booking.paymentStatus === 'paid' && (
                  <div className="detailRow fullWidthRow" style={{ marginTop: '15px', borderBottom: 'none', paddingBottom: 0 }}>
                    <button className="receiptBtn" onClick={() => {
                      setIsShowingReceipt(true);
                      setTimeout(() => {
                        window.print();
                        setIsShowingReceipt(false);
                      }, 150);
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      View Receipt
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Separate Space for client section below the boxes */}
          <section className="clientPhotosSection">
            <div className="clientCardHeader">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <h2>Your Photos & Gallery</h2>
            </div>
            
            <p className="photosDescription">
              View and download the high-resolution images from your session below.
            </p>

            {booking.clientImages && booking.clientImages.length > 0 ? (
              <div className="clientPhotosGrid">
                {booking.clientImages.map((img, idx) => (
                  <div key={idx} className="clientPhotoCard">
                    <div 
                      className="clientPhotoFrame" 
                      style={{ backgroundImage: `url('${img.url}')` }}
                    >
                      {img.reeditRequested && (
                        <div className="reeditBadge">Re-edit Requested</div>
                      )}
                      <div className="clientPhotoHoverOverlay">
                        <button 
                          type="button"
                          className="overlayActionBtn"
                          title="View Fullsize"
                          onClick={() => setActivePhotoIndex(idx)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <a 
                          href={img.url} 
                          download={img.name}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="overlayActionBtn secondaryBtn"
                          title="Download Image"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                        <button 
                          type="button" 
                          className={`overlayActionBtn reeditBtn ${img.reeditRequested ? 'active' : ''}`}
                          onClick={() => handleToggleReedit(idx)}
                          disabled={updatingReeditIndex === idx}
                          title={img.reeditRequested ? "Cancel Re-edit Request" : "Request Re-edit"}
                        >
                          {updatingReeditIndex === idx ? (
                            <div className="btnSpinner"></div>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="photoCardMeta">
                      <span className="photoCardTitle" title={img.name}>{img.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noPhotosBox">
                <div className="noPhotosIcon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h3>Photos Processing</h3>
                <p>Your beautiful photos are currently being edited and processed. Once complete, your personalized gallery will show up here.</p>
              </div>
            )}
          </section>
        </>
      ) : (
          <div className="clientDashboardErrorCard">
            <p>No booking is currently linked to your portal account.</p>
          </div>
        )}
      </main>

      {/* Lightbox Modal Overlay */}
      {activePhotoIndex !== null && booking && booking.clientImages && (
        <div className="lightboxOverlay" onClick={() => setActivePhotoIndex(null)}>
          <button 
            className="lightboxCloseBtn" 
            onClick={() => setActivePhotoIndex(null)}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            className="lightboxNavBtn left"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev - 1 + booking.clientImages!.length) % booking.clientImages!.length : 0
              );
            }}
            aria-label="Previous photo"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="lightboxContentContainer" onClick={(e) => e.stopPropagation()}>
            <img 
              src={booking.clientImages[activePhotoIndex].url} 
              alt={booking.clientImages[activePhotoIndex].name} 
              className="lightboxImage" 
            />
            <div className="lightboxCaption">
              <span className="lightboxPhotoTitle">{booking.clientImages[activePhotoIndex].name}</span>
              <span className="lightboxPhotoIndex">
                {activePhotoIndex + 1} / {booking.clientImages.length}
              </span>
            </div>
          </div>

          <button
            className="lightboxNavBtn right"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev + 1) % booking.clientImages!.length : 0
              );
            }}
            aria-label="Next photo"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Receipt Modal Overlay */}
      {isShowingReceipt && booking && (
        <div className="receiptModalOverlay">
          <div className="receiptModalContainer">
            <h1 className="receiptLogo">AURA LENS STUDIO</h1>
            <p className="receiptSubHeader">
              No.52, Saxena complex, Kodigehalli Main Rd,<br />
              Defence Layout, Sahakar Nagar, Bengaluru, Karnataka 560092<br />
              Phone: 87928 88508<br />
              GSTIN: APPLIED
            </p>

            <div className="receiptTitleBox">
              <span className="receiptTitle">TAX INVOICE</span>
            </div>

            <div className="receiptMetaSection">
              <div>
                <div><span className="receiptMetaLabel">Bill No:</span> <span className="receiptMetaVal">{booking.clientId || 'N/A'}</span></div>
                <div><span className="receiptMetaLabel">Customer:</span> <span className="receiptMetaVal">{booking.fullName}</span></div>
                <div><span className="receiptMetaLabel">Phone:</span> <span className="receiptMetaVal">{booking.phone}</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><span className="receiptMetaLabel">Date:</span> <span className="receiptMetaVal">{formatReceiptDate(booking.createdAt)}</span></div>
                <div><span className="receiptMetaLabel">Time:</span> <span className="receiptMetaVal">{formatReceiptTime(booking.createdAt)}</span></div>
              </div>
            </div>

            <div className="receiptSeparator"></div>

            <table className="receiptItemTable">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>ITEM NAME</th>
                  <th>QTY</th>
                  <th>ORDER VALUE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{getPhotoshootTypeLabel(booking.photoshootType).toUpperCase()} ({booking.packageName.toUpperCase()} PACKAGE)</td>
                  <td>1.00</td>
                  <td>{getPackagePriceVal(booking.photoshootType, booking.packageName, prices).toFixed(2)}</td>
                  <td>{getPackagePriceVal(booking.photoshootType, booking.packageName, prices).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="receiptSeparatorDotted"></div>

            <div className="receiptSummaryBox">
              <div className="receiptSummaryRow">
                <span>Total Qty:</span>
                <span>1.00</span>
              </div>
              <div className="receiptSummaryRow">
                <span>Discount:</span>
                <span>0.00</span>
              </div>
              <div className="receiptSummaryRow netAmount">
                <span>Net Bill Amount:</span>
                <span>₹{getPackagePriceVal(booking.photoshootType, booking.packageName, prices).toFixed(2)}</span>
              </div>
            </div>

            <div className="receiptSeparatorDotted"></div>

            <div className="receiptPaymentInfo">
              <div style={{ fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#000' }}>Payment Details</div>
              <div className="receiptPaymentRow">
                <span>Payment ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{booking.paymentId}</span>
              </div>
              <div className="receiptPaymentRow">
                <span>Payment Method:</span>
                <span>{booking.paymentMethod}</span>
              </div>
            </div>

            {/* GST breakdown table */}
            <table className="receiptGstTable">
              <thead>
                <tr>
                  <th rowSpan={2}>Taxable Value</th>
                  <th colSpan={2}>CGST</th>
                  <th colSpan={2}>SGST</th>
                  <th rowSpan={2}>Total GST</th>
                </tr>
                <tr>
                  <th>%</th>
                  <th>Amt</th>
                  <th>%</th>
                  <th>Amt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{(getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.05).toFixed(2)}</td>
                </tr>
                <tr className="totalRow">
                  <td>{(getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05).toFixed(2)}</td>
                  <td></td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td></td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>{((getPackagePriceVal(booking.photoshootType, booking.packageName, prices) / 1.05) * 0.05).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <p className="receiptFooterGreeting">
              Thank you for choosing AuraLens Studio!<br />
              This is a computer generated invoice.
            </p>

            <div className="receiptActionsRow">
              <button className="receiptActionBtn printBtn" onClick={() => window.print()}>Print</button>
              <button className="receiptActionBtn closeBtn" onClick={() => setIsShowingReceipt(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
