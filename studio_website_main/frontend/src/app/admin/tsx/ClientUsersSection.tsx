'use client';

import React, { useEffect, useState } from 'react';
import '../css/ClientUsersSection.css';

interface ClientUser {
  id: string;
  fullName: string;
  phone: string;
  username: string;
  bookingId: string;
  status: string;
  lastLogin?: number;
  clientId?: string;
}

export default function ClientUsersSection() {
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Chat state
  const [activeChatUser, setActiveChatUser] = useState<ClientUser | null>(null);
  const [adminChatMessages, setAdminChatMessages] = useState<any[]>([]);
  const [adminNewMessage, setAdminNewMessage] = useState('');
  const [isAdminSending, setIsAdminSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Poll unread message counts for all client users
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5000/api/chat/unread-counts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadCounts(data || {});
        }
      } catch (err) {
        console.error('Error fetching unread counts:', err);
      }
    };

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeChatUser) return;
    
    const fetchHistory = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await fetch(`http://localhost:5000/api/chat/history/${activeChatUser.bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdminChatMessages(data);
          
          // Check if there are any unread messages from the user in this history
          const hasUnread = data.some((msg: any) => msg.senderId !== 'ADMIN' && !msg.read);
          if (hasUnread) {
            fetch(`http://localhost:5000/api/chat/read/${activeChatUser.bookingId}`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).catch(err => console.error('Error marking as read during fetch:', err));

            setUnreadCounts(prev => ({
              ...prev,
              [activeChatUser.bookingId]: 0
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching admin chat:', err);
      }
    };
    
    fetchHistory();
    const interval = setInterval(fetchHistory, 4000);
    return () => clearInterval(interval);
  }, [activeChatUser]);

  // Mark as read when active user changes
  useEffect(() => {
    if (!activeChatUser) return;
    
    const markAsRead = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      try {
        await fetch(`http://localhost:5000/api/chat/read/${activeChatUser.bookingId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUnreadCounts(prev => ({
          ...prev,
          [activeChatUser.bookingId]: 0
        }));
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    };

    markAsRead();
  }, [activeChatUser]);

  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewMessage.trim() || !activeChatUser) return;
    
    const msgPayload = {
      senderId: 'ADMIN',
      receiverId: activeChatUser.bookingId,
      message: adminNewMessage.trim()
    };
    
    setAdminNewMessage('');
    setIsAdminSending(true);
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(msgPayload)
      });
      if (response.ok) {
        const savedMsg = await response.json();
        setAdminChatMessages(prev => [...prev, savedMsg]);
      }
    } catch (err) {
      console.error('Error sending admin message:', err);
    } finally {
      setIsAdminSending(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/client/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        console.error('Failed to fetch client users');
      }
    } catch (error) {
      console.error('Error fetching client users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: ClientUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/client/admin/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Optimistically update or re-fetch
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('An error occurred while updating status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client user?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/client/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete client user');
      }
    } catch (error) {
      console.error('Error deleting client user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.fullName.toLowerCase().includes(term) ||
      u.phone.includes(term) ||
      (u.bookingId && u.bookingId.toLowerCase().includes(term)) ||
      (u.clientId && u.clientId.toLowerCase().includes(term))
    );
  });

  return (
    <div className="clientUsersSectionContainer">
      <div className="controlsRow">
        <h1 className="sectionTitle">Existing Client Users</h1>
        <input
          type="text"
          placeholder="Search by username, name, phone or booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBar"
        />
      </div>

      {loading ? (
        <div className="loadingWrapper">
          <div className="spinner"></div>
          <p>Loading client users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="emptyStateCard">
          {searchTerm ? 'No matching client users found.' : 'No client users registered yet.'}
        </div>
      ) : (
        <div className="tableCard">
          <div className="existingUsersTableWrapper">
            <table className="existingUsersTable">
              <thead>
                <tr>
                  <th>CLIENT ID</th>
                  <th>USERNAME</th>
                  <th>STATUS</th>
                  <th>LAST LOGIN</th>
                  <th>CHAT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="clientIdText">{user.clientId || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="userCell">
                        <span className="usernameText">{user.username}</span>
                        <span className="fullNameText">{user.fullName} ({user.phone})</span>
                      </div>
                    </td>
                    <td>
                      <span className={`statusBadge ${user.status === 'ACTIVE' ? 'active' : 'deactivated'}`}>
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>
                      <span className="lastLoginText">{formatTimestamp(user.lastLogin)}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => setActiveChatUser(user)}
                        className="chatActionBtn"
                        title="Chat with Client"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Chat</span>
                        {unreadCounts[user.bookingId] > 0 && (
                          <span className="unreadBadge">{unreadCounts[user.bookingId]}</span>
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="actionButtons">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`statusBtn ${user.status === 'ACTIVE' ? 'deactivateBtn' : 'activateBtn'}`}
                        >
                          {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="deleteUserBtn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Chat Sidebar */}
      {activeChatUser && (
        <div className="adminChatSidebarOverlay" onClick={() => setActiveChatUser(null)}>
          <div className="adminChatSidebar" onClick={(e) => e.stopPropagation()}>
            <div className="adminChatSidebarHeader">
              <div className="sidebarHeaderUser">
                <span className="activeIndicator"></span>
                <div>
                  <h4>{activeChatUser.fullName}</h4>
                  <p>Client Chat | ID: {activeChatUser.clientId || 'N/A'}</p>
                </div>
              </div>
              <button 
                type="button" 
                className="closeSidebarBtn" 
                onClick={() => setActiveChatUser(null)}
                aria-label="Close chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="sidebarMessagesContainer">
              {adminChatMessages.length === 0 ? (
                <div className="sidebarEmptyState">
                  <p>No messages yet. Send a message to start chatting with {activeChatUser.fullName}.</p>
                </div>
              ) : (
                adminChatMessages.map((msg, index) => {
                  const isMe = msg.senderId === 'ADMIN';
                  return (
                    <div key={index} className={`sidebarMessageRow ${isMe ? 'me' : 'them'}`}>
                      <div className="sidebarChatBubble">
                        <p>{msg.message}</p>
                        <span className="sidebarChatTime">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form className="sidebarInputArea" onSubmit={handleAdminSendMessage}>
              <input
                type="text"
                placeholder="Reply to client..."
                value={adminNewMessage}
                onChange={(e) => setAdminNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!adminNewMessage.trim() || isAdminSending}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
