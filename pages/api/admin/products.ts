import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { Product } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { error: string }>
) {
  if (req.method === 'POST') {
    return createProduct(req, res)
  } else if (req.method === 'PUT') {
    return updateProduct(req, res)
  } else if (req.method === 'DELETE') {
    return deleteProduct(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      images = [],
      inventory = 0,
      sku,
      weight,
      dimensions,
      categoryId,
      isFeatured = false,
    } = req.body

    // Validation
    if (!name || !price || !categoryId) {
      return res.status(400).json({ 
        error: 'Name, price, and categoryId are required' 
      })
    }

    // Generate slug from name
    const slug = createSlug(name)

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return res.status(400).json({ 
        error: 'A product with this name already exists' 
      })
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return res.status(400).json({ 
        error: 'Category not found' 
      })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        images: Array.isArray(images) ? images : [images].filter(Boolean),
        inventory: parseInt(inventory),
        sku,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        categoryId,
        isFeatured,
        isActive: true,
      },
      include: {
        category: true,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const updateData = req.body

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // If name is being updated, regenerate slug
    if (updateData.name) {
      updateData.slug = createSlug(updateData.name)
    }

    // Convert string numbers to proper types
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.compareAtPrice) updateData.compareAtPrice = parseFloat(updateData.compareAtPrice)
    if (updateData.inventory) updateData.inventory = parseInt(updateData.inventory)
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight)

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    })

    res.status(200).json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    await prisma.product.delete({
      where: { id },
    })

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
