import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

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

    const form = new IncomingForm({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' })
      }

      const file = Array.isArray(files.image) ? files.image[0] : files.image
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      try {
        // Generate unique filename
        const timestamp = Date.now()
        const ext = path.extname(file.originalFilename || '')
        const filename = `product-${timestamp}${ext}`
        const newPath = path.join(uploadDir, filename)

        // Move file to final location
        await fs.rename(file.filepath, newPath)

        // Return public URL
        const url = `/uploads/${filename}`
        res.json({ url, filename })
      } catch (error) {
        console.error('File processing error:', error)
        res.status(500).json({ error: 'File processing failed' })
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
