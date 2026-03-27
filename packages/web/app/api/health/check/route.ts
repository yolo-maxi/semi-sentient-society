import { NextRequest, NextResponse } from 'next/server';
import { recordHealthCheckIn, validateTimestamp, initializeHealthStore, saveHealthStore } from '@/lib/healthCertificate';
import { isAddress, getAddress } from 'viem';

interface HealthCheckRequest {
  address: string;
  timestamp: number;
  signature: string;
}

interface HealthCheckResponse {
  success: boolean;
  message: string;
  nextCheckIn?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: HealthCheckRequest = await request.json();
    const { address, timestamp, signature } = body;
    
    // Validate required fields
    if (!address || !timestamp || !signature) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: address, timestamp, signature' 
        },
        { status: 400 }
      );
    }
    
    // Validate Ethereum address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid Ethereum address format' 
        },
        { status: 400 }
      );
    }
    
    // Normalize address
    const checksummedAddress = getAddress(address);
    
    // Validate timestamp (should be recent)
    if (!validateTimestamp(timestamp)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid timestamp - must be within 5 minutes of current time' 
        },
        { status: 400 }
      );
    }
    
    // Initialize health store
    const healthDataPath = process.cwd() + '/data/health-checkins.json';
    await initializeHealthStore(healthDataPath);
    
    // Record the check-in
    const checkInData = {
      address: checksummedAddress,
      timestamp,
      signature,
    };
    
    const recorded = recordHealthCheckIn(checkInData);
    
    if (!recorded) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Check-in rejected - duplicate recent check-in or invalid data' 
        },
        { status: 409 }
      );
    }
    
    // Save updated health store
    await saveHealthStore(healthDataPath);
    
    // Calculate next recommended check-in time (24 hours from now)
    const nextCheckIn = timestamp + (24 * 60 * 60 * 1000);
    
    const response: HealthCheckResponse = {
      success: true,
      message: 'Health check-in recorded successfully',
      nextCheckIn,
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch {
    console.error('Error processing health check-in:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Health check endpoint (GET) - simple ping to verify service is alive
export async function GET() {
  try {
    const response = {
      status: 'healthy',
      timestamp: Date.now(),
      service: 'SSS Health Check API',
      version: '1.0.0',
      uptime: process.uptime(),
    };
    
    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch {
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: Date.now(),
        message: 'Service check failed',
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}