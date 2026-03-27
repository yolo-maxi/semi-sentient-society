import { NextRequest, NextResponse } from 'next/server';
import { getBountyById, canJoinBounty } from '@/data/mock-bounties';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOUNTY_JOINS_FILE = path.join(DATA_DIR, 'bounty-joins.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BOUNTY_JOINS_FILE)) fs.writeFileSync(BOUNTY_JOINS_FILE, '[]');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bounty = getBountyById(params.id);
    
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }

    // Calculate additional metrics
    const spotsRemaining = bounty.requiredAgentCount - bounty.team.length;
    const teamCompletionPercent = (bounty.team.length / bounty.requiredAgentCount) * 100;
    const isExpired = new Date(bounty.deadline) < new Date();
    const canAcceptMembers = bounty.status === 'open' && spotsRemaining > 0 && !isExpired;

    return NextResponse.json({
      ...bounty,
      metrics: {
        spotsRemaining,
        teamCompletionPercent,
        isExpired,
        canAcceptMembers,
        daysUntilDeadline: Math.ceil((new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      },
    });

  } catch (error) {
    console.error('Error fetching bounty:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounty' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { agentName, address, capabilities, message } = data;

    if (!agentName || !address || !capabilities || !Array.isArray(capabilities)) {
      return NextResponse.json(
        { error: 'agentName, address, and capabilities are required' },
        { status: 400 }
      );
    }

    const bounty = getBountyById(params.id);
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }

    // Check if bounty can accept new members
    if (bounty.status !== 'open') {
      return NextResponse.json(
        { error: 'Bounty is not accepting new members' },
        { status: 400 }
      );
    }

    if (bounty.team.length >= bounty.requiredAgentCount) {
      return NextResponse.json(
        { error: 'Bounty team is full' },
        { status: 400 }
      );
    }

    if (new Date(bounty.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Bounty deadline has passed' },
        { status: 400 }
      );
    }

    // Check if agent already joined
    const alreadyJoined = bounty.team.some(member => 
      member.address.toLowerCase() === address.toLowerCase()
    );

    if (alreadyJoined) {
      return NextResponse.json(
        { error: 'Agent has already joined this bounty' },
        { status: 400 }
      );
    }

    // Validate capabilities
    if (!canJoinBounty(bounty, capabilities)) {
      return NextResponse.json(
        { 
          error: 'Agent does not have required capabilities',
          requiredCapabilities: bounty.requiredCapabilities,
          providedCapabilities: capabilities,
        },
        { status: 400 }
      );
    }

    // Create join request record
    ensureFile();
    const joinRequests = JSON.parse(fs.readFileSync(BOUNTY_JOINS_FILE, 'utf8'));

    const joinRequest = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      bountyId: params.id,
      bountyTitle: bounty.title,
      agentName: String(agentName).slice(0, 200),
      address: String(address).slice(0, 100),
      capabilities: capabilities.map((cap: string) => String(cap).slice(0, 100)),
      message: message ? String(message).slice(0, 1000) : null,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      status: 'pending',
    };

    joinRequests.push(joinRequest);
    fs.writeFileSync(BOUNTY_JOINS_FILE, JSON.stringify(joinRequests, null, 2));

    console.log(`[${joinRequest.timestamp}] New bounty join request: ${joinRequest.agentName} -> ${bounty.title}`);

    // Notify Telegram (in a real app, this would actually update the bounty team)
    notifyBountyJoin(joinRequest).catch(err => 
      console.error('Telegram notify failed:', err.message)
    );

    return NextResponse.json({
      ok: true,
      message: 'Join request submitted successfully. The team will review your application.',
      requestId: joinRequest.id,
      bountyTitle: bounty.title,
    });

  } catch (error) {
    console.error('Error joining bounty:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '';
const TG_CHAT_ID = '-1003850294102';
const TG_THREAD_ID = '8062';

async function notifyBountyJoin(request: { bountyTitle: string; agentName: string; address: string; capabilities: string[]; message?: string; id: string; timestamp: string }) {
  if (!TG_BOT_TOKEN) return;
  
  const lines = [
    `🎯 <b>New Bounty Join Request</b>`,
    ``,
    `<b>Bounty:</b> ${escapeHtml(request.bountyTitle)}`,
    `<b>Agent:</b> ${escapeHtml(request.agentName)}`,
    `<b>Address:</b> <code>${escapeHtml(request.address)}</code>`,
    `<b>Capabilities:</b> ${request.capabilities.map((c: string) => escapeHtml(c)).join(', ')}`,
  ];
  
  if (request.message) {
    lines.push(`<b>Message:</b> ${escapeHtml(request.message)}`);
  }
  
  lines.push(``, `<i>Request ID: ${request.id} | ${request.timestamp}</i>`);

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
  if (!result.ok) {
    console.error('Telegram notify error:', JSON.stringify(result));
  } else {
    console.log('Telegram notification sent for bounty join:', request.agentName);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}