'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const { isAdmin, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', section: null },
    { label: 'About', href: '/#about', section: 'about' },
    { label: 'Skills', href: '/#skills', section: 'skills' },
    { label: 'Projects', href: '/#projects', section: 'projects' },
    { label: 'PM-VIKAS', href: '/pm-vikas', section: null },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Brand */}
        <Link href="/" className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">Portfolio</span>
          <span className="logo-bracket">/&gt;</span>
        </Link>

        {/* Desktop links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-link ${
                (link.href === '/' && pathname === '/') ||
                (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]) && link.href !== '/')
                  ? 'active'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Auth + Theme */}
        <div className="navbar-right">
          {/* Theme Toggle Removed */}

          {/* Auth Section */}
          <div className="navbar-auth">
            {isAdmin ? (
              <div className="admin-status">
                <span className="admin-badge">
                  <span className="status-dot"></span>
                  Admin Active
                </span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="login-form">
                <input
                  type="password"
                  placeholder="Admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`login-input ${error ? 'login-error' : ''}`}
                  required
                  id="admin-password-input"
                />
                <button type="submit" className="login-btn" id="admin-login-btn">
                  Login
                </button>
              </form>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
