'use client';

import React, { useEffect, useState } from 'react';
import '../css/WheelSection.css';

interface WheelImage {
  _id?: string;
  slot: number;
  imageUrl: string;
  title: string;
  description: string;
}

export default function WheelSection() {
  const [items, setItems] = useState<WheelImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingSlot, setSavingSlot] = useState<number | null>(null);

  useEffect(() => {
    fetchWheelImages();
  }, []);

  const fetchWheelImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wheel-images');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.data || [])
          .filter((item: WheelImage) => item.slot >= 1 && item.slot <= 9)
          .sort((a: WheelImage, b: WheelImage) => a.slot - b.slot);
        setItems(sorted);
      } else {
        console.error('Failed to load wheel images:', data.error);
      }
    } catch (err) {
      console.error('Error fetching wheel images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: WheelImage) => {
    setEditingSlot(item.slot);
    setEditTitle(item.title);
    setEditImageUrl(item.imageUrl);
    setEditDescription(item.description);
  };

  const handleCancel = () => {
    setEditingSlot(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to upload images.');
      return;
    }

    const file = files[0];
    setUploading(true);

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
        setEditImageUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload image. Please verify your backend Cloudinary configurations.');
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('An error occurred during file upload. Check your connection or backend configuration.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (slot: number) => {
    if (!editTitle.trim() || !editImageUrl.trim() || !editDescription.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to perform this action.');
      return;
    }

    setSavingSlot(slot);

    try {
      const response = await fetch('http://localhost:5000/api/wheel-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slot,
          title: editTitle,
          imageUrl: editImageUrl,
          description: editDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setItems((prev) =>
          prev.map((item) => (item.slot === slot ? data.data : item))
        );
        setEditingSlot(null);
      } else {
        alert(data.error || 'Failed to save wheel image configuration.');
      }
    } catch (err) {
      console.error('Error saving wheel image:', err);
      alert('An error occurred while saving the configuration.');
    } finally {
      setSavingSlot(null);
    }
  };

  const activeSlotItem = items.find((item) => item.slot === editingSlot);

  return (
    <div className="wheelSectionContainer">
      <section className="controlsRow">
        <div>
          <h1 className="sectionTitle">
            <span>Arc Wheel Settings</span>
          </h1>
        </div>
      </section>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading wheel configurations...</p>
        </div>
      ) : (
        <div className="wheelDashboard">
          {/* Left panel: Grid of Slots */}
          <div className="slotsContainer">
            <div className="slotsGrid">
              {items.map((item) => {
                const isSelected = editingSlot === item.slot;

                return (
                  <div
                    key={item.slot}
                    className={`slotCard ${isSelected ? 'active' : ''}`}
                    style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    onClick={() => handleEditClick(item)}
                  >
                    <div className="slotCardBadge">Slot {item.slot}</div>

                    <div className="slotCardContent">
                      <h3 className="slotCardTitle">{item.title || `Slot ${item.slot}`}</h3>
                      <p className="slotCardDesc">{item.description || 'No description provided.'}</p>
                    </div>

                    <div className="slotCardHoverOverlay">
                      <div className="editIconWrapper">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Live Editor Pane */}
          <div className="editorPanel">
            {editingSlot !== null && activeSlotItem ? (
              <div className="editorPanelContent">
                <div className="editorHeader">
                  <h2>Configure Slot {editingSlot}</h2>
                  <button className="closeEditorBtn" onClick={handleCancel} title="Close Editor">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="editorForm">
                  <div className="editorFormGroup">
                    <label>Category Title</label>
                    <input
                      type="text"
                      className="editorInput"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter category title"
                    />
                  </div>

                  <div className="editorFormGroup">
                    <label>Upload Hero Image</label>
                    <div className="uploadDropzone">
                      <input
                        type="file"
                        className="uploadDropzoneInput"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading || savingSlot !== null}
                      />

                      {editImageUrl ? (
                        <>
                          <div className="dropzonePreview" style={{ backgroundImage: `url('${editImageUrl}')` }} />
                          <div className="dropzoneHoverOverlay">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            <span>Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="dropzoneContent">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          <span>Upload Image</span>
                          <p>Click or drag image file here</p>
                        </div>
                      )}

                      {uploading && (
                        <div className="uploadOverlay">
                          <div className="uploadSpinner"></div>
                          <span>Uploading to Cloudinary...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="editorFormGroup">
                    <label>Description</label>
                    <textarea
                      className="editorTextarea"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter short description"
                      rows={4}
                    />
                  </div>

                  <div className="editorActions">
                    <button
                      className="saveBtnPremium"
                      onClick={() => handleSave(editingSlot)}
                      disabled={savingSlot !== null || uploading || !editTitle.trim() || !editImageUrl.trim() || !editDescription.trim()}
                    >
                      {savingSlot !== null ? (
                        <>
                          <div className="uploadSpinner" style={{ width: '12px', height: '12px', borderTopColor: '#ffffff' }}></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      className="cancelBtnPremium"
                      onClick={handleCancel}
                      disabled={savingSlot !== null || uploading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="editorPlaceholder">
                <div className="placeholderIcon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m4.93 4.93 4.24 4.24" />
                    <path d="m14.83 9.17 4.24-4.24" />
                    <path d="m14.83 14.83 4.24 4.24" />
                    <path d="m9.17 14.83-4.24 4.24" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <h3>Select a Slot</h3>
                <p>Click on any slot card from the grid to modify its homepage category title, description, and hero image.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
