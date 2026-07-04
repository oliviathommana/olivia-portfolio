'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Silk from '@/components/Silk';
import './Home.css';

/* ──────────────────────────────────────────────────────────────
   Typing animation hook
────────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────────
   Data
────────────────────────────────────────────────────────────── */
const contactInfo = {
  email: 'oliviathommana@gmail.com',
  phone: '+91 9895467609',
  location: 'Thrissur, Kerala, India',
  linkedin: 'https://linkedin.com/in/olivia-thommana',
  github: 'https://github.com/oliviathommana',
};

const projects = [
  {
    id: 'parq',
    title: 'PARQ – Smart Parking System',
    category: 'computer-vision',
    desc: 'Real-time, camera-based parking occupancy detection system. Multi-stage CV pipeline on Raspberry Pi 4B with MJPEG stream, adaptive thresholding, and EMA smoothing at 15 fps.',
    tech: ['Python', 'OpenCV 4.8', 'NumPy', 'Raspberry Pi 4B', 'HTTP Server'],
  },
  {
    id: 'egg',
    title: 'Automated Egg Incubator',
    category: 'iot',
    desc: 'Microcontroller-driven incubator with precise temperature/humidity control across a 21-day cycle. Submitted to Kerala\'s Young Innovators Programme (YIP).',
    tech: ['Embedded C', 'Arduino Uno', 'DHT22', 'Relays', 'Hysteresis Controller'],
  },
  {
    id: 'holo',
    title: 'Holographic Display System',
    category: 'hardware',
    desc: '3D holographic visualization combining Blender asset creation and a Python OpenCV compositing pipeline with a precision acrylic four-sided pyramid reflector.',
    tech: ['Python', 'OpenCV 4', 'Blender 3.6', 'NumPy', 'FFmpeg'],
  },
  {
    id: 'credifai',
    title: 'CredifAI – Fake News Detector',
    category: 'software',
    desc: 'NLP-powered misinformation detection for real-time article analysis. Presented at a national hackathon among 200+ teams at VIT Chennai.',
    tech: ['React', 'Node.js', 'Machine Learning', 'NLP', 'Tailwind CSS'],
  },
  {
    id: 'trash2cash',
    title: 'Trash2Cash – AI Waste Manager',
    category: 'software',
    desc: 'AI waste classification web app enabling users to identify waste categories and earn recycling incentives, modeled on Singapore\'s urban waste model.',
    tech: ['React', 'MongoDB', 'Node.js', 'AI Classification'],
  },
  {
    id: 'careflow',
    title: 'CareFlow – AI Caregiver',
    category: 'software',
    desc: 'AI-driven caregiver workload optimization engine for elderly care, automating intelligent task scheduling based on real-time patient needs via Groq API.',
    tech: ['React', 'FastAPI', 'Groq API', 'AI Scheduling'],
  },
];

const skills = [
  { category: 'Programming', tags: ['Python', 'C', 'Java', 'Embedded C'] },
  { category: 'Web Technologies', tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'FastAPI'] },
  { category: 'ML & Data Science', tags: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
  { category: 'Databases & Tools', tags: ['MySQL', 'MongoDB', 'Git', 'Vercel Postgres', 'OpenCV', 'Blender'] },
];

const education = [
  {
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'Christ College of Engineering (Autonomous), Irinjalakuda',
    affiliation: 'APJ Abdul Kalam Technological University',
    duration: '2023 – 2027 (Pursuing)',
    result: 'CGPA: 7.88 / 10',
  },
  {
    degree: 'Higher Secondary (Computer Science)',
    institution: 'Don Bosco HSS, Irinjalakuda',
    affiliation: 'Kerala Higher Secondary Board',
    duration: '2022 – 2023',
    result: '98% in Computer Science',
  },
  {
    degree: 'SSLC',
    institution: 'Christ Vidyanikethan, Irinjalakuda',
    affiliation: 'Kerala SSLC Board',
    duration: '2020 – 2021',
    result: '94%',
  },
];

const certifications = [
  { title: 'Computer Architecture', issuer: 'NPTEL (IIT/IISc)', year: '2024' },
  { title: 'Foundations: Data, Data Everywhere', issuer: 'Coursera (Google)', year: '2024' },
  { title: 'Design Digital Collateral via Canva', issuer: 'Coursera', year: '2024' },
];

