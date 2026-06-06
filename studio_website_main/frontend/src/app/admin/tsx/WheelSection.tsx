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
        const sorted = (data.data || []).sort((a: WheelImage, b: WheelImage) => a.slot - b.slot);
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

  return (
    <div className="wheelSectionContainer">
      <section className="controlsRow">
        <h1 className="sectionTitle">Arc Wheel Settings</h1>
      </section>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading wheel configurations...</p>
        </div>
      ) : (
        <div className="wheelGrid">
          {items.map((item) => {
            const isEditing = editingSlot === item.slot;
            const isSaving = savingSlot === item.slot;

            return (
              <div key={item.slot} className={`wheelCard ${isEditing ? 'editing' : ''}`}>
                <div className="wheelSlotBadge">Slot {item.slot}</div>
                
                {isEditing ? (
                  <div className="editForm">
                    <div className="formGroup">
                      <label>Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter category title"
                      />
                    </div>
                    
                    <div className="formGroup">
                      <label>Upload New Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && <div className="uploadStatus">Uploading image to Cloudinary...</div>}
                    </div>

                    {editImageUrl && (
                      <div className="formGroup">
                        <label>Image Preview</label>
                        <div
                          className="editPreviewThumbnail"
                          style={{ backgroundImage: `url('${editImageUrl}')` }}
                        />
                      </div>
                    )}

                    <div className="formGroup">
                      <label>Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Enter short description"
                        rows={3}
                      />
                    </div>

                    <div className="formActions">
                      <button
                        className="saveBtn"
                        onClick={() => handleSave(item.slot)}
                        disabled={isSaving || uploading}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="cancelBtn" onClick={handleCancel} disabled={isSaving || uploading}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="wheelCardContent">
                    <div
                      className="wheelThumbnail"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />
                    <div className="wheelInfo">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <button className="editSlotBtn" onClick={() => handleEditClick(item)}>
                      Edit Slot
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
