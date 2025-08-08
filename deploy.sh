#!/bin/bash

# Production Deployment Script for Homelab Server
# Run this script on your server after cloning the repository

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if user is in docker group
if ! groups | grep -q docker; then
    print_warning "User is not in docker group. You may need to run: sudo usermod -aG docker $USER"
    print_warning "Then log out and back in."
fi

print_status "Checking current directory..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project directory."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local from production template..."
    cp .env.production .env.local
    
    # Generate a secure JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/\$(openssl rand -base64 32)/$JWT_SECRET/" .env.local
    
    print_warning "⚠️  IMPORTANT: Edit .env.local with your configuration:"
    print_warning "   - Add your Snipcart API keys"
    print_warning "   - Update NEXT_PUBLIC_SITE_URL with your server IP/domain"
    print_warning "   - Set a secure admin password"
    echo ""
    read -p "Press Enter to continue after editing .env.local..."
fi

# Check if .env.local has been configured
if grep -q "your_snipcart_public_key_here" .env.local; then
    print_warning "⚠️  Please configure your Snipcart API keys in .env.local"
    print_warning "   Get them from: https://app.snipcart.com"
fi

# Create directories for Docker volumes
print_status "Creating necessary directories..."
mkdir -p uploads
mkdir -p postgres_data

# Stop any existing containers
print_status "Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Build and start containers
print_status "Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    print_error "Some containers failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
docker-compose exec app npx prisma migrate deploy || {
    print_warning "Migration failed, trying to push schema instead..."
    docker-compose exec app npx prisma db push
}

# Seed the database
print_status "Seeding database with sample data..."
docker-compose exec app npm run db:seed

# Show status
print_status "Checking container status..."
docker-compose ps

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
print_status "Your e-commerce platform is now running at:"
print_status "  Local: http://localhost:3000"
print_status "  Network: http://$SERVER_IP:3000"
echo ""
print_status "Default admin credentials:"
print_status "  Email: admin@yourstore.com"
print_status "  Password: Check your .env.local file"
echo ""
print_status "To manage your deployment:"
print_status "  View logs: docker-compose logs -f"
print_status "  Stop: docker-compose down"
print_status "  Restart: docker-compose restart"
print_status "  Update: git pull && docker-compose build && docker-compose up -d"
echo ""
print_warning "📋 Next steps:"
print_warning "  1. Configure your domain/reverse proxy if needed"
print_warning "  2. Set up SSL certificates for production"
print_warning "  3. Configure backups for your database"
print_warning "  4. Add your products via the admin interface"
