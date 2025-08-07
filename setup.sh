#!/bin/bash

# Setup script for the e-commerce platform

echo "🚀 Setting up your custom e-commerce platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local and add your Snipcart API keys and other configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Get your Snipcart API keys from https://app.snipcart.com"
echo "3. Run: npm run docker:up"
echo "4. Run database migrations: npm run db:migrate"
echo "5. Seed the database: npm run db:seed"
echo ""
echo "🌐 Your store will be available at http://localhost:3000"
