'use client';

import { useState, useEffect } from 'react';
import './Timeline.css';

export default function Timeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
          const data = await res.json();
          // Sort by date ascending
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setActivities(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading timeline...</div>;
  }

  if (activities.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No timeline events found.</div>;
  }

  return (
    <div className="timeline-root">
      <div className="timeline-line"></div>
      {activities.map((act, idx) => (
        <div key={act.id} className="timeline-node-container">
          <div className="timeline-dot"></div>
          <div className="timeline-content glass">
            <div className="timeline-header-row">
              <span className="timeline-date">
                {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={`activity-status status-${act.status} timeline-status`}>
                {act.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="timeline-title">{act.title}</h3>
            <p className="timeline-desc">{act.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
