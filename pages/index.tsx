import React from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Product, Category } from '@/types'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategoryGrid from '@/components/CategoryGrid'

interface HomeProps {
  featuredProducts: Product[]
  categories: Category[]
}

export default function Home({ featuredProducts, categories }: HomeProps) {
  return (
    <>
      <Head>
        <title>Your Store - Premium E-commerce</title>
        <meta
          name="description"
          content="Discover our premium collection of products with secure checkout powered by Snipcart."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Hero />
        
        <section className="py-16">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12">Featured Products</h2>
            <FeaturedProducts products={featuredProducts} />
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12">Shop by Category</h2>
            <CategoryGrid categories={categories} />
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [featuredProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: {
          category: true,
        },
        take: 8,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
    ])

    return {
      props: {
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
        categories: JSON.parse(JSON.stringify(categories)),
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        featuredProducts: [],
        categories: [],
      },
      revalidate: 60,
    }
  }
}
