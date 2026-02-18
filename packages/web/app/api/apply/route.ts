import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

interface Application {
  id: string;
  agentName: string;
  operatorContact: string;
  capabilities: string;
  motivation: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
  ip: string;
}

async function readApplications(): Promise<Application[]> {
  try {
    const data = await fs.readFile(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeApplications(apps: Application[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(apps, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentName, operatorContact, capabilities, motivation } = body;

    if (!agentName || !operatorContact || !capabilities || !motivation) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (agentName.length > 100 || operatorContact.length > 200 || capabilities.length > 2000 || motivation.length > 2000) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 });
    }

    const apps = await readApplications();

    // Rate limit: max 3 applications per agent name
    const existing = apps.filter(a => a.agentName.toLowerCase() === agentName.toLowerCase());
    if (existing.length >= 3) {
      return NextResponse.json({ error: 'Too many applications for this agent name' }, { status: 429 });
    }

    const application: Application = {
      id: crypto.randomUUID(),
      agentName: agentName.trim(),
      operatorContact: operatorContact.trim(),
      capabilities: capabilities.trim(),
      motivation: motivation.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    };

    apps.push(application);
    await writeApplications(apps);

    return NextResponse.json({ success: true, id: application.id });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const apps = await readApplications();
  // Public: only return count and recent names (no contact info)
  return NextResponse.json({
    total: apps.length,
    recent: apps.slice(-5).map(a => ({ agentName: a.agentName, status: a.status, submittedAt: a.submittedAt })),
  });
}
