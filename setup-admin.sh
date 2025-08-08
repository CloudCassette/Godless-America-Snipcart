#!/bin/bash

# Simple setup script for Godless America admin panel

echo "🎸 Setting up Godless America Admin Panel..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database is running
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database schema updated successfully"
else
    echo "❌ Database connection failed. Make sure Docker containers are running:"
    echo "   docker-compose up -d"
    exit 1
fi

# Seed the database
echo "🌱 Seeding database..."
if npx prisma db seed; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️ Database seeding failed, but continuing..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🔐 Admin Login Details:"
echo "   URL: http://192.168.86.4:3000/admin/login"
echo "   Email: godlessamerciarecords@gmail.com"
echo "   Password: Statement Glad Reader8"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🎨 Dark theme has been automatically applied to your store!"
echo ""
