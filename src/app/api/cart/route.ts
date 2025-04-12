import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

// GET /api/cart - Get cart items
export async function GET() {
  try {
    const cart = await prisma.cart.findMany({
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

    // Transform the data to match the frontend requirements
    const transformedCart = cart.map((item: CartItemWithProduct) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    return NextResponse.json(transformedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart.findFirst({
      where: { productId },
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
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
    }

    // Create new cart item if it doesn't exist
    const newItem = await prisma.cart.create({
      data: {
        productId,
        quantity,
      },
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
      id: newItem.id,
      name: newItem.product.name,
      price: newItem.product.price,
      quantity: newItem.quantity,
      image: newItem.product.images[0],
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await request.json();

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { itemId } = await request.json();

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 