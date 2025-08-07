import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductFilters, PaginatedResponse, Product } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaginatedResponse<Product> | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      page = '1',
      limit = '12',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (sortBy === 'name' || sortBy === 'price' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder
    }

    // Fetch products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limitNum)

    res.status(200).json({
      data: products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
