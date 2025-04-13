import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pets - Get all pets for the current user
export async function GET(request: NextRequest) {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    );
  }
}

// POST /api/pets - Create a new pet
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        type: data.type,
        breed: data.breed,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        dietaryNotes: data.dietaryNotes,
        userId: data.userId, // This should come from the authenticated session
      },
    });

    return NextResponse.json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    );
  }
} 