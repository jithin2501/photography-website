'use client';

import React, { useEffect, useState } from 'react';
import '../css/PaymentsSection.css';

interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  photoshootType: string;
  packageName: string;
  preferredDate: string;
  preferredTime: string;
  details?: string;
  paymentStatus?: string;
  paymentId?: string;
  paymentMethod?: string;
  clientId?: string;
  createdAt?: number;
}

export default function PaymentsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isShowingReceipt, setIsShowingReceipt] = useState(false);

  useEffect(() => {
    fetchBookingsAndPrices();
  }, []);

  const fetchBookingsAndPrices = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Fetch prices first
      const priceRes = await fetch('http://localhost:5000/api/service-package-prices');
      let pricesList = [];
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        pricesList = priceData.data || [];
        setPrices(pricesList);
      }

      // Fetch bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data for payments section:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoshootTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      maternity: 'Maternity Shoot',
      newborn: 'Newborn Shoot',
      milestone: 'Milestone Shoot',
      classes: 'Photography Classes',
    };
    return labels[type.toLowerCase()] || type;
  };

  const getPackagePriceVal = (type: string, packageName: string) => {
    const service = prices.find((p) => p.id === type.toLowerCase());
    if (!service) return 15000;
    const tier = packageName.toLowerCase();
    if (tier === 'standard') {
      return parseInt(service.standardPrice.replace(/[^0-9]/g, '')) || 15000;
    }
    if (tier === 'premium') {
      return parseInt(service.premiumPrice.replace(/[^0-9]/g, '')) || 15000;
    }
    return parseInt(service.basicPrice.replace(/[^0-9]/g, '')) || 15000;
  };

  const formatReceiptDate = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatReceiptTime = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleViewReceipt = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsShowingReceipt(true);
  };

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      (b.clientId && b.clientId.toLowerCase().includes(term)) ||
      (b.fullName && b.fullName.toLowerCase().includes(term)) ||
      (b.paymentId && b.paymentId.toLowerCase().includes(term)) ||
      (b.paymentMethod && b.paymentMethod.toLowerCase().includes(term)) ||
      (b.paymentStatus && b.paymentStatus.toLowerCase().includes(term))
    );
  });

  return (
    <div className="paymentsSectionContainer">
      <div className="controlsRow">
        <h1 className="sectionTitle">Payments Management</h1>
        <input
          type="text"
          placeholder="Search by client ID, name, transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBar"
        />
      </div>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading payments records...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="emptyStateCard">
          {searchTerm ? 'No matching transactions found.' : 'No transactions recorded yet.'}
        </div>
      ) : (
        <div className="tableCard">
          <div className="paymentsTableWrapper">
            <table className="paymentsTable">
              <thead>
                <tr>
                  <th>CLIENT ID</th>
                  <th>CLIENT NAME</th>
                  <th>TRANSACTION ID</th>
                  <th>AMOUNT</th>
                  <th>METHOD</th>
                  <th>STATUS</th>
                  <th>RECEIPT</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const amount = getPackagePriceVal(b.photoshootType, b.packageName);
                  const status = (b.paymentStatus || 'pending').toLowerCase();
                  return (
                    <tr key={b.id}>
                      <td>
                        <span className="clientIdText">{b.clientId || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="clientNameCell">
                          <span className="clientNameText">{b.fullName}</span>
                          <span className="clientPhoneText">{b.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="transactionIdText">{b.paymentId || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="amountText">₹{amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className="methodText">{b.paymentMethod || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={`statusBadge ${status}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewReceipt(b)}
                          className="viewReceiptBtn"
                          disabled={status !== 'paid'}
                          title={status !== 'paid' ? 'Receipt only available for paid bookings' : 'View Tax Invoice'}
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Modal Overlay */}
      {isShowingReceipt && selectedBooking && (
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
                <div><span className="receiptMetaLabel">Bill No:</span> <span className="receiptMetaVal">{selectedBooking.clientId || 'N/A'}</span></div>
                <div><span className="receiptMetaLabel">Customer:</span> <span className="receiptMetaVal">{selectedBooking.fullName}</span></div>
                <div><span className="receiptMetaLabel">Phone:</span> <span className="receiptMetaVal">{selectedBooking.phone}</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><span className="receiptMetaLabel">Date:</span> <span className="receiptMetaVal">{formatReceiptDate(selectedBooking.createdAt)}</span></div>
                <div><span className="receiptMetaLabel">Time:</span> <span className="receiptMetaVal">{formatReceiptTime(selectedBooking.createdAt)}</span></div>
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
                  <td style={{ fontWeight: 'bold' }}>
                    {getPhotoshootTypeLabel(selectedBooking.photoshootType).toUpperCase()} ({selectedBooking.packageName.toUpperCase()} PACKAGE)
                  </td>
                  <td>1.00</td>
                  <td>₹{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName).toFixed(2)}</td>
                  <td>₹{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName).toFixed(2)}</td>
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
                <span>₹0.00</span>
              </div>
              <div className="receiptSummaryRow netAmount">
                <span>Net Bill Amount:</span>
                <span>₹{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName).toFixed(2)}</span>
              </div>
            </div>

            <div className="receiptSeparatorDotted"></div>

            <div className="receiptPaymentInfo">
              <div style={{ fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#000' }}>Payment Details</div>
              <div className="receiptPaymentRow">
                <span>Payment ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{selectedBooking.paymentId}</span>
              </div>
              <div className="receiptPaymentRow">
                <span>Payment Method:</span>
                <span>{selectedBooking.paymentMethod}</span>
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
                  <td>₹{(getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.05).toFixed(2)}</td>
                </tr>
                <tr className="totalRow">
                  <td>₹{(getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05).toFixed(2)}</td>
                  <td></td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.025).toFixed(2)}</td>
                  <td></td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>₹{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName) / 1.05) * 0.05).toFixed(2)}</td>
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
