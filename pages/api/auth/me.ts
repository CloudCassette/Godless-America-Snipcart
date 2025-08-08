import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json(userWithoutPassword)
  } catch (error) {
    console.error('Auth verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
