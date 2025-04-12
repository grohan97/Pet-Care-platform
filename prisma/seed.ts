import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pet Food',
        description: 'High-quality nutrition for your pets',
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grooming',
        description: 'Keep your pets clean and healthy',
        image: 'https://images.unsplash.com/photo-1516734212186-65266f46771f',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        description: 'Essential accessories for your pets',
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Healthcare',
        description: 'Medical supplies and supplements',
        image: 'https://images.unsplash.com/photo-1628009368231-7bb7087b1815',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    // Pet Food Products
    prisma.product.create({
      data: {
        name: 'Premium Dog Food',
        description: 'High-quality dry dog food with balanced nutrition',
        price: 999.99,
        stock: 100,
        images: [
          'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd',
          'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
        ],
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gourmet Cat Food',
        description: 'Premium wet cat food with real fish',
        price: 799.99,
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1583511655826-05700d52f4d9',
          'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
        ],
        categoryId: categories[0].id,
      },
    }),

    // Grooming Products
    prisma.product.create({
      data: {
        name: 'Professional Grooming Kit',
        description: 'Complete set of grooming tools for dogs and cats',
        price: 1499.99,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1516734212186-65266f46771f',
          'https://images.unsplash.com/photo-1535096626672-4dbccb4b2c1c',
        ],
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pet Shampoo',
        description: 'Gentle, pH-balanced shampoo for pets',
        price: 299.99,
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1535096626672-4dbccb4b2c1c',
          'https://images.unsplash.com/photo-1516734212186-65266f46771f',
        ],
        categoryId: categories[1].id,
      },
    }),

    // Accessories
    prisma.product.create({
      data: {
        name: 'Luxury Pet Bed',
        description: 'Comfortable and stylish bed for pets',
        price: 1999.99,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1576201836106-db1758fd1c97',
          'https://images.unsplash.com/photo-1567612529009-5749c6e789de',
        ],
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Adjustable Collar Set',
        description: 'Durable and comfortable collar with matching leash',
        price: 599.99,
        stock: 100,
        images: [
          'https://images.unsplash.com/photo-1567612529009-5749c6e789de',
          'https://images.unsplash.com/photo-1576201836106-db1758fd1c97',
        ],
        categoryId: categories[2].id,
      },
    }),

    // Healthcare Products
    prisma.product.create({
      data: {
        name: 'Pet Vitamins',
        description: 'Essential daily vitamins for pets',
        price: 799.99,
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1628009368231-7bb7087b1815',
          'https://images.unsplash.com/photo-1512578659172-63a4634c05ec',
        ],
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'First Aid Kit',
        description: 'Complete pet first aid kit for emergencies',
        price: 1299.99,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1512578659172-63a4634c05ec',
          'https://images.unsplash.com/photo-1628009368231-7bb7087b1815',
        ],
        categoryId: categories[3].id,
      },
    }),
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

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 