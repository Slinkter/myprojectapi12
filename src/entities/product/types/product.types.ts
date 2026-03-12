export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock: number
  brand?: string
  category?: string
  thumbnail: string
  images?: string[]
}

export interface ProductApiResponse {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock: number
  brand?: string
  category?: string
  thumbnail: string
  images?: string[]
}

export type ProductCategory = string

export interface ProductFilters {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'title'
}

export interface ProductsApiResponse {
  products: ProductApiResponse[]
  total: number
  skip: number
  limit: number
}
