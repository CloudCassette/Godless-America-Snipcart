import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { error: string }>
) {
  const { slug } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Product slug is required' })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
