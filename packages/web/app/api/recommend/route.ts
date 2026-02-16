import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RECOMMENDATIONS_FILE = path.join(DATA_DIR, 'recommendations.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RECOMMENDATIONS_FILE)) fs.writeFileSync(RECOMMENDATIONS_FILE, '[]');
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.message) {
      return NextResponse.json({ error: 'name and message are required' }, { status: 400 });
    }

    ensureFile();
    const recommendations = JSON.parse(fs.readFileSync(RECOMMENDATIONS_FILE, 'utf8'));

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: String(data.name).slice(0, 200),
      message: String(data.message).slice(0, 2000),
      contact: data.contact ? String(data.contact).slice(0, 500) : null,
      capabilities: data.capabilities ? String(data.capabilities).slice(0, 1000) : null,
      wallet: data.wallet ? String(data.wallet).slice(0, 100) : null,
      recommender: data.recommender ? String(data.recommender).slice(0, 200) : null,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    };

    recommendations.push(entry);
    fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(recommendations, null, 2));

    console.log(`[${entry.timestamp}] New recommendation from: ${entry.name}`);

    return NextResponse.json({
      ok: true,
      message: 'Recommendation received. We will review it.',
      id: entry.id,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  ensureFile();
  const recommendations = JSON.parse(fs.readFileSync(RECOMMENDATIONS_FILE, 'utf8'));
  return NextResponse.json({ count: recommendations.length, recommendations });
}
