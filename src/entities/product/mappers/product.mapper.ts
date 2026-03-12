import type { Product, ProductApiResponse, ProductsApiResponse } from '../types/product.types'

export function mapProductFromApi(raw: ProductApiResponse): Product {
  return {
    id: raw.id,
    title: raw.title ?? 'Sin título',
    description: raw.description ?? '',
    price: typeof raw.price === 'number' ? raw.price : 0,
    discountPercentage: raw.discountPercentage,
    rating: raw.rating,
    stock: raw.stock ?? 0,
    brand: raw.brand,
    category: raw.category,
    thumbnail: raw.thumbnail ?? '',
    images: raw.images,
  }
}

export function mapProductsFromApi(rawList: ProductApiResponse[]): Product[] {
  if (!Array.isArray(rawList)) return []
  return rawList.map(mapProductFromApi)
}

export function mapProductsResponseFromApi(raw: ProductsApiResponse): { products: Product[]; total: number; skip: number; limit: number } {
  return {
    products: mapProductsFromApi(raw.products),
    total: raw.total,
    skip: raw.skip,
    limit: raw.limit,
  }
}
