import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container-custom py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="heading-xl mb-6">
            Welcome to Your Premium Store
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products with secure, 
            fast checkout powered by Snipcart. Shop with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Shop Now
            </Link>
            <Link href="/categories" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
