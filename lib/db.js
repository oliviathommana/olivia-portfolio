import { sql } from '@vercel/postgres';

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

// --------------------------------------------------------------------------
// In-memory store — used when POSTGRES_URL is not configured.
// NOTE: On Vercel serverless, each function invocation may get a fresh
// instance, so data only persists within the same warm instance.
// For persistent storage, add a POSTGRES_URL environment variable in your
// Vercel project settings and connect a Vercel Postgres database.
// --------------------------------------------------------------------------
let memoryDb = null;

function getMemoryDb() {
  if (!memoryDb) {
    // Deep-clone the seed so mutations don't affect the original array
    memoryDb = seedActivities.map((a) => ({ ...a }));
  }
  return memoryDb;
}

// Helper to check if Vercel Postgres is configured
function isVercelDb() {
  return !!process.env.POSTGRES_URL;
}

// Initialize Database: Creates table for Postgres if needed
export async function initDb() {
  if (!isVercelDb()) return; // nothing to initialise for the memory store

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
    console.error('Failed to initialize Vercel Database:', error);
  }
}

// Fetch all activities
export async function getActivities() {
  if (isVercelDb()) {
    try {
      await initDb();
      const { rows } = await sql`
        SELECT id, date, title, description, status 
        FROM calendar_activities 
        ORDER BY date DESC;
      `;
      return rows;
    } catch (error) {
      console.error('Postgres fetch failed:', error);
      // Fall through to memory store
    }
  }

  // In-memory fallback
  const activities = getMemoryDb();
  return [...activities].sort((a, b) => b.date.localeCompare(a.date));
}

// Save or update an activity
export async function saveActivity(activity) {
  const { id, date, title, description, status } = activity;

  if (isVercelDb()) {
    try {
      await initDb();
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
      console.error('Postgres write failed:', error);
      // Fall through to memory store
    }
  }

  // In-memory fallback
  const activities = getMemoryDb();
  const existingIndex = activities.findIndex((a) => a.id === id);
  if (existingIndex > -1) {
    activities[existingIndex] = { id, date, title, description, status };
  } else {
    activities.push({ id, date, title, description, status });
  }
  return { success: true, database: 'in-memory' };
}

// Delete an activity
export async function deleteActivity(id) {
  if (isVercelDb()) {
    try {
      await initDb();
      await sql`
        DELETE FROM calendar_activities WHERE id = ${id};
      `;
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('Postgres delete failed:', error);
      // Fall through to memory store
    }
  }

  // In-memory fallback
  const activities = getMemoryDb();
  const index = activities.findIndex((a) => a.id === id);
  if (index > -1) activities.splice(index, 1);
  return { success: true, database: 'in-memory' };
}
