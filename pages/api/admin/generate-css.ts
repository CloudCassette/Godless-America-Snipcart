import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const { css } = req.body

    if (!css) {
      return res.status(400).json({ error: 'CSS content is required' })
    }

    // Write CSS to public directory
    const cssPath = path.join(process.cwd(), 'public', 'theme.css')
    await fs.writeFile(cssPath, css, 'utf8')

    res.json({ success: true, message: 'CSS file generated successfully' })
  } catch (error) {
    console.error('CSS generation error:', error)
    res.status(500).json({ error: 'Failed to generate CSS file' })
  } finally {
    await prisma.$disconnect()
  }
}
