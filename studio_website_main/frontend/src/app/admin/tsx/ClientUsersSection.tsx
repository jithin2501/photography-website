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
    </div>
  );
}
