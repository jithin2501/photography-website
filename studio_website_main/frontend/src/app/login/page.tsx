'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './Login.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        if (data.role === 'client') {
          localStorage.setItem('clientToken', data.token);
          localStorage.setItem('clientUsername', data.username);
          localStorage.setItem('clientFullName', data.fullName || '');
          localStorage.setItem('clientBookingId', data.bookingId || '');
          router.push('/client-dashboard');
        } else {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUsername', data.username);
          localStorage.setItem('adminRole', data.role || 'Admin');
          localStorage.setItem('adminPageAccess', JSON.stringify(data.pageAccess || []));
          router.push('/admin');
        }
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="loginPage">
      <div className="loginContainer">
        {/* Left Side: Photography Studio Image */}
        <div className="imageSection">
          <Image
            src="/images/login.png"
            alt="Photography Studio Session"
            fill
            priority
            className="loginImage"
          />
        </div>

        {/* Right Side: Login Form Card */}
        <div className="formSection">
          <div className="header">
            <h1 className="title">
              Welcome
            </h1>
            <p className="subtitle">Login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="errorBox">{error}</div>}
            
            {/* Username Input */}
            <div className="formGroup">
              <label htmlFor="username" className="label">Username</label>
              <div className="inputWrapper">
                <span className="inputIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  className="input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="formGroup">
              <label htmlFor="password" className="label">Password</label>
              <div className="inputWrapper">
                <span className="inputIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eyeButton"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="loginButton" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
