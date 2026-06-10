'use client';

import { useState, useEffect } from 'react';
import '../css/SettingsSection.css';
import '../css/PricingSection.css';

interface ServicePrice {
  id: string; // e.g. "maternity", "newborn", "milestone", "classes"
  serviceName: string;
  basicPrice: string;
  standardPrice: string;
  premiumPrice: string;
}

export default function SettingsSection() {
  const [happyClients, setHappyClients] = useState<number>(500);
  const [photoshoots, setPhotoshoots] = useState<number>(1000);
  const [awardsWon, setAwardsWon] = useState<number>(20);
  const [clientSatisfaction, setClientSatisfaction] = useState<number>(99);
  const [instagramId, setInstagramId] = useState<string>('jith_in05');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pricing states
  const [pricingServices, setPricingServices] = useState<ServicePrice[]>([]);
  const [pricingLoading, setPricingLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<ServicePrice | null>(null);
  const [basicPrice, setBasicPrice] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [premiumPrice, setPremiumPrice] = useState('');
  const [savingPrices, setSavingPrices] = useState(false);

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
          setInstagramId(data.data.instagramId || 'jith_in05');
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
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/service-package-prices');
      const data = await response.json();
      if (response.ok) {
        setPricingServices(data.data || []);
        if (data.data && data.data.length > 0) {
          const first = data.data[0];
          setSelectedService(first);
          setBasicPrice(first.basicPrice);
          setStandardPrice(first.standardPrice);
          setPremiumPrice(first.premiumPrice);
        }
      } else {
        console.error('Failed to fetch pricing data:', data.error);
      }
    } catch (err) {
      console.error('Error fetching pricing data:', err);
    } finally {
      setPricingLoading(false);
    }
  };

  const handleSelectService = (service: ServicePrice) => {
    setSelectedService(service);
    setBasicPrice(service.basicPrice);
    setStandardPrice(service.standardPrice);
    setPremiumPrice(service.premiumPrice);
  };

  const handleSavePrices = async () => {
    if (!selectedService) return;

    if (!basicPrice.trim() || !standardPrice.trim() || !premiumPrice.trim()) {
      alert('Please fill out all price values.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('You must be logged in as an administrator to change prices.');
      return;
    }

    setSavingPrices(true);
    try {
      const response = await fetch(`http://localhost:5000/api/service-package-prices/${selectedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceName: selectedService.serviceName,
          basicPrice: basicPrice.trim(),
          standardPrice: standardPrice.trim(),
          premiumPrice: premiumPrice.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setPricingServices((prev) =>
          prev.map((s) => (s.id === selectedService.id ? data.data : s))
        );
        setSelectedService(data.data);
        alert('Pricing packages updated successfully!');
      } else {
        alert(data.error || 'Failed to update pricing packages.');
      }
    } catch (err) {
      console.error('Error saving prices:', err);
      alert('An error occurred while saving the prices.');
    } finally {
      setSavingPrices(false);
    }
  };

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
    <div className="settingsSectionContainer">
      {/* Title block aligned straight with dashboard title */}
      <div className="controlsRow">
        <h1 className="sectionTitle">Stats & Settings</h1>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '10px' }}>
              {/* Left Column: Statistics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              </div>

              {/* Right Column: Satisfaction, Instagram & Save Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                </div>

                <button type="submit" className="saveBtn" disabled={saving} style={{ marginTop: 'auto', alignSelf: 'stretch', width: '100%' }}>
                  {saving ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }}></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Configurations</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Divider and Title */}
      <div style={{ marginTop: '40px', marginBottom: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '30px', maxWidth: '100%' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          Our Packages Price Management
        </h2>
      </div>

      {pricingLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888888', padding: '20px 0' }}>
          <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span>Loading packages pricing...</span>
        </div>
      ) : (
        <div className="pricingDashboard" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch', maxWidth: '100%' }}>
          {/* Left pane: Cards */}
          <div className="servicesContainer" style={{ flex: 1, minWidth: '300px' }}>
            <div className="servicesGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {pricingServices.map((service) => {
                const isActive = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    className={`servicePriceCard ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectService(service)}
                  >
                    <div className="cardHeader">
                      <h3>{service.serviceName}</h3>
                    </div>

                    <div className="packageTiersPreview">
                      <div className="tierPreviewItem">
                        <span className="tierLabel">Basic</span>
                        <span className="tierValue">{service.basicPrice}</span>
                      </div>
                      <div className="tierPreviewItem">
                        <span className="tierLabel">Standard</span>
                        <span className="tierValue">{service.standardPrice}</span>
                      </div>
                      <div className="tierPreviewItem">
                        <span className="tierLabel">Premium</span>
                        <span className="tierValue">{service.premiumPrice}</span>
                      </div>
                    </div>

                    <div className="cardActionIndicator">
                      <span>Click to Edit Pricing</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right pane: Side Panel form */}
          <div className="pricingSidePanel" style={{ width: '380px', flexShrink: 0 }}>
            {selectedService ? (
              <div className="pricingPanelCard">
                <div className="panelHeader">
                </div>

                <div className="panelForm">
                  <div className="formGroup">
                    <label htmlFor="basicPriceInput">Basic Tier Amount</label>
                    <input
                      id="basicPriceInput"
                      type="text"
                      value={basicPrice}
                      onChange={(e) => setBasicPrice(e.target.value)}
                      placeholder="e.g. ₹15,000"
                    />
                    <small className="formHelperText">Specify amount with currency symbol if needed (e.g. ₹15,000)</small>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="standardPriceInput">Standard Tier Amount</label>
                    <input
                      id="standardPriceInput"
                      type="text"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      placeholder="e.g. ₹25,000"
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="premiumPriceInput">Premium Tier Amount</label>
                    <input
                      id="premiumPriceInput"
                      type="text"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      placeholder="e.g. ₹40,000"
                    />
                  </div>

                  <div className="panelActions">
                    <button
                      className="saveBtn"
                      onClick={handleSavePrices}
                      disabled={savingPrices}
                    >
                      {savingPrices ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pricingNoSelection">
                <p>Select a service card to configure its pricing tiers.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
