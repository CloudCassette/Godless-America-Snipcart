import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    })
    return user
  } catch (error) {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check authentication for non-GET requests
    if (req.method !== 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const user = await verifyToken(token)
      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' })
      }
    }

    if (req.method === 'GET') {
      // Get all categories with product count
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      })

      res.json(categories)
    } else if (req.method === 'POST') {
      // Create new category
      const { name, slug, description } = req.body

      if (!name || !slug) {
        return res.status(400).json({ error: 'Name and slug are required' })
      }

      // Check if slug already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug }
      })

      if (existingCategory) {
        return res.status(400).json({ error: 'Slug already exists' })
      }

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description: description || null
        },
        include: {
          _count: {
            select: { products: true }
          }
        }
      })

      res.status(201).json(category)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Categories API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
