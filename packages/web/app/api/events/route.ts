import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

interface EventData {
  event: string;
  contract: string;
  contractAddress: string;
  args: Record<string, any>;
  blockNumber: string;
  timestamp: number;
  txHash: string;
  logIndex: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get the limit from query params, default to 50, max 100
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

    // Path to events.jsonl file from the web package
    const eventsPath = join(process.cwd(), '..', '..', 'data', 'events.jsonl');
    
    let eventsData: EventData[] = [];
    
    try {
      const fileContent = readFileSync(eventsPath, 'utf-8');
      const lines = fileContent.trim().split('\n').filter(line => line.trim());
      
      // Parse each JSONL line
      eventsData = lines
        .map(line => {
          try {
            return JSON.parse(line) as EventData;
          } catch (parseError) {
            console.warn('Failed to parse event line:', line, parseError);
            return null;
          }
        })
        .filter((event): event is EventData => event !== null)
        .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending (newest first)
        .slice(0, limit); // Take the last N events
        
    } catch (fileError) {
      console.warn('Events file not found or could not be read:', eventsPath);
      // Return empty array if file doesn't exist
    }

    return NextResponse.json({
      events: eventsData,
      count: eventsData.length,
      limit
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', events: [], count: 0 },
      { status: 500 }
    );
  }
}