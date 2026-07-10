import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function readFileDb() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'calendar_db.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({ message: 'No Vercel Postgres configured — using file store only.' }, { status: 200 });
  }

  try {
    // Ensure table exists
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

    const entries = readFileDb();
    let upserted = 0;

    for (const act of entries) {
      await sql`
        INSERT INTO calendar_activities (id, date, title, description, status, time)
        VALUES (${act.id}, ${act.date}, ${act.title}, ${act.description}, ${act.status}, ${act.time || ''})
        ON CONFLICT (id) DO UPDATE
          SET date        = EXCLUDED.date,
              title       = EXCLUDED.title,
              description = EXCLUDED.description,
              status      = EXCLUDED.status,
              time        = EXCLUDED.time;
      `;
      upserted++;
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${upserted} entries to Vercel Postgres.`,
      upserted,
    }, { status: 200 });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed', detail: error.message }, { status: 500 });
  }
}
