import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get cart items
export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a mock user ID since we haven't implemented authentication yet
    const mockUserId = 'mock-user-id';

    // Find or create cart for the user
    let cart = await prisma.cart.findUnique({
      where: { userId: mockUserId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: mockUserId,
          user: {
            create: {
              email: 'mock@example.com',
              password: 'mock-password', // In a real app, this would be hashed
              name: 'Mock User',
              role: 'USER'
            }
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();
    const mockUserId = 'mock-user-id';

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: mockUserId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: mockUserId,
          user: {
            create: {
              email: 'mock@example.com',
              password: 'mock-password',
              name: 'Mock User',
              role: 'USER'
            }
          }
        }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item if it doesn't exist
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
} 