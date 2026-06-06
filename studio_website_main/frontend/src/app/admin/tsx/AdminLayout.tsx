'use client';

import React from 'react';
import '../css/AdminLayout.css';

interface AdminLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
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
            <li className="active">
              <span className="navLink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Contact Messages</span>
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
