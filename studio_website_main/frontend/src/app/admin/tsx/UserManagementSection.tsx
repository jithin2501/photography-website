'use client';

import React, { useEffect, useState } from 'react';
import '../css/UserManagementSection.css';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  status: string;
  lastLogin?: number;
  pageAccess: string[];
}

const SECTIONS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'contacts', label: 'Contact Messages' },
  { id: 'clients', label: 'Client Users' },
  { id: 'client-images', label: 'Client Images' },
  { id: 'payments', label: 'Payments' },
  { id: 'wheel', label: 'Arc Wheel Settings' },
  { id: 'gallery', label: 'Gallery Settings' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'settings', label: 'Stats & Settings' },
  { id: 'user-management', label: 'User Management' },
];

export default function UserManagementSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal permissions state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/admin-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        console.error('Failed to fetch admin users');
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          role: role,
          pageAccess: role === 'Superadmin' 
            ? SECTIONS.map(s => s.id) 
            : ['bookings', 'contacts', 'reviews'] // default permissions
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Admin account for "${username}" created successfully!`);
        setUsername('');
        setPassword('');
        setRole('Admin');
        fetchAdminUsers();
      } else {
        setError(data.error || 'Failed to create admin user');
      }
    } catch (err) {
      console.error('Error creating admin user:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUsers(prev =>
          prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update admin status');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('An error occurred while updating status');
    }
  };

  const handleDeleteAdmin = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete admin user "${user.username}"?`)) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete admin user');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert('An error occurred while deleting the user');
    }
  };

  const handleOpenPermissions = (user: AdminUser) => {
    setSelectedUser(user);
    setTempPermissions(user.pageAccess || []);
    setShowModal(true);
  };

  const handleCheckboxChange = (sectionId: string) => {
    setTempPermissions(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setIsSavingPermissions(true);

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${selectedUser.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pageAccess: tempPermissions }),
      });

      if (response.ok) {
        setUsers(prev =>
          prev.map(u => (u.id === selectedUser.id ? { ...u, pageAccess: tempPermissions } : u))
        );
        setShowModal(false);
        setSelectedUser(null);
      } else {
        alert('Failed to save permissions');
      }
    } catch (err) {
      console.error('Error saving permissions:', err);
      alert('An error occurred while saving permissions');
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '/');
  };

  return (
    <div className="userManagementContainer">
      <div className="controlsRow">
        <h1 className="sectionTitle">User Management</h1>
      </div>

      {/* Form Section */}
      <div className="formCard">
        <h2>Create New Admin User</h2>
        <p className="subtitle">Create credentials for a new admin user who can access this portal.</p>

        {error && <div className="errorAlert">{error}</div>}
        {success && <div className="successAlert">{success}</div>}

        <form onSubmit={handleCreateAdmin} className="createAdminForm">
          <div className="formRow">
            <div className="formField">
              <label htmlFor="admin-username">Username:</label>
              <input
                id="admin-username"
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="formField">
              <label htmlFor="admin-password">Password:</label>
              <div className="passwordWrapper">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password must be at least 8 characters long"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eyeBtn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="formRow">
            <div className="formField">
              <label htmlFor="admin-role">Role:</label>
              <select
                id="admin-role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="roleSelect"
              >
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="createBtn">
            Create Admin Account
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="tableCard">
        <h2>Existing Admin Users</h2>

        {loading ? (
          <div className="loadingWrapper">
            <div className="spinner"></div>
            <p>Loading admin users...</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>USERNAME</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>LAST LOGIN</th>
                  <th>PAGE ACCESS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const isMainSuperadmin = user.role === 'Superadmin' && user.username === 'admin';
                  return (
                    <tr key={user.id}>
                      <td className="usernameTd">{user.username}</td>
                      <td>
                        <span className={`roleBadge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`statusText ${user.status.toLowerCase()}`}>
                          {user.status === 'ACTIVE' ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="timeTd">{formatTimestamp(user.lastLogin)}</td>
                      <td>
                        {user.role === 'Superadmin' ? (
                          <span className="fullAccessText">FULL ACCESS</span>
                        ) : (
                          <button
                            onClick={() => handleOpenPermissions(user)}
                            className="permissionsBtn"
                          >
                            Access
                          </button>
                        )}
                      </td>
                      <td>
                        {isMainSuperadmin ? (
                          <span className="actionPlaceholder">-</span>
                        ) : (
                          <div className="actionWrapper">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`actionToggleBtn ${user.status.toLowerCase()}`}
                              title={user.status === 'ACTIVE' ? 'Deactivate user' : 'Activate user'}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                                {user.status !== 'ACTIVE' ? (
                                  <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" />
                                ) : (
                                  <circle cx="12" cy="7" r="1" fill="#10b981" />
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(user)}
                              className="actionDeleteBtn"
                              title="Delete user"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions Modal */}
      {showModal && selectedUser && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="permissionsModal" onClick={e => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Section Access: {selectedUser.username}</h3>
              <button 
                type="button" 
                className="modalCloseBtn" 
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modalBody">
              <p className="modalSubtitle">Tick the sections this admin can access:</p>
              <div className="checkboxesGrid">
                {SECTIONS.map(section => (
                  <label key={section.id} className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={tempPermissions.includes(section.id)}
                      onChange={() => handleCheckboxChange(section.id)}
                      disabled={section.id === 'user-management' && selectedUser.role !== 'Superadmin'}
                    />
                    <span className="checkboxCustom"></span>
                    <span className="checkboxText">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modalFooter">
              <button
                type="button"
                className="cancelBtn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saveBtn"
                onClick={handleSavePermissions}
                disabled={isSavingPermissions}
              >
                {isSavingPermissions ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
