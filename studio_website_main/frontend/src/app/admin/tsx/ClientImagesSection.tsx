'use client';

import React, { useEffect, useState, useRef } from 'react';
import '../css/ClientImagesSection.css';

interface ClientImage {
  name: string;
  url: string;
}

interface Booking {
  id: string;
  fullName: string;
  phone: string;
  photoshootType: string;
  date: string;
  packageName: string;
  clientId?: string;
  clientImages?: ClientImage[];
}

export default function ClientImagesSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [clientImages, setClientImages] = useState<ClientImage[]>([]);
  
  // Uploading status
  const [uploadingQueue, setUploadingQueue] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setBookings(data.data || []);
      } else {
        console.error('Failed to fetch bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBooking = (id: string) => {
    setSelectedBookingId(id);
    const booking = bookings.find((b) => b.id === id) || null;
    setSelectedBooking(booking);
    setClientImages(booking ? booking.clientImages || [] : []);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = async (files: FileList) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to upload images.');
      return;
    }

    // Process files one by one or in parallel
    const filesArray = Array.from(files);
    
    for (const file of filesArray) {
      const tempId = Math.random().toString(36).substring(2, 9);
      
      // Add to uploading queue
      setUploadingQueue((prev) => [...prev, { id: tempId, name: file.name }]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:5000/api/wheel-images/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          // Add successfully uploaded image to list. Use original file name
          const newImg: ClientImage = {
            name: file.name,
            url: data.url,
          };
          setClientImages((prev) => [...prev, newImg]);
        } else {
          alert(`Failed to upload "${file.name}": ${data.error || 'Server error'}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert(`An error occurred while uploading "${file.name}".`);
      } finally {
        // Remove from queue
        setUploadingQueue((prev) => prev.filter((item) => item.id !== tempId));
      }
    }
  };

  const handleUpdateImageName = (index: number, newName: string) => {
    setClientImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, name: newName } : img))
    );
  };

  const handleDeleteImage = (index: number) => {
    if (!confirm('Are you sure you want to remove this image? (Changes will be permanent once you save)')) return;
    setClientImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedBookingId) return;
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/admin/${selectedBookingId}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clientImages),
      });

      const data = await response.json();
      if (response.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === selectedBookingId ? { ...b, clientImages } : b))
        );
        alert('Client images saved successfully!');
      } else {
        alert(data.error || 'Failed to save client images.');
      }
    } catch (error) {
      console.error('Error saving client images:', error);
      alert('An error occurred while saving client images.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelChanges = () => {
    if (!confirm('Discard all unsaved changes?')) return;
    setClientImages(selectedBooking ? selectedBooking.clientImages || [] : []);
  };

  return (
    <div className="clientImagesSectionContainer">
      <div className="controlsRow">
        <h1 className="sectionTitle">Client Photos & Galleries</h1>
      </div>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : (
        <>
          {/* Step 1: Select client */}
          <div className="selectClientCard">
            <h2>Step 1: Select a Client Booking</h2>
            <div className="clientSelectWrapper">
              <select
                value={selectedBookingId}
                onChange={(e) => handleSelectBooking(e.target.value)}
                className="clientDropdown"
              >
                <option value="">-- Select client session to manage images --</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.fullName} - {b.photoshootType.toUpperCase()} ({b.date}) {b.clientId ? `[${b.clientId}]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Upload workspace (Only visible when client is selected) */}
          {selectedBooking ? (
            <div className="uploadWorkspace">
              {/* Left Column: Upload Controls */}
              <div className="uploadControlPanel">
                <div className="infoCardPremium">
                  <h3>Managing Photos For:</h3>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                    {selectedBooking.fullName}
                  </p>
                  <p style={{ marginBottom: '2px' }}>
                    <strong>Session:</strong> {selectedBooking.photoshootType} ({selectedBooking.packageName} package)
                  </p>
                  <p style={{ marginBottom: '2px' }}>
                    <strong>Date:</strong> {selectedBooking.date}
                  </p>
                  {selectedBooking.clientId && (
                    <p>
                      <strong>Client ID:</strong> {selectedBooking.clientId}
                    </p>
                  )}
                </div>

                <div 
                  className={`dropzoneArea ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="dropzoneInput"
                    accept="image/*"
                    multiple
                  />
                  <div className="dropzoneIcon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                  </div>
                  <div className="dropzoneText">
                    <h4>Upload client photos</h4>
                    <p>Drag and drop image files or click to browse</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Uploaded Images Grid */}
              <div className="imagesGridPanel">
                <div className="panelHeaderRow">
                  <h2>Uploaded Images</h2>
                  <span className="imageCounter">
                    {clientImages.length} Image{clientImages.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="imagesGrid">
                  {clientImages.map((img, index) => (
                    <div key={index} className="imageCardPremium">
                      <div 
                        className="thumbnailWrapper" 
                        style={{ backgroundImage: `url('${img.url}')` }}
                      >
                        <button 
                          type="button" 
                          className="deleteCardBtn"
                          onClick={() => handleDeleteImage(index)}
                          title="Remove Image"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                      <div className="cardDetails">
                        <label htmlFor={`imgName-${index}`}>Display Name</label>
                        <input
                          id={`imgName-${index}`}
                          type="text"
                          className="cardImageNameInput"
                          value={img.name}
                          onChange={(e) => handleUpdateImageName(index, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Uploading Queue Skeletons */}
                  {uploadingQueue.map((item) => (
                    <div key={item.id} className="imageCardPremium queueCard">
                      <div className="thumbnailWrapper" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div className="uploadProgressOverlay">
                          <div className="progressSpinner"></div>
                          <span className="progressText">Uploading...</span>
                        </div>
                      </div>
                      <div className="cardDetails">
                        <label>Display Name</label>
                        <input
                          type="text"
                          className="cardImageNameInput"
                          value={item.name}
                          disabled
                        />
                      </div>
                    </div>
                  ))}

                  {clientImages.length === 0 && uploadingQueue.length === 0 && (
                    <div className="emptyGridPlaceholder">
                      <div className="placeholderGridIcon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <h3>No Photos Added Yet</h3>
                      <p>Drag images into the dropzone on the left to start uploading photos for this client session.</p>
                    </div>
                  )}
                </div>

                <div className="saveChangesBar">
                  <button
                    type="button"
                    className="cancelBtnPremium"
                    onClick={handleCancelChanges}
                    disabled={saving || uploadingQueue.length > 0}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    className="saveBtnPremium"
                    onClick={handleSave}
                    disabled={saving || uploadingQueue.length > 0}
                  >
                    {saving ? (
                      <>
                        <div className="progressSpinner" style={{ width: '14px', height: '14px', borderTopColor: '#fff' }}></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Save Images</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="emptyStateCard" style={{ padding: '60px 40px' }}>
              Please select a client booking above to start uploading and managing session photos.
            </div>
          )}
        </>
      )}
    </div>
  );
}
