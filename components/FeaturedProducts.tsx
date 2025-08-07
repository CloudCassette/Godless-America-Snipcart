import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? calculateDiscountPercentage(product.compareAtPrice!, product.price)
    : 0

  return (
    <div className="card group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          </div>
        )}
        
        <div className="aspect-square relative">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          <Link 
            href={`/products/${product.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Snipcart Buy Button */}
        <button
          className="snipcart-add-item btn-primary w-full mt-4"
          data-item-id={product.id}
          data-item-price={product.price}
          data-item-url={`/products/${product.slug}`}
          data-item-description={product.description || ''}
          data-item-image={product.images[0] || ''}
          data-item-name={product.name}
          data-item-weight={product.weight}
          data-item-inventory={product.inventory}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
