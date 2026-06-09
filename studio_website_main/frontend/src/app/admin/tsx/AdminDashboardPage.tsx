'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../css/Admin.css';
import AdminLayout from './AdminLayout';
import MessageSection from './MessageSection';
import WheelSection from './WheelSection';
// Dynamic admin panel section for managing gallery photo uploads
import GallerySection from './GallerySection';
import PricingSection from './PricingSection';
import BookingSection from './BookingSection';
import ReviewSection from './ReviewSection';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUsername');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
    } else {
      setIsAuthenticated(true);
      setAdminUser(user || 'Admin');
      fetchMessages(token);
    }
  }, []);

  const fetchMessages = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/contact/admin/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(data.data || []);
      } else {
        console.error('Failed to fetch messages:', data.error);
        if (response.status === 401 || response.status === 403) {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/contact/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('An error occurred while deleting the message');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    router.push('/login');
  };

  if (isAuthenticated === false) {
    return (
      <div className="deniedContainer">
        <div className="deniedCard">
          <div className="deniedIcon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Access Denied</h1>
          <p>You must be logged in as an administrator to view this page.</p>
          <button className="loginRedirectBtn" onClick={() => router.push('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'contacts' ? (
        <MessageSection
          messages={messages}
          loading={loading}
          onDeleteMessage={handleDelete}
        />
      ) : activeTab === 'bookings' ? (
        <BookingSection />
      ) : activeTab === 'gallery' ? (
        <GallerySection />
      ) : activeTab === 'pricing' ? (
        <PricingSection />
      ) : activeTab === 'reviews' ? (
        <ReviewSection />
      ) : (
        <WheelSection />
      )}
    </AdminLayout>
  );
}
