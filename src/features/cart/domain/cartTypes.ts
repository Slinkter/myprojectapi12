/**
 * @file cartTypes.ts
 * @description Definiciones de tipos para el dominio del carrito de compras.
 * Incluye interfaces para items del carrito, productos y resultados de validación.
 * @architecture Domain Layer - Tipos de dominio del carrito
 */

/**
 * Represents an item within the shopping cart.
 *
 * @remarks
 * This interface extends the base product information with the quantity
 * currently selected by the user.
 *
 * @example
 * ```typescript
 * const item: CartItem = {
 *   id: 1,
 *   title: "High-End Laptop",
 *   price: 1200,
 *   quantity: 1,
 *   thumbnail: "https://api.example.com/images/laptop.png",
 *   stock: 5
 * };
 * ```
 */
export interface CartItem {
    /** Unique identifier for the product */
    id: number;
    /** Display name of the product */
    title: string;
    /** Unit price in USD */
    price: number;
    /** Number of units currently in the cart */
    quantity: number;
    /** URL to the product's thumbnail image */
    thumbnail: string;
    /** Total units available in the warehouse */
    stock: number;
}

/**
 * Represents a base product from the catalog.
 *
 * @example
 * ```typescript
 * const product: Product = {
 *   id: 101,
 *   title: "Wireless Mouse",
 *   price: 25.99,
 *   thumbnail: "https://example.com/mouse.jpg",
 *   stock: 150
 * };
 * ```
 */
export interface Product {
    /** Unique product ID */
    id: number;
    /** Product name */
    title: string;
    /** Product price in USD */
    price: number;
    /** URL of the product image */
    thumbnail: string;
    /** Current stock level */
    stock: number;
}

/**
 * Result of a cart item validation check.
 */
export interface ValidationResult {
    /** Indicates if the validation passed */
    valid: boolean;
    /**
     * Descriptive error message if `valid` is false.
     * @example "Insufficient stock"
     */
    error: string | null;
}