/* ──────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────── */
export default function Home() {
  const [projectFilter, setProjectFilter] = useState('all');
  const filteredProjects =
    projectFilter === 'all' ? projects : projects.filter((p) => p.category === projectFilter);

  return (
    <div className="homepage-root">

      {/* ══════════════════════════════════════════════
          HERO SECTION — Colorlib Personal Style
      ══════════════════════════════════════════════ */}
      <section className="hero-section" id="home">
        <div className="container hero-container">

          {/* LEFT PANEL */}
          <div className="hero-left">
            <div className="hero-left-content">
              <span className="hero-label">THIS IS ME</span>

              <h1 className="hero-name">
                <span className="name-first">Olivia</span>{' '}
                <span className="name-last">Thommana</span>
              </h1>

              <p className="hero-bio">
                A passionate Computer Science &amp; Engineering student at Christ College of
                Engineering, Irinjalakuda. I build intelligent ML pipelines, embedded IoT
                systems, and responsive web applications. CGPA: <strong>7.88 / 10</strong>.
              </p>

              {/* Social Icons */}
              <div className="hero-socials">
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="social-icon" aria-label="Email">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
                <a href={`tel:${contactInfo.phone}`} className="social-icon" aria-label="Phone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12.61a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="hero-actions">
                <a href="/Olivia_Thommana_CV.pdf" download className="btn-download">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download CV
                </a>
                <a href="#projects" className="btn-outline">View Projects</a>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Photo with decorative offset border frame */}
          <div className="hero-right">
            <div className="hero-photo-frame">
              {/* Decorative scattered dots */}
              <div className="hero-dots" aria-hidden="true">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
                <span className="dot dot-5"></span>
                <span className="dot dot-6"></span>
                <span className="dot dot-7"></span>
              </div>
              {/* Blue border-only decorative offset square */}
              <div className="hero-deco-square"></div>
              <Image
                src="/profile.jpeg"
                alt="Olivia Thommana"
                fill
                sizes="(max-width: 960px) 280px, 340px"
                style={{ objectFit: 'contain', objectPosition: 'center top' }}
                className="hero-photo"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT SECTION
      ══════════════════════════════════════════════ */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">About Me</span>
            <h2 className="section-title">Professional Profile</h2>
          </div>
          <div className="about-grid">
            <div className="about-card glass">
              <p className="about-text">
                I am a motivated and detail-oriented Computer Science and Engineering student at
                Christ College of Engineering, Irinjalakuda, with a strong track record of
                converting academic knowledge into working, real-world systems.
              </p>
              <p className="about-text" style={{ marginTop: '16px' }}>
                Proficient in Python, Java, Embedded C, and modern web technologies. Experienced
                in designing and deploying machine learning pipelines, computer vision systems,
                embedded hardware solutions, and database-backed applications. Actively engaged in
                national hackathons, IEEE activities, and open-source communities.
              </p>
              <div className="about-contact-list">
                <div className="about-contact-item">
                  <span className="about-contact-label">Email</span>
                  <a href={`mailto:${contactInfo.email}`} className="about-contact-val">{contactInfo.email}</a>
                </div>
                <div className="about-contact-item">
                  <span className="about-contact-label">Phone</span>
                  <span className="about-contact-val">{contactInfo.phone}</span>
                </div>
                <div className="about-contact-item">
                  <span className="about-contact-label">Location</span>
                  <span className="about-contact-val">{contactInfo.location}</span>
                </div>
                <div className="about-contact-item">
                  <span className="about-contact-label">LinkedIn</span>
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="about-contact-val">linkedin.com/in/olivia-thommana</a>
                </div>
              </div>
            </div>
            <div className="about-stats-col">
              <div className="stat-card glass">
                <span className="stat-num">7.88</span>
                <span className="stat-label">B.Tech CGPA</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-num">6+</span>
                <span className="stat-label">Major Projects</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-num">3+</span>
                <span className="stat-label">National Hackathons</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-num">2</span>
                <span className="stat-label">Industry Internships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SKILLS SECTION
      ══════════════════════════════════════════════ */}
      <section id="skills" className="section-padding skills-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Capabilities</span>
            <h2 className="section-title">Technical Expertise</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-category glass">
                <h3 className="skill-cat-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  {skill.category}
                </h3>
                <div className="skill-tags">
                  {skill.tags.map((tag, sIdx) => (
                    <span key={sIdx} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EXPERIENCE / INTERNSHIPS
      ══════════════════════════════════════════════ */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Experience</span>
          <h2 className="section-title">Industry Experience</h2>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-dot"></span>
            <div className="timeline-header">
              <div>
                <h3 className="timeline-title">IoT Assistance Intern (PM-VIKAS Programme)</h3>
                <span className="timeline-subtitle">Indian Institute of Information Technology (IIIT), Kottayam · Skill India Initiative</span>
              </div>
              <span className="timeline-date">June 2024 – July 2024</span>
            </div>
            <div className="timeline-body">
              <p>Completed a comprehensive technical training and systems research internship under the Skill India PM-VIKAS scheme, focusing on edge computing, sensor nodes, and telemetry dashboards.</p>
              <ul className="timeline-bullets">
                <li>Designed and interfaced microcontrollers (ESP32, Arduino, NodeMCU) with soil, ultrasonic, PIR, and climate sensors.</li>
                <li>Configured MQTT and HTTP REST communication protocols for real-time telemetry syncing to ThingSpeak and Adafruit IO.</li>
                <li>Built functional prototypes: Smart Agricultural Irrigation Hub and Intelligent Room Climate Controller.</li>
              </ul>
              <Link href="/pm-vikas" className="timeline-link">View PM-VIKAS Details →</Link>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-dot"></span>
            <div className="timeline-header">
              <div>
                <h3 className="timeline-title">Machine Learning Intern</h3>
                <span className="timeline-subtitle">RISS Technologies, Thrissur · Industry Training Program</span>
              </div>
              <span className="timeline-date">June 2024 (1 Week)</span>
            </div>
            <div className="timeline-body">
              <p>Intensive structured ML internship covering the full end-to-end supervised and unsupervised learning workflow on real-world datasets.</p>
              <ul className="timeline-bullets">
                <li>Designed complete ML pipeline: data ingestion, null-value treatment, scaling, feature selection, cross-validation, and test evaluation.</li>
                <li>Implemented and benchmarked Linear Regression, Logistic Regression, Decision Trees, and KNN algorithms.</li>
                <li>Applied K-Means Clustering with elbow plot analysis and PCA-reduced 2D scatter plot visualizations.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROJECTS SECTION
      ══════════════════════════════════════════════ */}
      <section id="projects" className="section-padding projects-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Showcase</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>
          {/* Filter Buttons */}
          <div className="projects-filter">
            {['all', 'software', 'computer-vision', 'iot', 'hardware'].map((f) => (
              <button
                key={f}
                onClick={() => setProjectFilter(f)}
                className={`filter-btn ${projectFilter === f ? 'active' : ''}`}
              >
                {f === 'all' ? 'All Projects' : f === 'computer-vision' ? 'Computer Vision' : f === 'iot' ? 'IoT & Embedded' : f === 'hardware' ? 'Hardware' : 'Software & AI'}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card glass">
                <div className="project-card-top">
                  <span className="project-cat-badge">{project.category.replace('-', ' ')}</span>
                  <h3 className="project-title">{project.title}</h3>
                </div>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EDUCATION & CERTIFICATIONS
      ══════════════════════════════════════════════ */}
      <section id="education" className="section-padding container">
        <div className="edu-certs-grid">
          <div>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <span className="section-subtitle">Academic</span>
              <h2 className="section-title">Education</h2>
            </div>
            <div className="timeline" style={{ paddingLeft: '28px' }}>
              {education.map((edu, idx) => (
                <div key={idx} className="timeline-item" style={{ marginBottom: '28px' }}>
                  <span className="timeline-dot" style={{ left: '-37px', width: '14px', height: '14px' }}></span>
                  <div className="timeline-header" style={{ marginBottom: '6px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem' }}>{edu.degree}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--fg-muted)', marginTop: '2px' }}>{edu.institution}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)' }}>{edu.affiliation}</p>
                    </div>
                    <span className="timeline-date">{edu.duration}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--primary-light)', fontWeight: 600 }}>{edu.result}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <span className="section-subtitle">Credentials</span>
              <h2 className="section-title">Certifications</h2>
            </div>
            <div className="certs-list">
              {certifications.map((cert, idx) => (
                <div key={idx} className="cert-card glass">
                  <div className="cert-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div className="cert-details">
                    <h4 className="cert-title">{cert.title}</h4>
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-year">{cert.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════ */}
      <section id="contact" className="section-padding contact-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Get In Touch</span>
            <h2 className="section-title">Contact Me</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card glass">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p className="contact-card-label">Email</p>
                <a href={`mailto:${contactInfo.email}`} className="contact-card-val">{contactInfo.email}</a>
              </div>
            </div>
            <div className="contact-card glass">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12.61a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p className="contact-card-label">Phone</p>
                <a href={`tel:${contactInfo.phone}`} className="contact-card-val">{contactInfo.phone}</a>
              </div>
            </div>
            <div className="contact-card glass">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="contact-card-label">Location</p>
                <span className="contact-card-val">{contactInfo.location}</span>
              </div>
            </div>
            <div className="contact-card glass">
              <div className="contact-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
              <div>
                <p className="contact-card-label">LinkedIn</p>
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-val">olivia-thommana</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="container">
          <p className="footer-copy">© 2026 Olivia Thommana. All Rights Reserved.</p>
          <div className="footer-links">
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link href="/pm-vikas">PM-VIKAS</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
