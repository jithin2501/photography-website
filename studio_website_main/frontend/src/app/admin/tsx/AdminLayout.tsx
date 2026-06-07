'use client';

import React from 'react';
import '../css/AdminLayout.css';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  children,
}: AdminLayoutProps) {
  return (
    <div className="adminContainer">
      {/* Sidebar */}
      <aside className="adminSidebar">
        <div className="sidebarBrand">
          <h2>Admin Dashboard</h2>
        </div>

        <nav className="sidebarNav">
          <ul>
            <li className={activeTab === 'contacts' ? 'active' : ''} onClick={() => onTabChange('contacts')}>
              <span className="navLink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Contact Messages</span>
              </span>
            </li>
            <li className={activeTab === 'wheel' ? 'active' : ''} onClick={() => onTabChange('wheel')}>
              <span className="navLink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 4.24 4.24" />
                  <path d="m14.83 9.17 4.24-4.24" />
                  <path d="m14.83 14.83 4.24 4.24" />
                  <path d="m9.17 14.83-4.24 4.24" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <span>Arc Wheel Settings</span>
              </span>
            </li>
            <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => onTabChange('gallery')}>
              <span className="navLink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Gallery Settings</span>
              </span>
            </li>
          </ul>
        </nav>

        <div className="sidebarFooter">
          <button className="signOutBtn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="adminMain">
        <main className="mainContent">
          {children}
        </main>
      </div>
    </div>
  );
}
