import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import {
  recordHealthCheckIn,
  calculateHealthStatus,
  initializeHealthStore,
  saveHealthStore,
  HealthCheckIn,
} from '../../../../../lib/healthCertificate';
import path from 'path';

// Path to persistent health data file
const HEALTH_DATA_FILE = path.join(process.cwd(), 'data', 'health-checkins.json');

// Initialize health store on module load
let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initializeHealthStore(HEALTH_DATA_FILE);
    initialized = true;
  }
}

/**
 * POST /api/agent/[address]/health
 * Submit a health check-in for an agent
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate Ethereum address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Normalize address to checksummed format
    const checksummedAddress = getAddress(address);

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.address || !body.timestamp || !body.signature) {
      return NextResponse.json(
        { error: 'Missing required fields: address, timestamp, signature' },
        { status: 400 }
      );
    }

    // Ensure address in body matches URL parameter
    if (getAddress(body.address) !== checksummedAddress) {
      return NextResponse.json(
        { error: 'Address in URL does not match address in request body' },
        { status: 400 }
      );
    }

    // Validate timestamp format
    if (typeof body.timestamp !== 'number' || body.timestamp <= 0) {
      return NextResponse.json(
        { error: 'Invalid timestamp format' },
        { status: 400 }
      );
    }

    // Validate signature format (basic check)
    if (typeof body.signature !== 'string' || body.signature.length < 10) {
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    // Initialize health store if needed
    await ensureInitialized();

    // Create health check-in object
    const checkin: HealthCheckIn = {
      address: checksummedAddress,
      timestamp: body.timestamp,
      signature: body.signature,
    };

    // Record the check-in
    const success = recordHealthCheckIn(checkin);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to record check-in. Timestamp may be stale or duplicate.' },
        { status: 400 }
      );
    }

    // Save to persistent storage
    await saveHealthStore(HEALTH_DATA_FILE);

    // Return success response
    const response = {
      success: true,
      address: checksummedAddress,
      timestamp: body.timestamp,
      message: 'Health check-in recorded successfully',
    };

    // Add CORS headers
    const jsonResponse = NextResponse.json(response);
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to process health check-in.';
    
    console.error('Error processing health check-in:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

/**
 * GET /api/agent/[address]/health
 * Get health status for an agent
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate Ethereum address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Normalize address to checksummed format
    const checksummedAddress = getAddress(address);

    // Initialize health store if needed
    await ensureInitialized();

    // Calculate health status
    const healthStatus = calculateHealthStatus(checksummedAddress);

    // Add CORS headers
    const jsonResponse = NextResponse.json(healthStatus);
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch agent health status.';
    
    console.error('Error fetching agent health status:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
