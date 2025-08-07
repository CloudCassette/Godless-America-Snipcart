# Custom E-commerce Platform with Snipcart

A modern, self-hosted e-commerce platform built with Next.js, Snipcart, and Docker.

## Features

- 🛍️ Modern e-commerce storefront
- 🔒 Admin panel for product management
- 💳 Snipcart integration for payments
- 🐳 Docker containerized for easy deployment
- 📱 Responsive design
- 🗄️ PostgreSQL database
- 🔐 User authentication
- 📸 Image upload and management

## Quick Start

1. Clone the repository
2. Configure environment variables
3. Start with Docker:
   ```bash
   npm run docker:up
   ```

## Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# Snipcart
NEXT_PUBLIC_SNIPCART_API_KEY="your_snipcart_public_key"
SNIPCART_SECRET_KEY="your_snipcart_secret_key"

# JWT
JWT_SECRET="your_jwt_secret_here"

# Admin
ADMIN_EMAIL="admin@yourstore.com"
ADMIN_PASSWORD="your_admin_password"

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

## Deployment

1. Set up your environment variables
2. Build and start with Docker:
   ```bash
   npm run docker:build
   npm run docker:up
   ```

## Project Structure

```
├── components/          # React components
├── pages/              # Next.js pages
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── styles/             # CSS styles
├── lib/                # Utility functions
├── types/              # TypeScript types
└── docker-compose.yml  # Docker configuration
```

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL
- **Payments**: Snipcart
- **Deployment**: Docker, Docker Compose
