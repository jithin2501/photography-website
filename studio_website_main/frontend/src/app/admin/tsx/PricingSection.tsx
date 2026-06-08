'use client';

import React, { useEffect, useState } from 'react';
import '../css/PricingSection.css';

interface ServicePrice {
  id: string; // e.g. "maternity", "newborn", "milestone", "classes"
  serviceName: string;
  basicPrice: string;
  standardPrice: string;
  premiumPrice: string;
}

export default function PricingSection() {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServicePrice | null>(null);

  // Edit states
  const [basicPrice, setBasicPrice] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [premiumPrice, setPremiumPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/service-package-prices');
      const data = await response.json();
      if (response.ok) {
        setServices(data.data || []);
        // Automatically select the first service if available
        if (data.data && data.data.length > 0) {
          handleSelectService(data.data[0]);
        }
      } else {
        console.error('Failed to fetch pricing data:', data.error);
      }
    } catch (err) {
      console.error('Error fetching pricing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: ServicePrice) => {
    setSelectedService(service);
    setBasicPrice(service.basicPrice);
    setStandardPrice(service.standardPrice);
    setPremiumPrice(service.premiumPrice);
  };

  const handleSave = async () => {
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

    setSaving(true);
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
        setServices((prev) =>
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pricingLoading">
        <div className="pricingSpinner"></div>
        <p>Loading service package pricing...</p>
      </div>
    );
  }

  return (
    <div className="pricingSectionContainer">
      {/* Title Header */}
      <div className="controlsRow">
        <div>
          <h1 className="sectionTitle">

            Our Packages Price Management
          </h1>
          <p className="sectionSubtitle">

          </p>
        </div>
      </div>

      <div className="pricingDashboard">
        {/* Left pane: Cards */}
        <div className="servicesContainer">
          <div className="servicesGrid">
            {services.map((service) => {
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
        <div className="pricingSidePanel">
          {selectedService ? (
            <div className="pricingPanelCard">
              <div className="panelHeader">

                <div>
                  <h3>Edit {selectedService.serviceName} Pricing</h3>
                  <p>Update packages amounts. Values are synchronized in real-time on public pages.</p>
                </div>
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
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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
    </div>
  );
}
