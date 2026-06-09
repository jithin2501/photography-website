'use client';

import { useState, useEffect } from 'react';
import '../css/SettingsSection.css';

export default function SettingsSection() {
  const [happyClients, setHappyClients] = useState<number>(500);
  const [photoshoots, setPhotoshoots] = useState<number>(1000);
  const [awardsWon, setAwardsWon] = useState<number>(20);
  const [clientSatisfaction, setClientSatisfaction] = useState<number>(99);
  const [instagramId, setInstagramId] = useState<string>('auralens_studio');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.data) {
          setHappyClients(data.data.happyClients);
          setPhotoshoots(data.data.photoshoots);
          setAwardsWon(data.data.awardsWon);
          setClientSatisfaction(data.data.clientSatisfaction !== undefined ? data.data.clientSatisfaction : 99);
          setInstagramId(data.data.instagramId || 'auralens_studio');
        } else {
          setError(data.error || 'Failed to retrieve site settings.');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Connection error. Could not load current settings.');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (happyClients < 0 || photoshoots < 0 || awardsWon < 0) {
      setError('Numerical statistics cannot be negative numbers.');
      return;
    }

    if (clientSatisfaction < 0 || clientSatisfaction > 100) {
      setError('Client Satisfaction must be a percentage between 0 and 100.');
      return;
    }

    if (!instagramId.trim()) {
      setError('Instagram ID cannot be empty.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Unauthorized. Please log in again.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          happyClients,
          photoshoots,
          awardsWon,
          clientSatisfaction,
          instagramId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Statistics and Instagram settings updated successfully.');
      } else {
        setError(data.error || 'Failed to update settings.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Connection error. Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settingsSection">
      {/* Title block aligned straight with dashboard title */}
      <div className="sectionHeader">
        <div>
          <h1 className="mainTitle">Stats & Settings</h1>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888888', padding: '20px 0' }}>
          <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span>Loading site configurations...</span>
        </div>
      ) : (
        <div className="settingsCard">
          <div className="settingsCardTitle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Site Statistics & Profiles</span>
          </div>

          <form className="settingsForm" onSubmit={handleSave}>
            {error && <div className="messageAlert errorAlert">{error}</div>}
            {success && <div className="messageAlert successAlert">{success}</div>}

            <div className="formGroup">
              <label className="formLabel" htmlFor="happy-clients">Happy Clients</label>
              <input
                id="happy-clients"
                type="number"
                className="settingsInput"
                value={happyClients}
                onChange={(e) => setHappyClients(parseInt(e.target.value) || 0)}
                required
                min="0"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="photoshoots">Photoshoots</label>
              <input
                id="photoshoots"
                type="number"
                className="settingsInput"
                value={photoshoots}
                onChange={(e) => setPhotoshoots(parseInt(e.target.value) || 0)}
                required
                min="0"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="awards-won">Awards Won</label>
              <input
                id="awards-won"
                type="number"
                className="settingsInput"
                value={awardsWon}
                onChange={(e) => setAwardsWon(parseInt(e.target.value) || 0)}
                required
                min="0"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="client-satisfaction">Client Satisfaction (in %)</label>
              <input
                id="client-satisfaction"
                type="number"
                className="settingsInput"
                value={clientSatisfaction}
                onChange={(e) => setClientSatisfaction(parseInt(e.target.value) || 0)}
                required
                min="0"
                max="100"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="instagram-id">Instagram Profile Handle</label>
              <input
                id="instagram-id"
                type="text"
                className="settingsInput"
                placeholder="e.g. auralens_studio"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="saveBtn" disabled={saving}>
              {saving ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Configurations</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
