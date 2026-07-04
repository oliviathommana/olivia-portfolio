'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import './Calendar.css';

export default function Calendar({ embedded = false }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date()); // Dynamically defaults to today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formActivityId, setFormActivityId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('completed');

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      } else {
        addToast('Failed to retrieve calendar activities.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error connecting to backend API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Format date helper: YYYY-MM-DD
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (dayNum, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
    setSelectedDate(clickedDate);
    
    // Find if activity exists
    const dateStr = formatDateString(clickedDate);
    const existing = activities.find((a) => a.date === dateStr);
    
    if (existing) {
      setFormActivityId(existing.id);
      setFormTitle(existing.title);
      setFormDesc(existing.description);
      setFormStatus(existing.status);
      setIsEditing(true);
    } else {
      setFormActivityId(null);
      setFormTitle('');
      setFormDesc('');
      setFormStatus('completed');
      setIsEditing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const dateStr = formatDateString(selectedDate);
    addToast('Syncing to Vercel Database...', 'info');

    // Password removed
    const apiPassword = '';

    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formActivityId,
          date: dateStr,
          title: formTitle,
          description: formDesc,
          status: formStatus,
          password: apiPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast(`Successfully synced to Vercel Postgres Database.`, 'success');
        fetchActivities();
        setIsEditing(true);
        if (!formActivityId && data.id) {
          setFormActivityId(data.id);
        }
      } else {
        addToast(data.error || 'Failed to update database.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving data to database.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!formActivityId) return;

    if (!confirm('Are you sure you want to delete this activity?')) return;

    addToast('Removing from Vercel Database...', 'info');

    try {
      const res = await fetch(`/api/calendar?id=${formActivityId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'enter your password here'
        }
      });

      if (res.ok) {
        addToast('Successfully removed from Vercel Postgres Database.', 'success');
        fetchActivities();
        setFormActivityId(null);
        setFormTitle('');
        setFormDesc('');
        setFormStatus('completed');
        setIsEditing(false);
      } else {
        addToast('Failed to delete activity.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error communicating with database.', 'error');
    }
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // Weekday index for first day
  const totalDays = new Date(year, month + 1, 0).getDate(); // Number of days in month
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Create grid cells
  const dayCells = [];

  // Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    dayCells.push({
      dayNum: prevMonthTotalDays - i,
      isCurrentMonth: false
    });
  }

  // Current month cells
  for (let i = 1; i <= totalDays; i++) {
    dayCells.push({
      dayNum: i,
      isCurrentMonth: true
    });
  }

  // Next month padding cells
  const remainingCells = 42 - dayCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    dayCells.push({
      dayNum: i,
      isCurrentMonth: false
    });
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const getDayActivity = (dayNum, isCurrentMonth) => {
    if (!isCurrentMonth) return null;
    const dateStr = formatDateString(new Date(year, month, dayNum));
    return activities.find((a) => a.date === dateStr);
  };

  const selectedDateStr = formatDateString(selectedDate);
  const selectedActivity = activities.find((a) => a.date === selectedDateStr);

  const filteredActivities = searchQuery.trim() === ''
    ? activities
    : activities.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.date.includes(searchQuery)
      );

  return (
    <div className={`cal-component-root ${embedded ? 'embedded' : ''}`}>
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} glass`}>
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34d399', flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            )}
            {toast.type === 'info' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60a5fa', flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            )}
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f87171', flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header with Search */}
      {!embedded ? (
        <header className="cal-header">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '8px' }}>
              Daily <span className="gradient-text">Activity Tracker</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track progress, research items, and daily milestones. Admins can update data in real time.
            </p>
          </div>

          <div className="search-container">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </header>
      ) : (
        <div className="cal-embedded-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 className="sidebar-title" style={{ color: 'var(--secondary)', marginBottom: 0 }}>Activity Log Calendar</h3>
          <div className="search-container" style={{ width: '220px' }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ left: '10px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ padding: '8px 12px 8px 30px', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="cal-grid">
        {/* Calendar Card */}
        <div className="cal-box glass">
          <div className="cal-month-nav">
            <button className="cal-nav-btn" onClick={() => navigateMonth('prev')}>
              &larr;
            </button>
            <h2 className="cal-month-title">
              {monthNames[month]} {year}
            </h2>
            <button className="cal-nav-btn" onClick={() => navigateMonth('next')}>
              &rarr;
            </button>
          </div>

          <div className="cal-weekdays">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="cal-days">
            {dayCells.map((cell, index) => {
              const hasActivity = getDayActivity(cell.dayNum, cell.isCurrentMonth);
              const today = new Date();
              const isToday = cell.isCurrentMonth && 
                              cell.dayNum === today.getDate() && 
                              month === today.getMonth() && 
                              year === today.getFullYear();
              
              const isCellSelected = cell.isCurrentMonth && 
                                     selectedDate.getDate() === cell.dayNum && 
                                     selectedDate.getMonth() === month && 
                                     selectedDate.getFullYear() === year;

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(cell.dayNum, cell.isCurrentMonth)}
                  className={`cal-day-cell 
                    ${!cell.isCurrentMonth ? 'outside' : ''} 
                    ${isToday ? 'today' : ''} 
                    ${isCellSelected ? 'selected' : ''}
                    ${hasActivity ? 'has-activity' : ''}
                  `}
                >
                  {cell.dayNum}
                  {hasActivity && <span className="cal-has-activity"></span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Details / Admin Form Panel */}
        <div className="activity-panel">
          {/* Selected Date Activity details */}
          <div className="activity-card glass">
            <div className="activity-header">
              <div>
                <span className="activity-date">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                {selectedActivity && (
                  <div style={{ marginTop: '8px' }}>
                    <span className={`activity-status status-${selectedActivity.status}`}>
                      {selectedActivity.status.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedActivity ? (
              <div>
                <h3 className="activity-title" style={{ marginBottom: '14px' }}>
                  {selectedActivity.title}
                </h3>
                <p className="activity-desc">
                  {selectedActivity.description}
                </p>
                  <div className="activity-actions">
                    <button className="delete-btn" onClick={handleDelete}>
                      Delete
                    </button>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      Modify
                    </button>
                  </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No activities logged for this day.
                </p>
                  <button 
                    className="gradient-solid-btn" 
                    onClick={() => {
                      setIsEditing(true);
                      setFormActivityId(null);
                      setFormTitle('');
                      setFormDesc('');
                      setFormStatus('completed');
                    }}
                    style={{ marginTop: '20px', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Add Activity
                  </button>
              </div>
            )}
          </div>

          {/* Editor Form */}
          {isEditing && (
            <div className="form-box glass" style={{ border: '1px solid rgba(8, 145, 178, 0.2)' }}>
              <h3 className="form-title gradient-text">
                {formActivityId ? 'Modify Calendar Entry' : 'Create New Activity Entry'}
              </h3>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Activity Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="E.g., Finished IoT Assistance lab exercise"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Activity Description</label>
                  <textarea
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide details about tasks completed, problems solved, or technologies analyzed..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="planned">Planned / Scheduled</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setIsEditing(false)}
                  >
                    Close Editor
                  </button>
                  <button type="submit" className="gradient-solid-btn">
                    Save to Database
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Results listing (visible when search query is typed) */}
          {searchQuery.trim() !== '' && (
            <div className="activity-card glass">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--secondary)' }}>
                Search Results ({filteredActivities.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((act) => (
                    <div 
                      key={act.id} 
                      onClick={() => {
                        const [y, m, d] = act.date.split('-');
                        const actDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                        setSelectedDate(actDate);
                        setCurrentDate(actDate);
                        setFormActivityId(act.id);
                        setFormTitle(act.title);
                        setFormDesc(act.description);
                        setFormStatus(act.status);
                        setIsEditing(true);
                      }}
                      style={{ 
                        padding: '12px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.06)', 
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.date}</span>
                        <span className={`activity-status status-${act.status}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                          {act.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>{act.title}</h4>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    No matching activity records found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
