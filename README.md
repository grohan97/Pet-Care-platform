# PetCare Platform

A comprehensive platform for pet care products and services, built with Next.js and TypeScript.

## Features

- **Product Management**
  - Browse and search products
  - Filter by categories
  - Sort by price and date
  - Shopping cart functionality

- **Services**
  - Book veterinary appointments
  - Pet grooming services
  - Dog walking services
  - Boarding services

- **User Features**
  - Shopping cart
  - Service booking
  - Appointment management

## Tech Stack

- Next.js 15.3.0 with App Router
- TypeScript
- Prisma ORM
- SQLite Database
- Tailwind CSS
- Hero Icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pet-care-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/prisma` - Database schema and migrations
- `/lib` - Utility functions and shared code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
