import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - Your Store</title>
        <meta name="description" content="Learn more about our company and mission" />
      </Head>

      <Layout>
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="heading-xl mb-6">About Your Store</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're passionate about delivering exceptional products and experiences 
                to our customers through our modern e-commerce platform.
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              {/* Our Mission */}
              <section>
                <h2 className="heading-md mb-6">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our mission is to provide high-quality products with an exceptional shopping 
                  experience. We believe that e-commerce should be simple, secure, and enjoyable 
                  for everyone.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Built with modern technologies including Next.js, Snipcart, and Docker, 
                  our platform ensures fast performance, secure transactions, and easy scalability.
                </p>
              </section>

              {/* Technology Stack */}
              <section>
                <h2 className="heading-md mb-6">Technology Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card p-6">
                    <h3 className="font-semibold text-lg mb-2">Frontend</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Next.js & React</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                    </ul>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="font-semibold text-lg mb-2">Backend</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Node.js API Routes</li>
                      <li>• Prisma ORM</li>
                      <li>• PostgreSQL</li>
                    </ul>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="font-semibold text-lg mb-2">Services</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Snipcart (Payments)</li>
                      <li>• Docker (Deployment)</li>
                      <li>• JWT (Authentication)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section>
                <h2 className="heading-md mb-6">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Customer Features</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>✓ Responsive design for all devices</li>
                      <li>✓ Fast product search and filtering</li>
                      <li>✓ Secure checkout with Snipcart</li>
                      <li>✓ Real-time inventory updates</li>
                      <li>✓ Order tracking and history</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Admin Features</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>✓ Product management dashboard</li>
                      <li>✓ Order management system</li>
                      <li>✓ Category organization</li>
                      <li>✓ Image upload and management</li>
                      <li>✓ Inventory tracking</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="text-center bg-gray-50 rounded-lg p-8">
                <h2 className="heading-md mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions about our platform or need support? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:support@yourstore.com" 
                    className="btn-primary"
                  >
                    Contact Support
                  </a>
                  <a 
                    href="/contact" 
                    className="btn-secondary"
                  >
                    Contact Form
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
