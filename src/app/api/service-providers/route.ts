import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ServiceProvider, Review } from '@prisma/client';

interface ServiceProviderWithRelations extends ServiceProvider {
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
  reviews: {
    rating: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = type ? { type: type } : {};

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate average rating for each provider
    const providersWithRating = providers.map((provider: ServiceProviderWithRelations) => {
      const ratings = provider.reviews.map((review: { rating: number }) => review.rating);
      const averageRating = ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : null;

      return {
        ...provider,
        rating: averageRating,
        reviews: undefined, // Remove raw reviews from response
      };
    });

    return NextResponse.json(providersWithRating);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service providers' },
      { status: 500 }
    );
  }
} 