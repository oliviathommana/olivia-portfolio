import { NextResponse } from 'next/server';
import { getActivities, saveActivity, deleteActivity } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activities = await getActivities();
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error('API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities', detail: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, date, title, description, status, time } = body;

    // Public editing enabled per request

    if (!date || !title || !description || !status) {
      return NextResponse.json({ error: 'Missing required fields: date, title, description and status are required.' }, { status: 400 });
    }

    const activityId = id || Math.random().toString(36).substr(2, 9);
    const result = await saveActivity({
      id: activityId,
      date,
      title,
      description,
      status,
      time: time || ''
    });

    return NextResponse.json({
      success: true,
      message: 'Activity saved successfully',
      id: activityId,
      database: result.database
    }, { status: 200 });

  } catch (error) {
    console.error('API POST error:', error);
    return NextResponse.json({
      error: 'Failed to save activity',
      detail: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing activity ID' }, { status: 400 });
    }

    const result = await deleteActivity(id);
    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully',
      database: result.database
    }, { status: 200 });

  } catch (error) {
    console.error('API DELETE error:', error);
    return NextResponse.json({
      error: 'Failed to delete activity',
      detail: error.message
    }, { status: 500 });
  }
}
