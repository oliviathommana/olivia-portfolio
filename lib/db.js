import { sql } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'calendar_db.json');

// Initial seed data based on Olivia's real activities/resume
const seedActivities = [
  {
    id: '1',
    date: '2026-06-25',
    title: 'Portfolio Development',
    description: 'Designed and built personal web portfolio with interactive WebGL radar graphics and admin controls.',
    status: 'completed'
  },
  {
    id: '2',
    date: '2026-06-24',
    title: 'Google Cloud Agentic AI Day',
    description: 'Submitted conceptual proposal for LLM orchestration using Google Cloud infrastructure.',
    status: 'completed'
  },
  {
    id: '3',
    date: '2026-06-23',
    title: 'Egg Incubator Circuit Design',
    description: 'Wired full control circuit on stripboard with Arduino Uno, DHT22 sensor, and dual relay module.',
    status: 'completed'
  },
  {
    id: '4',
    date: '2026-06-20',
    title: 'IEEE Brain Battle Round 2',
    description: 'Competed in logical reasoning, technical MCQs, and live coding puzzles in IEEE community event.',
    status: 'completed'
  },

  {
    id: '8',
    date: '2026-07-04',
    title: 'Portfolio Optimization & Theme Adjustment',
    description: 'make profile image fit correct in box in first page.change theme to white for entire portfolio as in second image.remove calendar section in third page.add these to calendar in pm vikas',
    status: 'completed'
  }
];

// Helper to check if Vercel Postgres is configured
function isVercelDb() {
  return !!process.env.POSTGRES_URL;
}

// Initialize Database: Creates table for Postgres, or seeds JSON for local
export async function initDb() {
  if (isVercelDb()) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS calendar_activities (
          id VARCHAR(50) PRIMARY KEY,
          date VARCHAR(10) NOT NULL,
          title VARCHAR(150) NOT NULL,
          description TEXT NOT NULL,
          status VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // Seed if empty
      const { rows } = await sql`SELECT COUNT(*) FROM calendar_activities;`;
      if (parseInt(rows[0].count) === 0) {
        for (const act of seedActivities) {
          await sql`
            INSERT INTO calendar_activities (id, date, title, description, status)
            VALUES (${act.id}, ${act.date}, ${act.title}, ${act.description}, ${act.status});
          `;
        }
      }
    } catch (error) {
      console.error('Failed to initialize Vercel Database, using local fallback:', error);
    }
  } else {
    // Local JSON implementation
    try {
      await fs.access(DB_FILE);
    } catch {
      // Create and seed JSON file
      await fs.writeFile(DB_FILE, JSON.stringify(seedActivities, null, 2), 'utf-8');
    }
  }
}

// Fetch all activities
export async function getActivities() {
  await initDb();
  if (isVercelDb()) {
    try {
      const { rows } = await sql`
        SELECT id, date, title, description, status 
        FROM calendar_activities 
        ORDER BY date DESC;
      `;
      return rows;
    } catch (error) {
      console.error('Postgres fetch failed, falling back to local:', error);
    }
  }

  // Fallback / Local fetch
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const activities = JSON.parse(data);
    return activities.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Failed to read local DB:', error);
    return [];
  }
}

// Save or update an activity
export async function saveActivity(activity) {
  await initDb();
  const { id, date, title, description, status } = activity;

  if (isVercelDb()) {
    try {
      // Check if it exists to do upsert
      const { rows } = await sql`
        SELECT id FROM calendar_activities WHERE id = ${id};
      `;
      if (rows.length > 0) {
        await sql`
          UPDATE calendar_activities
          SET date = ${date}, title = ${title}, description = ${description}, status = ${status}
          WHERE id = ${id};
        `;
      } else {
        await sql`
          INSERT INTO calendar_activities (id, date, title, description, status)
          VALUES (${id}, ${date}, ${title}, ${description}, ${status});
        `;
      }
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('Postgres write failed, trying local backup:', error);
    }
  }

  // Local JSON write
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const activities = JSON.parse(data);
    const existingIndex = activities.findIndex((a) => a.id === id);

    if (existingIndex > -1) {
      activities[existingIndex] = { id, date, title, description, status };
    } else {
      activities.push({ id, date, title, description, status });
    }

    await fs.writeFile(DB_FILE, JSON.stringify(activities, null, 2), 'utf-8');
    return { success: true, database: 'local-json' };
  } catch (error) {
    console.error('Failed to save to local DB:', error);
    throw error;
  }
}

// Delete an activity
export async function deleteActivity(id) {
  await initDb();

  if (isVercelDb()) {
    try {
      await sql`
        DELETE FROM calendar_activities WHERE id = ${id};
      `;
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('Postgres delete failed, trying local:', error);
    }
  }

  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    let activities = JSON.parse(data);
    activities = activities.filter((a) => a.id !== id);
    await fs.writeFile(DB_FILE, JSON.stringify(activities, null, 2), 'utf-8');
    return { success: true, database: 'local-json' };
  } catch (error) {
    console.error('Failed to delete from local DB:', error);
    throw error;
  }
}
