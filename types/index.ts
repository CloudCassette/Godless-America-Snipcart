export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number
  images: string[]
  inventory: number
  sku?: string
  weight?: number
  dimensions?: string
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  category?: Category
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  subtotal: number
  tax?: number
  shipping?: number
  customerEmail: string
  customerName?: string
  customerId?: string
  customer?: User
  shippingAddress?: Address
  billingAddress?: Address
  snipcartToken?: string
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string
  product: Product
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  postalCode: string
  phone?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  url: string
}

export interface SnipcartProduct {
  id: string
  name: string
  price: number
  url: string
  description?: string
  image?: string
  categories?: string
  weight?: number
  length?: number
  width?: number
  height?: number
  inventory?: number
  customFields?: SnipcartCustomField[]
}

export interface SnipcartCustomField {
  name: string
  options?: string
  type?: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
