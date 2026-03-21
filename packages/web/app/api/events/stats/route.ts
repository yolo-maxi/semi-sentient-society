import { NextRequest, NextResponse } from 'next/server';
import { getEventStore, type EventType } from '../../../../lib/indexer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter parameters for stats
    const typesParam = searchParams.get('types');
    const types = typesParam ? 
      typesParam.split(',').filter(t => t.trim()) as EventType[] : 
      undefined;
    
    const agentAddress = searchParams.get('agent') || undefined;
    
    const startTimestamp = searchParams.get('startTimestamp') ? 
      parseInt(searchParams.get('startTimestamp')!, 10) : 
      undefined;
      
    const endTimestamp = searchParams.get('endTimestamp') ? 
      parseInt(searchParams.get('endTimestamp')!, 10) : 
      undefined;

    const eventStore = getEventStore();
    const stats = await eventStore.getStats({
      types,
      agentAddress,
      startTimestamp,
      endTimestamp
    });

    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch event statistics'
      },
      { status: 500 }
    );
  }
}