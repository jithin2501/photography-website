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
  clientId?: string;
}

export default function BookingSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Client Portal Credentials States
  const [isViewingCredentials, setIsViewingCredentials] = useState(false);
  const [clientUsername, setClientUsername] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [credentialsExist, setCredentialsExist] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [isShowingReceipt, setIsShowingReceipt] = useState(false);
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchPrices();
  }, []);

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

  useEffect(() => {
    setIsViewingCredentials(false);
  }, [selectedBooking]);

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

  const fetchExistingUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/client/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setExistingUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching client users:', error);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/client/admin/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchExistingUsers();
        if (selectedBooking && user.bookingId === selectedBooking.id) {
          handleViewCredentials(selectedBooking);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDeleteUser = async (id: string, userBookingId: string) => {
    if (!confirm('Are you sure you want to delete this client user?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/client/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchExistingUsers();
        if (selectedBooking && userBookingId === selectedBooking.id) {
          setCredentialsExist(false);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete client user');
      }
    } catch (error) {
      console.error('Error deleting client user:', error);
    }
  };

  const handleViewCredentials = async (booking: Booking) => {
    setIsViewingCredentials(true);
    setSavingCredentials(false);
    fetchExistingUsers();
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/auth/client/booking/${booking.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClientUsername(data.username);
        setClientPassword(data.password);
        setCredentialsExist(true);
      } else {
        const cleanName = booking.fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client';
        const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
        const namePart = cleanName.charAt(0).toUpperCase() + cleanName.slice(1, 4);
        const phonePart = cleanPhone.slice(-4) || '1234';
        const uniqueIdPart = booking.clientId ? booking.clientId.replace('AL-', '') : Math.floor(100 + Math.random() * 900).toString();
        const generatedPassword = `${namePart}@${phonePart}#${uniqueIdPart}`;

        setClientUsername(cleanName);
        setClientPassword(generatedPassword);
        setCredentialsExist(false);
      }
    } catch (error) {
      console.error('Error fetching client credentials:', error);
      const cleanName = booking.fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client';
      const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
      const namePart = cleanName.charAt(0).toUpperCase() + cleanName.slice(1, 4);
      const phonePart = cleanPhone.slice(-4) || '1234';
      const uniqueIdPart = booking.clientId ? booking.clientId.replace('AL-', '') : Math.floor(100 + Math.random() * 900).toString();
      const generatedPassword = `${namePart}@${phonePart}#${uniqueIdPart}`;

      setClientUsername(cleanName);
      setClientPassword(generatedPassword);
      setCredentialsExist(false);
    }
  };

  const handleSaveCredentials = async () => {
    if (!selectedBooking) return;
    if (!clientUsername.trim() || !clientPassword.trim()) {
      alert('Username and Password cannot be empty.');
      return;
    }

    setSavingCredentials(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/auth/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          fullName: selectedBooking.fullName,
          phone: selectedBooking.phone,
          username: clientUsername.trim(),
          password: clientPassword.trim(),
        }),
      });

      if (response.ok) {
        setCredentialsExist(true);
        alert('Client credentials saved successfully!');
        fetchExistingUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save credentials.');
      }
    } catch (error) {
      console.error('Error saving client credentials:', error);
      alert('An error occurred while saving credentials.');
    } finally {
      setSavingCredentials(false);
    }
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
      b.phone.includes(searchTerm) ||
      (b.clientId && b.clientId.toLowerCase().includes(searchTerm.toLowerCase()));
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
                {isViewingCredentials ? (
                  <>
                    <div className="detailCardHeader">
                      <div>
                        <h2>Client Login Details</h2>
                        <span className="submittedAt">Manage credentials for {selectedBooking.fullName}</span>
                      </div>
                      <button
                        className="backDetailsBtn"
                        onClick={() => setIsViewingCredentials(false)}
                      >
                        Back
                      </button>
                    </div>

                    <div className="credentialsForm">
                      <div className="credentialFieldGroup">
                        <label className="credLabel">Generated Username</label>
                        <input
                          type="text"
                          value={clientUsername}
                          onChange={(e) => setClientUsername(e.target.value)}
                          className="credInput"
                          placeholder="Username"
                        />
                        <small className="fieldHint">Automatically created from client's name</small>
                      </div>

                      <div className="credentialFieldGroup">
                        <label className="credLabel">Generated Password</label>
                        <input
                          type="text"
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          className="credInput"
                          placeholder="Password"
                        />
                        <small className="fieldHint">Automatically created from client's phone number</small>
                      </div>

                      <button
                        className="saveCredentialsBtn"
                        onClick={handleSaveCredentials}
                        disabled={savingCredentials}
                      >
                        {savingCredentials ? 'Saving...' : credentialsExist ? 'Update Login' : 'Create Login'}
                      </button>

                    </div>

                    <div className="existingUsersSection">
                      <h3>Existing Client Users</h3>
                      <div className="existingUsersTableWrapper">
                        <table className="existingUsersTable">
                          <thead>
                            <tr>
                              <th>USERNAME</th>
                              <th>STATUS</th>
                              <th>LAST LOGIN</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {existingUsers.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="noUsersText">No client users registered yet.</td>
                              </tr>
                            ) : (
                              existingUsers.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.username}</td>
                                  <td>
                                    <span className={`statusBadge ${user.status === 'ACTIVE' ? 'active' : 'deactivated'}`}>
                                      {user.status || 'ACTIVE'}
                                    </span>
                                  </td>
                                  <td>
                                    {user.lastLogin
                                      ? formatTimestamp(new Date(user.lastLogin).toISOString())
                                      : 'Never'}
                                  </td>
                                  <td>
                                    <div className="actionButtons">
                                      <button
                                        onClick={() => handleToggleStatus(user)}
                                        className={`statusBtn ${user.status === 'ACTIVE' ? 'deactivateBtn' : 'activateBtn'}`}
                                      >
                                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(user.id, user.bookingId)}
                                        className="deleteUserBtn"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detailCardHeader">
                      <div>
                        <h2>{selectedBooking.fullName}</h2>
                        <span className="submittedAt">Submitted on {formatTimestamp(selectedBooking.createdAt)}</span>
                      </div>
                      <div className="headerActions">
                        {selectedBooking.paymentStatus === 'paid' && (
                          <button
                            className="loginBtn"
                            onClick={() => {
                              setIsShowingReceipt(true);
                              setTimeout(() => {
                                window.print();
                                setIsShowingReceipt(false);
                              }, 150);
                            }}
                            style={{ background: 'rgba(255, 77, 0, 0.1)', color: '#FF4D00', borderColor: 'rgba(255, 77, 0, 0.2)' }}
                          >
                            Receipt
                          </button>
                        )}
                        <button
                          className="loginBtn"
                          onClick={() => handleViewCredentials(selectedBooking)}
                        >
                          Login
                        </button>
                        <button
                          className="deleteBookingBtn"
                          onClick={() => handleDelete(selectedBooking.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="detailGrid">
                      <div className="detailField">
                        <span className="fieldLabel">Client ID / Unique ID</span>
                        <span className="fieldValue highlightedVal" style={{ fontWeight: 'bold' }}>
                          {selectedBooking.clientId || 'N/A'}
                        </span>
                      </div>

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
                  </>
                )}
              </div>
            ) : (
              <div className="noSelectionState">
                <p>Select a booking request from the list to view full details.</p>
              </div>
            )}
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
                  <td style={{ fontWeight: 'bold' }}>{getPhotoshootTypeLabel(selectedBooking.photoshootType).toUpperCase()} ({selectedBooking.packageName.toUpperCase()} PACKAGE)</td>
                  <td>1.00</td>
                  <td>{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices).toFixed(2)}</td>
                  <td>{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices).toFixed(2)}</td>
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
                <span>₹{getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices).toFixed(2)}</span>
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
                  <td>{(getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>2.5</td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.05).toFixed(2)}</td>
                </tr>
                <tr className="totalRow">
                  <td>{(getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05).toFixed(2)}</td>
                  <td></td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td></td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.025).toFixed(2)}</td>
                  <td>{((getPackagePriceVal(selectedBooking.photoshootType, selectedBooking.packageName, prices) / 1.05) * 0.05).toFixed(2)}</td>
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
