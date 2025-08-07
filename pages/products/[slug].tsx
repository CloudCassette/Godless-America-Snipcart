import React from 'react'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types'
import Layout from '@/components/Layout'
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils'

interface ProductPageProps {
  product: Product
}

export default function ProductPage({ product }: ProductPageProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? calculateDiscountPercentage(product.compareAtPrice!, product.price)
    : 0

  return (
    <>
      <Head>
        <title>{product.name} - Your Store</title>
        <meta name="description" content={product.description || `Buy ${product.name} from Your Store`} />
      </Head>

      <Layout>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {hasDiscount && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white font-bold px-3 py-1 rounded">
                        -{discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
              
              {/* Additional Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="aspect-square object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="heading-lg mb-2">{product.name}</h1>
                <p className="text-gray-600">SKU: {product.sku || 'N/A'}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Category:</span>
                  <p className="text-gray-600">{product.category?.name}</p>
                </div>
                {product.weight && (
                  <div>
                    <span className="font-semibold">Weight:</span>
                    <p className="text-gray-600">{product.weight} kg</p>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Availability:</span>
                  <p className={`${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className="snipcart-add-item btn-primary w-full py-4 text-lg"
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-url={`/products/${product.slug}`}
                data-item-description={product.description || ''}
                data-item-image={product.images[0] || ''}
                data-item-name={product.name}
                data-item-weight={product.weight}
                data-item-inventory={product.inventory}
                disabled={product.inventory === 0}
              >
                {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })

  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string

  if (!slug) {
    return { notFound: true }
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product || !product.isActive) {
    return { notFound: true }
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 3600,
  }
}
