import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Your Store</title>
        <meta name="description" content="Admin panel for managing your e-commerce store" />
      </Head>

      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="heading-lg mb-6">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">
              This is a placeholder for the admin panel. You can extend this to include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Product Management</h3>
                <p className="text-gray-600">Add, edit, and manage your products</p>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Order Management</h3>
                <p className="text-gray-600">View and process customer orders</p>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Category Management</h3>
                <p className="text-gray-600">Organize products into categories</p>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Customer Management</h3>
                <p className="text-gray-600">View and manage customer accounts</p>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Analytics</h3>
                <p className="text-gray-600">Sales reports and analytics</p>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Settings</h3>
                <p className="text-gray-600">Store configuration and settings</p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
              <p className="text-gray-700">
                To build a complete admin panel, you can extend this application with:
              </p>
              <ul className="text-left mt-4 space-y-2 max-w-md mx-auto">
                <li>• Authentication middleware</li>
                <li>• CRUD operations for products</li>
                <li>• Order status management</li>
                <li>• File upload for product images</li>
                <li>• Dashboard with analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
