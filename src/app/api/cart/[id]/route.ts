import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/cart/[id] - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();

    const updatedItem = await prisma.cart.update({
      where: { id: params.id },
      data: { quantity },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedItem.id,
      name: updatedItem.product.name,
      price: updatedItem.product.price,
      quantity: updatedItem.quantity,
      image: updatedItem.product.images[0],
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cart.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
} 