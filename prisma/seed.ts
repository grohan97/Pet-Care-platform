import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // First, create product categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Dog Products', description: 'Essential items for your canine companions' }
    }),
    prisma.category.create({
      data: { name: 'Grooming', description: 'Professional grooming tools and supplies' }
    }),
    prisma.category.create({
      data: { name: 'Pet Food', description: 'Premium nutrition for all pets' }
    }),
    prisma.category.create({
      data: { name: 'Accessories', description: 'Stylish and functional pet accessories' }
    })
  ]);

  // Create products for each category
  const products = await Promise.all([
    // Dog Products
    prisma.product.create({
      data: {
        name: 'Durable Dog Leash',
        description: 'Heavy-duty retractable leash with comfortable grip',
        price: 24.99,
        stockQuantity: 100,
        categoryId: categories[0].id,
        imageUrl: 'https://example.com/dog-leash.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Orthopedic Dog Bed',
        description: 'Memory foam bed for maximum comfort',
        price: 79.99,
        stockQuantity: 50,
        categoryId: categories[0].id,
        imageUrl: 'https://example.com/dog-bed.jpg'
      }
    }),

    // Grooming Products
    prisma.product.create({
      data: {
        name: 'Professional Pet Clippers',
        description: 'Quiet and precise grooming clippers',
        price: 89.99,
        stockQuantity: 75,
        categoryId: categories[1].id,
        imageUrl: 'https://example.com/pet-clippers.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Natural Pet Shampoo',
        description: 'Gentle, tearless formula with organic ingredients',
        price: 16.99,
        stockQuantity: 150,
        categoryId: categories[1].id,
        imageUrl: 'https://example.com/pet-shampoo.jpg'
      }
    }),

    // Pet Food
    prisma.product.create({
      data: {
        name: 'Premium Dry Dog Food',
        description: 'Grain-free formula with real meat',
        price: 54.99,
        stockQuantity: 200,
        categoryId: categories[2].id,
        imageUrl: 'https://example.com/dog-food.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Gourmet Cat Food',
        description: 'Wild-caught fish recipe',
        price: 32.99,
        stockQuantity: 150,
        categoryId: categories[2].id,
        imageUrl: 'https://example.com/cat-food.jpg'
      }
    }),

    // Accessories
    prisma.product.create({
      data: {
        name: 'Stylish Pet Collar',
        description: 'Adjustable collar with designer patterns',
        price: 19.99,
        stockQuantity: 120,
        categoryId: categories[3].id,
        imageUrl: 'https://example.com/pet-collar.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Interactive Pet Toy',
        description: 'Engaging toy for mental stimulation',
        price: 14.99,
        stockQuantity: 100,
        categoryId: categories[3].id,
        imageUrl: 'https://example.com/pet-toy.jpg'
      }
    })
  ]);

  // Create a test user
  const hashedPassword = await hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 