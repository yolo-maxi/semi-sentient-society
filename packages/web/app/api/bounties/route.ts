import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_BOUNTIES, 
  getBountiesByStatus, 
  type Bounty 
} from '@/data/mock-bounties';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const status = searchParams.get('status') as Bounty['status'] | null;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority') as Bounty['priority'] | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredBounties = [...MOCK_BOUNTIES];

    // Filter by status
    if (status && ['open', 'in-progress', 'completed', 'expired'].includes(status)) {
      filteredBounties = getBountiesByStatus(status);
    }

    // Filter by category
    if (category) {
      filteredBounties = filteredBounties.filter(bounty => 
        bounty.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
      filteredBounties = filteredBounties.filter(bounty => bounty.priority === priority);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBounties = filteredBounties.filter(bounty =>
        bounty.title.toLowerCase().includes(searchLower) ||
        bounty.description.toLowerCase().includes(searchLower) ||
        bounty.requiredCapabilities.some(cap => 
          cap.toLowerCase().includes(searchLower)
        ) ||
        bounty.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort by priority (urgent first) and then by created date (newest first)
    filteredBounties.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const total = filteredBounties.length;
    const paginated = filteredBounties.slice(offset, offset + limit);

    return NextResponse.json({
      bounties: paginated,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
      filters: {
        status,
        category,
        priority,
        search,
      },
    });

  } catch (error) {
    console.error('Error fetching bounties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounties' },
      { status: 500 }
    );
  }
}