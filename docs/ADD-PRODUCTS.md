# Adding Products via API

## Method 1: Using cURL

```bash
# Add a new product
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Product Name",
    "description": "Product description here",
    "price": 49.99,
    "compareAtPrice": 59.99,
    "inventory": 25,
    "sku": "PROD-001",
    "weight": 0.3,
    "categoryId": "category-id-here",
    "isFeatured": true,
    "images": [
      "/images/products/product-1.jpg",
      "/images/products/product-2.jpg"
    ]
  }'
```

## Method 2: Using JavaScript/Fetch

```javascript
const productData = {
  name: "Your Product Name",
  description: "Product description here",
  price: 49.99,
  compareAtPrice: 59.99,
  inventory: 25,
  sku: "PROD-001",
  weight: 0.3,
  categoryId: "category-id-here",
  isFeatured: true,
  images: [
    "/images/products/product-1.jpg",
    "/images/products/product-2.jpg"
  ]
}

fetch('/api/admin/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(productData),
})
.then(response => response.json())
.then(data => console.log('Product created:', data))
.catch(error => console.error('Error:', error))
```

## Method 3: Using Postman

1. Set method to POST
2. URL: `http://localhost:3000/api/admin/products`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Your Product Name",
  "description": "Product description here",
  "price": 49.99,
  "compareAtPrice": 59.99,
  "inventory": 25,
  "sku": "PROD-001",
  "weight": 0.3,
  "categoryId": "category-id-here",
  "isFeatured": true,
  "images": [
    "/images/products/product-1.jpg",
    "/images/products/product-2.jpg"
  ]
}
```

## Getting Category IDs

First get available categories:
```bash
curl http://localhost:3000/api/categories
```

## Product Fields

### Required Fields:
- `name`: Product name
- `price`: Product price (number)
- `categoryId`: Valid category ID

### Optional Fields:
- `description`: Product description
- `compareAtPrice`: Original/compare price for showing discounts
- `inventory`: Stock quantity (default: 0)
- `sku`: Stock Keeping Unit
- `weight`: Product weight in kg
- `dimensions`: Product dimensions
- `isFeatured`: Boolean to feature on homepage (default: false)
- `images`: Array of image URLs
- `isActive`: Boolean to show/hide product (default: true)

## Notes:
- Slug is auto-generated from the product name
- Images should be accessible URLs (can be relative paths to your public folder)
- Price should be a number, not a string
- Category ID must exist in your database
