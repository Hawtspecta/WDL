import { NextResponse } from 'next/server';
import { getLogs, addLog, updateLog, deleteLog } from '@/app/lib/db';

export async function GET() {
  const logs = getLogs();
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLog = addLog({
      location: body.location,
      depth: body.depth,
      duration: body.duration,
      date: body.date,
    });
    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedFields } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const updatedLog = updateLog(id, updatedFields);
    if (!updatedLog) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedLog);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const success = deleteLog(id);
    if (!success) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
