/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 */

/**
 * Represents a detailed product entity from the catalog.
 *
 * @remarks
 * This interface contains all the metadata provided by the DummyJSON API.
 * Some fields like `discountPercentage` and `rating` are optional.
 *
 * @example
 * ```typescript
 * const laptop: Product = {
 *   id: 1,
 *   title: "MacBook Pro",
 *   description: "Apple MacBook Pro with M2 chip",
 *   price: 1999,
 *   stock: 50,
 *   thumbnail: "https://.../macbook.jpg"
 * };
 * ```
 */
export interface Product {
    /** Unique product identifier */
    id: number;
    /** Product name */
    title: string;
    /** Comprehensive product description */
    description: string;
    /** Current price in USD */
    price: number;
    /** Optional discount percentage (e.g., 10.5) */
    discountPercentage?: number;
    /** Product rating score (typically 0-5) */
    rating?: number;
    /** Current inventory levels */
    stock: number;
    /** Manufacturer's brand name */
    brand?: string;
    /** Product grouping/classification */
    category?: string;
    /** Primary display image URL */
    thumbnail: string;
    /** Array of additional image URLs */
    images?: string[];
}

/**
 * Structure of the paginated response from the products API.
 */
export interface ProductsApiResponse {
    /** Collection of products for the current page */
    products: Product[];
    /** Global count of all available products */
    total: number;
    /** Number of items skipped (offset) */
    skip: number;
    /** Maximum number of items requested per page */
    limit: number;
}
