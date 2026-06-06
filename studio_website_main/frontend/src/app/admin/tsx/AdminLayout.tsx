'use client';

import React from 'react';
import '../css/AdminLayout.css';

interface AdminLayoutProps {
  adminUser: string;
  totalMessages: number;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  adminUser,
  totalMessages,
  onLogout,
  children,
}: AdminLayoutProps) {
  return (
    <div className="adminContainer">
      <div className="dashboardWrapper">
        {/* Header */}
        <header className="dashboardHeader">
          <div className="titleSection">
            <h1>AuraLens <span>Admin</span></h1>
            <p className="subtitle">Welcome back, {adminUser}</p>
          </div>
          <button className="logoutBtn" onClick={onLogout}>
            Logout
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </header>

        {/* Stats Row */}
        <section className="statsRow">
          <div className="statCard">
            <div className="statIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="statInfo">
              <h3>Total Messages</h3>
              <p className="statValue">{totalMessages}</p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
