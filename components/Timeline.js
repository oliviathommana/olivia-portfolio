'use client';

import { useState, useEffect, useRef } from 'react';
import './Timeline.css';

// ─── Category detection based on title keywords ───────────────────────────────
function getCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('iot') || t.includes('ecosystem') || t.includes('inaug')) return 'iot';
  if (t.includes('microcontroller') || t.includes('arduino') || t.includes('esp32') || t.includes('ide')) return 'hardware';
  if (t.includes('electronic') || t.includes('component') || t.includes('resistor') || t.includes('led')) return 'electronics';
  if (t.includes('gpio') || t.includes('measurement') || t.includes('voltage') || t.includes('multimeter')) return 'hardware';
  if (t.includes('ldr') || t.includes('light') || t.includes('sensor')) return 'sensor';
  if (t.includes('dht') || t.includes('temperature') || t.includes('humidity')) return 'sensor';
  if (t.includes('wifi') || t.includes('network') || t.includes('protocol') || t.includes('tcp') || t.includes('ip')) return 'network';
  if (t.includes('blynk') || t.includes('cloud') || t.includes('auth') || t.includes('token')) return 'cloud';
  if (t.includes('telemetry') || t.includes('real-time') || t.includes('dashboard')) return 'cloud';
  if (t.includes('thingspeak') || t.includes('logger') || t.includes('capstone')) return 'capstone';
  if (t.includes('dhcp') || t.includes('lan') || t.includes('cisco') || t.includes('packet tracer')) return 'network';
  if (t.includes('router') || t.includes('inter-network') || t.includes('fastethernet') || t.includes('subnet')) return 'network';
  return 'general';
}

const CATEGORY_META = {
  iot:         { label: 'IoT & Ecosystem',   color: '#a78bfa', glow: 'rgba(167,139,250,0.4)',  icon: '🌐' },
  hardware:    { label: 'Hardware & MCU',    color: '#f59e0b', glow: 'rgba(245,158,11,0.4)',   icon: '⚙️' },
  electronics: { label: 'Electronics',       color: '#34d399', glow: 'rgba(52,211,153,0.4)',   icon: '🔌' },
  sensor:      { label: 'Sensor Interfacing',color: '#38bdf8', glow: 'rgba(56,189,248,0.4)',   icon: '📡' },
  network:     { label: 'Networking',        color: '#fb7185', glow: 'rgba(251,113,133,0.4)',  icon: '🔗' },
  cloud:       { label: 'Cloud & IoT',       color: '#0891b2', glow: 'rgba(8,145,178,0.4)',    icon: '☁️' },
  capstone:    { label: 'Capstone Project',  color: '#f472b6', glow: 'rgba(244,114,182,0.4)',  icon: '🏆' },
  general:     { label: 'General',           color: '#6b84f8', glow: 'rgba(107,132,248,0.4)',  icon: '📋' },
};

