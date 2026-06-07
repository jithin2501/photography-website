'use client';

import React, { useEffect, useState } from 'react';
import '../css/GallerySection.css';

interface GalleryImage {
  id?: string;
  _id?: string;
  imageUrl: string;
  category: string;
  title: string;
  showcasePosition?: number;
  createdAt?: number;
}

const CATEGORIES = ['Maternity', 'Newborn', 'Milestone', 'Family', 'Couples', 'Events'];

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maternity');
  const [imageUrl, setImageUrl] = useState('');
  const [showcasePosition, setShowcasePosition] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery-images', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) {
        setImages(data.data || []);
      } else {
        console.error('Failed to load gallery images:', data.error);
      }
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (image: GalleryImage) => {
    const id = image.id || image._id || null;
    setEditingId(id);
    setTitle(image.title);
    setCategory(image.category);
    setImageUrl(image.imageUrl);
    setShowcasePosition(image.showcasePosition || 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Maternity');
    setImageUrl('');
    setShowcasePosition(0);
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

      // Re-use the existing Cloudinary upload endpoint
      const res = await fetch('http://localhost:5000/api/wheel-images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload image. Please verify your Cloudinary configurations.');
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('An error occurred during file upload. Check your connection or backend configuration.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('Please upload an image first.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to perform this action.');
      return;
    }

    setSaving(true);

    try {
      const url = editingId 
        ? `http://localhost:5000/api/gallery-images/${editingId}`
        : 'http://localhost:5000/api/gallery-images';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl,
          category,
          title: title.trim() || 'Untitled',
          showcasePosition,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingId) {
          // Update the specific image in list
          setImages((prev) =>
            prev.map((img) => ((img.id || img._id) === editingId ? data.data : img))
          );
        } else {
          // Prepend new image to list
          setImages((prev) => [data.data, ...prev]);
        }
        // Reset form
        setTitle('');
        setCategory('Maternity');
        setImageUrl('');
        setShowcasePosition(0);
        setEditingId(null);
      } else {
        alert(data.error || `Failed to ${editingId ? 'update' : 'save'} gallery image.`);
      }
    } catch (err) {
      console.error(`Error ${editingId ? 'updating' : 'saving'} gallery image:`, err);
      alert(`An error occurred while ${editingId ? 'updating' : 'saving'} the image.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to perform this action.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/gallery-images/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setImages((prev) => prev.filter((img) => (img.id || img._id) !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete gallery image.');
      }
    } catch (err) {
      console.error('Error deleting gallery image:', err);
      alert('An error occurred while deleting the image.');
    }
  };

  return (
    <div className="gallerySectionContainer">
      <section className="controlsRow">
        <div>
          <h1 className="sectionTitle">
            <span>Gallery Settings</span>
          </h1>
        </div>
      </section>

      <div className="galleryDashboard">
        {/* Left Side: Images Grid */}
        <div className="galleryItemsContainer">
          {loading ? (
            <div className="loadingWrapper">
              <div className="spinner"></div>
              <p>Loading gallery images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="emptyGalleryState">
              <div className="emptyGalleryIcon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>No Images in Gallery</h3>
              <p>Upload your first photo using the panel on the right.</p>
            </div>
          ) : (
            <div className="galleryItemsGrid">
              {images.map((item) => {
                const imgId = item.id || item._id || '';
                return (
                  <div
                    key={imgId}
                    className="galleryCard"
                    style={{ backgroundImage: `url('${item.imageUrl}')` }}
                  >
                    <span className="categoryBadge">{item.category}</span>
                    {item.showcasePosition && item.showcasePosition > 0 ? (
                      <span className="featuredBadge" title={`Featured at Position ${item.showcasePosition}`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>Pos {item.showcasePosition}</span>
                      </span>
                    ) : null}
                    <button
                      className="editCardBtn"
                      onClick={() => handleEditClick(item)}
                      title="Edit Image details"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="deleteCardBtn"
                      onClick={() => handleDelete(imgId)}
                      title="Delete Image"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    <div className="galleryCardContent">
                      <h4 className="galleryCardTitle">{item.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Upload and Add Form */}
        <div className="formPanel">
          <div className="formHeader">
            <h2>{editingId ? 'Edit Image Details' : 'Add New Image'}</h2>
          </div>

          <form className="galleryForm" onSubmit={handleSave}>
            <div className="formGroup">
              <label>Category / Filter</label>
              <select
                className="formSelect"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Image Title</label>
              <input
                type="text"
                className="formInput"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Swaddled Dreams"
              />
            </div>

            <div className="formGroup">
              <label>Showcase Position (Homepage)</label>
              <select
                className="formSelect"
                value={showcasePosition}
                onChange={(e) => setShowcasePosition(Number(e.target.value))}
              >
                <option value={0}>Do Not Show on Homepage</option>
                <option value={1}>Position 1 (Col 1 - Top)</option>
                <option value={2}>Position 2 (Col 1 - Bottom)</option>
                <option value={3}>Position 3 (Col 2 - Top)</option>
                <option value={4}>Position 4 (Col 2 - Middle)</option>
                <option value={5}>Position 5 (Col 2 - Bottom)</option>
                <option value={6}>Position 6 (Col 3)</option>
                <option value={7}>Position 7 (Col 6)</option>
                <option value={8}>Position 8 (Col 7 - Top)</option>
                <option value={9}>Position 9 (Col 7 - Middle)</option>
                <option value={10}>Position 10 (Col 7 - Bottom)</option>
                <option value={11}>Position 11 (Col 8 - Top)</option>
                <option value={12}>Position 12 (Col 8 - Bottom)</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Upload Image</label>
              <div className="uploadDropzone">
                <input
                  type="file"
                  className="uploadDropzoneInput"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || saving}
                />

                {imageUrl ? (
                  <>
                    <div className="dropzonePreview" style={{ backgroundImage: `url('${imageUrl}')` }} />
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

            <div className="formActionGroup">
              <button
                type="submit"
                className="saveBtnPremium"
                disabled={saving || uploading || !imageUrl}
              >
                {saving ? (
                  <>
                    <div className="uploadSpinner" style={{ width: '12px', height: '12px', borderTopColor: '#ffffff' }}></div>
                    <span>{editingId ? 'Saving Changes...' : 'Adding to Gallery...'}</span>
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Image</span>
                      </>
                    )}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancelBtnPremium"
                  onClick={handleCancelEdit}
                  disabled={saving || uploading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
