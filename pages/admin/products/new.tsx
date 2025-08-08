import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  images: string[]
  inventory: number
  sku: string
  weight: number | null
  dimensions: string
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  metaTitle: string
  metaDescription: string
  tags: string[]
}

const defaultForm: ProductForm = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  compareAtPrice: null,
  images: [],
  inventory: 0,
  sku: '',
  weight: null,
  dimensions: '',
  isActive: true,
  isFeatured: false,
  categoryId: '',
  metaTitle: '',
  metaDescription: '',
  tags: []
}

export default function ProductForm() {
  const router = useRouter()
  const { id } = router.query
  const isEditing = !!id

  const [form, setForm] = useState<ProductForm>(defaultForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageUpload, setImageUpload] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProduct = async () => {
    if (!id) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const product = await response.json()
        setForm({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images || [],
          inventory: product.inventory,
          sku: product.sku || '',
          weight: product.weight,
          dimensions: product.dimensions || '',
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryId: product.categoryId,
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          tags: product.tags || []
        })
      } else {
        setError('Failed to fetch product')
      }
    } catch (error) {
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const url = isEditing ? `/api/admin/products/${id}` : '/api/admin/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save product')
      }
    } catch (error) {
      setError('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async () => {
    if (!imageUpload) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', imageUpload)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setForm({
          ...form,
          images: [...form.images, data.url]
        })
        setImageUpload(null)
      } else {
        setError('Failed to upload image')
      }
    } catch (error) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index)
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: form.slug || generateSlug(name)
    })
  }

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm({
        ...form,
        tags: [...form.tags, tag]
      })
    }
  }

  const removeTag = (index: number) => {
    setForm({
      ...form,
      tags: form.tags.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>
          {isEditing ? 'Edit Product' : 'Add Product'} - Admin - Godless America
        </title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : 'Create a new product for your store'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="input-field"
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="input-field"
                      required
                      placeholder="product-url-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used in the product URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="input-field"
                      rows={4}
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price * ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                        required
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compare At Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.compareAtPrice || ''}
                        onChange={(e) => setForm({ 
                          ...form, 
                          compareAtPrice: e.target.value ? parseFloat(e.target.value) : null 
                        })}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!imageUpload || uploading}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="input-field"
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      className="input-field"
                      rows={3}
                      placeholder="SEO description for search engines"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (visible on storefront)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                      Featured product
                    </label>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Organization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Enter tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                      className="input-field"
                    />
                    {form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory & Shipping */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Inventory & Shipping
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="input-field"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inventory Quantity
                    </label>
                    <input
                      type="number"
                      value={form.inventory}
                      onChange={(e) => setForm({ ...form, inventory: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.weight || ''}
                      onChange={(e) => setForm({ 
                        ...form, 
                        weight: e.target.value ? parseFloat(e.target.value) : null 
                      })}
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={form.dimensions}
                      onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                      className="input-field"
                      placeholder="L x W x H"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
