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
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    if (req.method === 'GET') {
      // Get current theme settings
      const settings = await prisma.setting.findMany({
        where: {
          key: {
            startsWith: 'theme_'
          }
        }
      })

      const theme = {}
      settings.forEach(setting => {
        const key = setting.key.replace('theme_', '')
        theme[key] = setting.value
      })

      res.json(theme)
    } else if (req.method === 'POST') {
      // Save theme settings
      const themeData = req.body

      // Save each theme property as a setting
      for (const [key, value] of Object.entries(themeData)) {
        await prisma.setting.upsert({
          where: { key: `theme_${key}` },
          update: { value: value as string },
          create: {
            key: `theme_${key}`,
            value: value as string
          }
        })
      }

      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Theme API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
