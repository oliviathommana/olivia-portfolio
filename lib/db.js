import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

// ─── File-based permanent store (local development & deployments without Postgres) ───
// Reads and writes to calendar_db.json at the project root.
// This means data persists across server restarts without any external database.
const DB_FILE = path.join(process.cwd(), 'calendar_db.json');

function readFileDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFileDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Helper: is Vercel Postgres configured? ───────────────────────────────────
function isVercelDb() {
  return !!process.env.POSTGRES_URL;
}

// ─── Initialize Database (Postgres only) ─────────────────────────────────────
export async function initDb() {
  if (!isVercelDb()) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS calendar_activities (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL,
        time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Seed from file if Postgres table is empty
    const { rows } = await sql`SELECT COUNT(*) FROM calendar_activities;`;
    if (parseInt(rows[0].count) === 0) {
      const seed = readFileDb();
      for (const act of seed) {
        await sql`
          INSERT INTO calendar_activities (id, date, title, description, status, time)
          VALUES (${act.id}, ${act.date}, ${act.title}, ${act.description}, ${act.status}, ${act.time || ''})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  } catch (error) {
    console.error('Failed to initialize Vercel Database:', error);
  }
}

// ─── Fetch all activities ─────────────────────────────────────────────────────
export async function getActivities() {
  if (isVercelDb()) {
    try {
      await initDb();
      const { rows } = await sql`
        SELECT id, date, title, description, status, time
        FROM calendar_activities
        ORDER BY date DESC;
      `;
      return rows;
    } catch (error) {
      console.error('Postgres fetch failed, falling back to file store:', error);
    }
  }

  // File-based permanent store (default for local / no Postgres)
  const activities = readFileDb();
  return [...activities].sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Save or update an activity ───────────────────────────────────────────────
export async function saveActivity(activity) {
  const { id, date, title, description, status, time = '' } = activity;

  if (isVercelDb()) {
    try {
      await initDb();
      const { rows } = await sql`SELECT id FROM calendar_activities WHERE id = ${id};`;
      if (rows.length > 0) {
        await sql`
          UPDATE calendar_activities
          SET date = ${date}, title = ${title}, description = ${description}, status = ${status}, time = ${time}
          WHERE id = ${id};
        `;
      } else {
        await sql`
          INSERT INTO calendar_activities (id, date, title, description, status, time)
          VALUES (${id}, ${date}, ${title}, ${description}, ${status}, ${time});
        `;
      }
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('Postgres write failed, falling back to file store:', error);
    }
  }

  // File-based permanent store
  const activities = readFileDb();
  const existingIndex = activities.findIndex((a) => a.id === id);
  if (existingIndex > -1) {
    activities[existingIndex] = { id, date, title, description, status, time };
  } else {
    activities.push({ id, date, title, description, status, time });
  }
  writeFileDb(activities);
  return { success: true, database: 'file' };
}

// ─── Delete an activity ───────────────────────────────────────────────────────
export async function deleteActivity(id) {
  if (isVercelDb()) {
    try {
      await initDb();
      await sql`DELETE FROM calendar_activities WHERE id = ${id};`;
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('Postgres delete failed, falling back to file store:', error);
    }
  }

  // File-based permanent store
  const activities = readFileDb();
  const index = activities.findIndex((a) => a.id === id);
  if (index > -1) activities.splice(index, 1);
  writeFileDb(activities);
  return { success: true, database: 'file' };
}
