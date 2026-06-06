'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './Admin.css';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState('');

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

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(searchLower) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.subject.toLowerCase().includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
    <div className="adminContainer">
      <div className="dashboardWrapper">
        {/* Header */}
        <header className="dashboardHeader">
          <div className="titleSection">
            <h1>AuraLens <span>Admin</span></h1>
            <p className="subtitle">Welcome back, {adminUser}</p>
          </div>
          <button className="logoutBtn" onClick={handleLogout}>
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
              <p className="statValue">{messages.length}</p>
            </div>
          </div>
        </section>

        {/* Controls Row */}
        <section className="controlsRow">
          <h2 className="sectionTitle">Contact Messages</h2>
          <div className="searchWrapper">
            <span className="searchIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search messages..."
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Messages List */}
        {loading ? (
          <div className="loadingWrapper">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="emptyState">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <h3>No messages found</h3>
            <p>{searchQuery ? 'Try matching another search term.' : 'When users submit contact forms, they will show up here.'}</p>
          </div>
        ) : (
          <div className="messagesGrid">
            {filteredMessages.map((msg) => (
              <article key={msg._id} className="messageCard">
                <div className="cardHeader">
                  <div className="senderInfo">
                    <h4>{msg.name}</h4>
                    <div className="senderMeta">
                      <div className="metaItem">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <a href={`mailto:${msg.email}`}>{msg.email}</a>
                      </div>
                      {msg.phone && (
                        <div className="metaItem">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="timestamp">{formatDate(msg.createdAt)}</span>
                </div>
                <div className="subjectBadge">{msg.subject}</div>
                <p className="messageText">{msg.message}</p>
                <div className="cardActions">
                  <button className="deleteBtn" onClick={() => handleDelete(msg._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
