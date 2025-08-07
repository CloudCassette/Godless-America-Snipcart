# 🛍️ Custom E-commerce Platform with Snipcart - Installation Guide

This guide will help you set up and deploy your custom Shopify-like e-commerce platform using Docker and Snipcart.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker** (version 20.0 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd "/home/cloudcassette/Projects/Godless America Snipcart"

# Run the setup script
./setup.sh
```

### 2. Configure Environment Variables

Copy the example environment file and edit it with your configuration:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your settings:

```env
# Database
DATABASE_URL="postgresql://ecommerce_user:ecommerce_password@localhost:5432/ecommerce_db"

# Snipcart Configuration (Get these from https://app.snipcart.com)
NEXT_PUBLIC_SNIPCART_API_KEY="your_snipcart_public_key_here"
SNIPCART_SECRET_KEY="your_snipcart_secret_key_here"

# JWT Secret (Generate a secure random string)
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_random"

# Admin credentials
ADMIN_EMAIL="admin@yourstore.com"
ADMIN_PASSWORD="your_secure_admin_password"

# Site configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Your Store Name"
```

### 3. Get Snipcart API Keys

1. Go to [Snipcart](https://app.snipcart.com)
2. Create a free account
3. Navigate to Account Settings > API Keys
4. Copy your **Public Test Key** and **Secret Test Key**
5. Add them to your `.env.local` file

### 4. Start the Application

```bash
# Build and start all services
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Access Your Store

- **Frontend**: http://localhost:3000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Development Setup

For development without Docker:

```bash
# Install dependencies
npm install

# Start PostgreSQL locally or use a cloud database
# Update DATABASE_URL in .env.local accordingly

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── components/          # React components
│   ├── Layout.tsx       # Main layout component
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   ├── Hero.tsx         # Homepage hero section
│   ├── FeaturedProducts.tsx  # Product grid component
│   └── CategoryGrid.tsx # Category display
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   │   ├── products/   # Product API endpoints
│   │   ├── categories/ # Category API endpoints
│   │   └── upload.ts   # File upload endpoint
│   ├── products/       # Product pages
│   ├── _app.tsx        # App wrapper with Snipcart
│   ├── index.tsx       # Homepage
│   └── about.tsx       # About page
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding script
├── lib/                # Utility functions
│   ├── prisma.ts       # Database connection
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
├── styles/             # CSS and styling
├── public/             # Static assets
├── docker-compose.yml  # Docker services configuration
├── Dockerfile          # Container build instructions
└── README.md           # This file
```

## 🐳 Docker Services

The application uses the following Docker services:

1. **app**: Next.js application (port 3000)
2. **db**: PostgreSQL database (port 5432)
3. **redis**: Redis cache (port 6379)

## 🎛️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Docker
npm run docker:build     # Build Docker images
npm run docker:up        # Start all services
npm run docker:down      # Stop all services

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
```

## 🔧 Configuration Options

### Snipcart Configuration

The Snipcart integration supports:

- Multiple payment methods (Credit cards, PayPal, Apple Pay, etc.)
- Tax calculation
- Shipping options
- Discount codes
- Customer accounts
- Order management

### Database Configuration

The application uses PostgreSQL with Prisma ORM:

- **Products**: Name, description, price, images, inventory
- **Categories**: Organized product groupings
- **Orders**: Customer order history
- **Users**: Customer and admin accounts

### Image Upload

Images are stored in the `public/uploads` directory and served statically. For production, consider using a CDN or cloud storage service.

## 🚀 Production Deployment

### Option 1: Docker Deployment

1. Set up a cloud server (AWS EC2, DigitalOcean, etc.)
2. Install Docker and Docker Compose
3. Clone your repository
4. Configure production environment variables
5. Run: `docker-compose up -d`

### Option 2: Platform Deployment

Deploy to platforms like:

- **Vercel**: For the Next.js application
- **Railway/Heroku**: For full-stack deployment
- **AWS/GCP**: For enterprise-scale deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="your_production_database_url"
NEXT_PUBLIC_SNIPCART_API_KEY="your_live_snipcart_key"
SNIPCART_SECRET_KEY="your_live_snipcart_secret"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **Database**: Use strong passwords and enable SSL
3. **JWT Secret**: Use a long, random string
4. **File Uploads**: Implement file type validation and size limits
5. **Rate Limiting**: Consider adding rate limiting for API endpoints

## 🛡️ Backup and Maintenance

### Database Backup

```bash
# Backup database
docker exec ecommerce_db pg_dump -U ecommerce_user ecommerce_db > backup.sql

# Restore database
docker exec -i ecommerce_db psql -U ecommerce_user ecommerce_db < backup.sql
```

### Regular Maintenance

- Monitor disk space for uploads
- Review and clean old logs
- Update dependencies regularly
- Monitor database performance

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml if needed
2. **Database connection**: Ensure PostgreSQL is running and accessible
3. **Snipcart not loading**: Check API keys and domain configuration
4. **Build errors**: Clear node_modules and reinstall dependencies

### Logs

```bash
# View application logs
docker logs ecommerce_app

# View database logs
docker logs ecommerce_db

# View all services
docker-compose logs
```

## 📚 Additional Resources

- [Snipcart Documentation](https://docs.snipcart.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Ensure all environment variables are configured
4. Verify Snipcart API keys are valid

## 📄 License

This project is open source and available under the MIT License.
