import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create categories
  const categories = [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Comfortable and stylish t-shirts for everyday wear',
    },
    {
      name: 'Hoodies',
      slug: 'hoodies',
      description: 'Warm and cozy hoodies for cool weather',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Stylish accessories to complete your look',
    },
    {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Comfortable and fashionable footwear',
    },
  ]

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    })
  }

  console.log('✅ Categories created')

  // Get categories for product creation
  const tshirtCategory = await prisma.category.findUnique({ where: { slug: 't-shirts' } })
  const hoodieCategory = await prisma.category.findUnique({ where: { slug: 'hoodies' } })
  const accessoryCategory = await prisma.category.findUnique({ where: { slug: 'accessories' } })

  // Create sample products
  const products = [
    {
      name: 'Classic White T-Shirt',
      slug: 'classic-white-tshirt',
      description: 'A timeless white t-shirt made from premium cotton. Perfect for any occasion.',
      price: 29.99,
      compareAtPrice: 39.99,
      images: ['/images/products/white-tshirt.jpg'],
      inventory: 100,
      sku: 'TS-001',
      weight: 0.2,
      isActive: true,
      isFeatured: true,
      categoryId: tshirtCategory?.id!,
    },
    {
      name: 'Black Graphic T-Shirt',
      slug: 'black-graphic-tshirt',
      description: 'Bold graphic design on a comfortable black t-shirt.',
      price: 34.99,
      images: ['/images/products/black-graphic-tshirt.jpg'],
      inventory: 75,
      sku: 'TS-002',
      weight: 0.22,
      isActive: true,
      isFeatured: false,
      categoryId: tshirtCategory?.id!,
    },
    {
      name: 'Premium Hoodie',
      slug: 'premium-hoodie',
      description: 'Luxurious hoodie with fleece lining and adjustable drawstrings.',
      price: 79.99,
      compareAtPrice: 99.99,
      images: ['/images/products/premium-hoodie.jpg'],
      inventory: 50,
      sku: 'HD-001',
      weight: 0.8,
      isActive: true,
      isFeatured: true,
      categoryId: hoodieCategory?.id!,
    },
    {
      name: 'Vintage Cap',
      slug: 'vintage-cap',
      description: 'Stylish vintage-style cap with adjustable strap.',
      price: 24.99,
      images: ['/images/products/vintage-cap.jpg'],
      inventory: 200,
      sku: 'ACC-001',
      weight: 0.1,
      isActive: true,
      isFeatured: false,
      categoryId: accessoryCategory?.id!,
    },
    // Add your custom products here
    {
      name: 'Custom Product Name',
      slug: 'custom-product-slug',
      description: 'Your product description here.',
      price: 49.99,
      compareAtPrice: 59.99, // Optional sale price
      images: ['/images/products/your-product.jpg'],
      inventory: 25,
      sku: 'CUSTOM-001',
      weight: 0.3,
      isActive: true,
      isFeatured: true,
      categoryId: tshirtCategory?.id!, // Use appropriate category
    },
  ]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
  }

  console.log('✅ Sample products created')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
