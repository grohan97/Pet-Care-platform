import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        pet: true,
        service: true,
        serviceProvider: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.serviceId || !data.petId || !data.serviceProviderId || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        serviceProviderId: data.serviceProviderId,
        date: new Date(data.date),
        status: 'scheduled',
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        serviceId: data.serviceId,
        petId: data.petId,
        serviceProviderId: data.serviceProviderId,
        date: new Date(data.date),
        status: 'scheduled',
        notes: data.notes,
      },
      include: {
        pet: true,
        service: true,
        serviceProvider: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments/[id] - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    if (!data.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: data.status },
      include: {
        pet: true,
        service: true,
        serviceProvider: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 