'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Login.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', { username, password, rememberMe });
    // Add login logic here
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
              Welcome <span className="highlight">Back</span>
            </h1>
            <p className="subtitle">Login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                />
                <button
                  type="button"
                  className="eyeButton"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

            {/* Options (Remember Me / Forgot Password) */}
            <div className="formOptions">
              <label className="rememberMe">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="#" className="forgotPassword">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="loginButton">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="divider">or continue with</div>

          {/* Social Sign-in Buttons */}
          <div className="socialGroup">
            <button type="button" className="socialButton">
              <span className="socialIcon">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19 0-3.41 2.78-6.19 6.19-6.19 1.56 0 2.978.58 4.07 1.53l3.056-3.056C19.227 1.83 15.938 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.877 0 10.87-4.238 10.87-11.24 0-.742-.066-1.425-.195-1.955H12.24z" />
                </svg>
              </span>
              Google
            </button>
            <button type="button" className="socialButton">
              <span className="socialIcon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.02 2.96 1.1.09 2.23-.58 2.95-1.39z" />
                </svg>
              </span>
              Apple
            </button>
          </div>

          {/* Footer Link */}
          <p className="footerText">
            Don't have an account?
            <Link href="#" className="signupLink">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
