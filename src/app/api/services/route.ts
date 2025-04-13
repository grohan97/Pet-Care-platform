import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Build the where clause for filtering
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        serviceProvider: {
          select: {
            id: true,
            name: true,
            type: true,
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 