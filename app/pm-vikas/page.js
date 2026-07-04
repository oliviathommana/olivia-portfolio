'use client';

import Link from 'next/link';
import Silk from '@/components/Silk';
import Calendar from '@/components/Calendar';
import Timeline from '@/components/Timeline';
import './PmVikas.css';

export default function PmVikas() {
  return (
    <div className="pmvikas-root container">
      {/* Hero Header */}
      <header className="pmvikas-hero">
        <div className="pmvikas-hero-bg">
          <Silk
            speed={1.2}
            scale={0.8}
            color="#0891b2"
            noiseIntensity={0.9}
            rotation={0.4}
          />
        </div>
        <div className="pmvikas-header" style={{ position: 'relative', zIndex: 1 }}>
          <span className="pm-badge">Ministry of Minority Affairs · GoI</span>
          <h1 className="pmvikas-title">
            PM-VIKAS Programme: <br />
            <span className="gradient-text">IoT Assistant Internship</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginTop: '10px' }}>
            Completed a comprehensive technical training and research internship at the Indian Institute of
            Information Technology (IIIT), Kottayam. This skill development program (Pradhan Mantri Virasat
            Ka Samvardhan) builds future-ready capacity in IoT architecture, embedded telemetry systems, and
            edge computing.
          </p>
        </div>

        <div className="pmvikas-meta">
          <div className="meta-box">
            <div className="meta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
            </div>
            <div className="meta-info">
              <span className="meta-label">Implementing Body</span>
              <span className="meta-val">IIIT Kottayam</span>
            </div>
          </div>

          <div className="meta-box">
            <div className="meta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            </div>
            <div className="meta-info">
              <span className="meta-label">Selected Track</span>
              <span className="meta-val">IoT-Assistant Course</span>
            </div>
          </div>

          <div className="meta-box">
            <div className="meta-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="meta-info">
              <span className="meta-label">National Initiative</span>
              <span className="meta-val">Skill India Campaign</span>
            </div>
          </div>
        </div>
      </header>



      {/* Dark Theme Section Wrapper for Timeline & Calendar */}
      <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--fg)', padding: '40px 20px', borderRadius: '24px', margin: '40px 0', boxShadow: 'var(--shadow-blue)' }}>
        
        {/* Timeline Section */}
        <section
          className="pm-timeline-section"
          style={{ paddingBottom: '60px' }}
        >
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '10px' }}>
            <span className="section-subtitle">Journey</span>
            <h2 className="section-title">Day-by-Day Timeline</h2>
          </div>
          <Timeline />
        </section>

        {/* Activity Calendar — main section */}
        <section
          className="pm-calendar-section"
          style={{ borderTop: '1px solid var(--card-border)', paddingTop: '60px', paddingBottom: '20px' }}
        >
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
            <span className="section-subtitle">Live Tracker</span>
            <h2 className="section-title">Daily Activity Log</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '700px' }}>
              This calendar logs tasks completed, system tests run, and research items covered during the
              internship at IIIT Kottayam. Use the calendar below to add, modify, or delete entries directly to the Vercel Database.
            </p>
          </div>
          <div className="pm-calendar-container glass" style={{ padding: '30px' }}>
            <Calendar embedded={true} />
          </div>
        </section>
      </div>
    </div>
  );
}
