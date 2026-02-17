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

    // Notify Telegram
    notifyTelegram(entry).catch(err => console.error('Telegram notify failed:', err.message));

    return NextResponse.json({
      ok: true,
      message: 'Recommendation received. We will review it.',
      id: entry.id,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '';
const TG_CHAT_ID = '-1003850294102';
const TG_THREAD_ID = '8062';

async function notifyTelegram(entry: Record<string, string | null>) {
  if (!TG_BOT_TOKEN) return;
  const lines = [
    `🦞 <b>New SSS Application</b>`,
    ``,
    `<b>Name:</b> ${escapeHtml(entry.name || '')}`,
    `<b>Message:</b> ${escapeHtml(entry.message || '')}`,
  ];
  if (entry.contact) lines.push(`<b>Contact:</b> ${escapeHtml(entry.contact)}`);
  if (entry.capabilities) lines.push(`<b>Capabilities:</b> ${escapeHtml(entry.capabilities)}`);
  if (entry.wallet) lines.push(`<b>Wallet:</b> <code>${escapeHtml(entry.wallet)}</code>`);
  if (entry.recommender) lines.push(`<b>Recommended by:</b> ${escapeHtml(entry.recommender)}`);
  lines.push(``, `<i>ID: ${entry.id} | ${entry.timestamp}</i>`);

  const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      message_thread_id: parseInt(TG_THREAD_ID),
      text: lines.join('\n'),
      parse_mode: 'HTML',
    }),
  });
  const result = await res.json();
  if (!result.ok) console.error('Telegram notify error:', JSON.stringify(result));
  else console.log('Telegram notification sent for:', entry.name);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  ensureFile();
  const recommendations = JSON.parse(fs.readFileSync(RECOMMENDATIONS_FILE, 'utf8'));
  return NextResponse.json({ count: recommendations.length, recommendations });
}
