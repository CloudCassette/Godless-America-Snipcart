#!/usr/bin/env node

// Script to add a product via command line
// Usage: node scripts/add-product.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProduct() {
  try {
    // First, let's see available categories
    console.log('📋 Available categories:')
    const categories = await prisma.category.findMany()
    categories.forEach(cat => console.log(`  - ${cat.name} (ID: ${cat.id})`))
    
    // Example product - modify this with your own data
    const productData = {
      name: 'Your Product Name',
      slug: 'your-product-slug', // Will be auto-generated from name if not provided
      description: 'Your product description here.',
      price: 49.99,
      compareAtPrice: 59.99, // Optional
      images: [
        '/images/products/your-product-1.jpg',
        '/images/products/your-product-2.jpg'
      ],
      inventory: 25,
      sku: 'PROD-001',
      weight: 0.3,
      isActive: true,
      isFeatured: true,
      categoryId: categories[0]?.id, // Use the first category or specify a specific one
    }

    // Create the product
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
      },
    })

    console.log('✅ Product created successfully:')
    console.log(JSON.stringify(product, null, 2))

  } catch (error) {
    console.error('❌ Error creating product:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
addProduct()
