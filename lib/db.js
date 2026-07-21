import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

// ─── File-based store path ────────────────────────────────────────────────────
// READ-ONLY on Vercel serverless — only used for local dev writes & seeding.
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

// ─── Initialize & seed Postgres table ────────────────────────────────────────
// Always upserts the bundled calendar_db.json so new entries added to the file
// are reflected in Postgres on the next cold start / sync call.
export async function initDb() {
  if (!isVercelDb()) return;

  // Create table if it doesn't exist yet
  await sql`
    CREATE TABLE IF NOT EXISTS calendar_activities (
      id          VARCHAR(50)  PRIMARY KEY,
      date        VARCHAR(10)  NOT NULL,
      title       VARCHAR(255) NOT NULL,
      description TEXT         NOT NULL,
      status      VARCHAR(20)  NOT NULL,
      time        VARCHAR(50),
      created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Upsert every entry from the bundled JSON so Postgres always has the latest
  const seed = readFileDb();
  for (const act of seed) {
    await sql`
      INSERT INTO calendar_activities (id, date, title, description, status, time)
      VALUES (
        ${String(act.id)},
        ${act.date},
        ${act.title},
        ${act.description},
        ${act.status},
        ${act.time || ''}
      )
      ON CONFLICT (id) DO UPDATE
        SET date        = EXCLUDED.date,
            title       = EXCLUDED.title,
            description = EXCLUDED.description,
            status      = EXCLUDED.status,
            time        = EXCLUDED.time;
    `;
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
        ORDER BY date ASC;
      `;
      return rows;
    } catch (error) {
      console.error('[db] Postgres fetch failed, falling back to file store:', error.message);
      // For reads, fall back to the bundled file (safe — read-only access works on Vercel)
    }
  }

  const activities = readFileDb();
  return [...activities].sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Save or update an activity ───────────────────────────────────────────────
export async function saveActivity(activity) {
  const { id, date, title, description, status, time = '' } = activity;

  if (isVercelDb()) {
    // On Vercel: Postgres is the ONLY persistent write store.
    // Do NOT fall back to file write — Vercel FS is read-only in serverless.
    try {
      await initDb(); // ensures table exists & base entries are seeded
      const { rows } = await sql`SELECT id FROM calendar_activities WHERE id = ${id};`;
      if (rows.length > 0) {
        await sql`
          UPDATE calendar_activities
          SET date = ${date}, title = ${title}, description = ${description},
              status = ${status}, time = ${time}
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
      console.error('[db] Postgres write failed:', error.message);
      // Re-throw with a clear message so the API can surface it to the client
      throw new Error(`Postgres write failed: ${error.message}`);
    }
  }

  // ── Local development: file-based store ──────────────────────────────────
  try {
    const activities = readFileDb();
    const existingIndex = activities.findIndex((a) => a.id === id);
    if (existingIndex > -1) {
      activities[existingIndex] = { id, date, title, description, status, time };
    } else {
      activities.push({ id, date, title, description, status, time });
    }
    writeFileDb(activities);
    return { success: true, database: 'file' };
  } catch (fileError) {
    console.error('[db] File write failed:', fileError.message);
    throw new Error(`File store write failed: ${fileError.message}`);
  }
}

// ─── Delete an activity ───────────────────────────────────────────────────────
export async function deleteActivity(id) {
  if (isVercelDb()) {
    try {
      await initDb();
      await sql`DELETE FROM calendar_activities WHERE id = ${id};`;
      return { success: true, database: 'vercel-postgres' };
    } catch (error) {
      console.error('[db] Postgres delete failed:', error.message);
      throw new Error(`Postgres delete failed: ${error.message}`);
    }
  }

  // Local file-based store
  try {
    const activities = readFileDb();
    const index = activities.findIndex((a) => a.id === id);
    if (index > -1) activities.splice(index, 1);
    writeFileDb(activities);
    return { success: true, database: 'file' };
  } catch (fileError) {
    console.error('[db] File delete failed:', fileError.message);
    throw new Error(`File store delete failed: ${fileError.message}`);
  }
}