// ─── Single animated node ─────────────────────────────────────────────────────
function TimelineNode({ act, index, isExpanded, onToggle }) {
  const nodeRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const cat = getCategory(act.title);
  const meta = CATEGORY_META[cat];

  // Intersection Observer for staggered reveal
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Day number extracted from title (e.g. "Day 03:")
  const dayMatch = act.title.match(/^Day\s+(\d+)/i);
  const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : index + 1;

  const formattedDate = new Date(act.date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Strip "Day NN: " prefix from title for cleaner display
  const cleanTitle = act.title.replace(/^Day\s+\d+:\s*/i, '');

  return (
    <div
      ref={nodeRef}
      className={`tl-node ${visible ? 'tl-node--visible' : ''}`}
      style={{ '--delay': `${index * 80}ms`, '--cat-color': meta.color, '--cat-glow': meta.glow }}
    >
      {/* Left: Day badge + dot */}
      <div className="tl-left">
        <div className="tl-day-badge">
          <span className="tl-day-num">{String(dayNum).padStart(2, '0')}</span>
          <span className="tl-day-label">DAY</span>
        </div>
        <div className="tl-dot">
          <span className="tl-dot-icon">{meta.icon}</span>
        </div>
      </div>

      {/* Right: Card */}
      <div className="tl-card glass" onClick={onToggle} tabIndex={0} role="button"
           aria-expanded={isExpanded} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        {/* Top row */}
        <div className="tl-card-top">
          <div className="tl-card-meta">
            <span className="tl-cat-badge" style={{ background: `${meta.color}18`, color: meta.color, borderColor: `${meta.color}40` }}>
              {meta.label}
            </span>
            <span className="tl-date-chip">{formattedDate}</span>
            {act.time && <span className="tl-time-chip">⏱ {act.time}</span>}
          </div>
          <span className={`tl-chevron ${isExpanded ? 'tl-chevron--open' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        <h3 className="tl-title">{cleanTitle}</h3>

        {/* Expandable description */}
        <div className={`tl-desc-wrap ${isExpanded ? 'tl-desc-wrap--open' : ''}`}>
          <p className="tl-desc">{act.description}</p>
        </div>

        {/* Status pill */}
        <div className="tl-footer">
          <span className={`tl-status activity-status status-${act.status}`}>
            {act.status === 'completed' ? '✓ Completed' : act.status.replace('_', ' ')}
          </span>
          <span className="tl-expand-hint">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Timeline component ──────────────────────────────────────────────────
export default function Timeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
          const data = await res.json();
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
          const filtered = data.filter(act => /^Day\s+\d+/i.test((act.title || '').trim()));
          setActivities(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const categories = ['all', ...Array.from(new Set(activities.map(a => getCategory(a.title))))];

  const displayed = filter === 'all'
    ? activities
    : activities.filter(a => getCategory(a.title) === filter);

  const completedCount = activities.filter(a => a.status === 'completed').length;
  const progress = activities.length ? Math.round((completedCount / activities.length) * 100) : 0;

  if (loading) {
    return (
      <div className="tl-loading">
        <div className="tl-spinner" />
        <span>Loading timeline…</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return <div className="tl-empty">No timeline events found.</div>;
  }

  return (
    <div className="tl-root">
      {/* ── Stats Bar ─────────────────────────────── */}
      <div className="tl-stats">
        <div className="tl-stat-card">
          <span className="tl-stat-val">{activities.length}</span>
          <span className="tl-stat-label">Total Days</span>
        </div>
        <div className="tl-stat-card">
          <span className="tl-stat-val" style={{ color: '#34d399' }}>{completedCount}</span>
          <span className="tl-stat-label">Completed</span>
        </div>
        <div className="tl-stat-card">
          <span className="tl-stat-val" style={{ color: '#f59e0b' }}>{progress}%</span>
          <span className="tl-stat-label">Progress</span>
        </div>
        <div className="tl-stat-card tl-progress-bar-card">
          <div className="tl-progress-track">
            <div className="tl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="tl-stat-label">{completedCount} / {activities.length} days done</span>
        </div>
      </div>

      {/* ── Category Filter Pills ──────────────────── */}
      <div className="tl-filters">
        {categories.map(cat => {
          const meta = cat === 'all' ? { label: 'All Days', color: '#6b84f8' } : CATEGORY_META[cat];
          return (
            <button
              key={cat}
              className={`tl-filter-pill ${filter === cat ? 'tl-filter-pill--active' : ''}`}
              style={filter === cat ? { background: `${meta.color}22`, borderColor: meta.color, color: meta.color } : {}}
              onClick={() => setFilter(cat)}
            >
              {cat !== 'all' && <span>{CATEGORY_META[cat].icon}</span>}
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* ── Timeline Track ────────────────────────── */}
      <div className="tl-track">
        {/* Vertical line */}
        <div className="tl-vline" />

        {displayed.map((act, idx) => (
          <TimelineNode
            key={act.id}
            act={act}
            index={idx}
            isExpanded={expandedId === act.id}
            onToggle={() => setExpandedId(prev => prev === act.id ? null : act.id)}
          />
        ))}
      </div>

      {/* ── End marker ────────────────────────────── */}
      <div className="tl-end-marker">
        <div className="tl-end-dot" />
        <span className="tl-end-label">
          {filter === 'all' ? `${activities.length} Days Logged` : `${displayed.length} days shown`}
        </span>
      </div>
    </div>
  );
}
