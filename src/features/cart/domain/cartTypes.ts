/**
 * @file cartTypes.ts
 * @description Definiciones de tipos para el dominio del carrito de compras.
 * Incluye interfaces para items del carrito, productos y resultados de validación.
 * @architecture Domain Layer - Tipos de dominio del carrito
 */

/**
 * @interface CartItem
 * @description Representa un item dentro del carrito de compras.
 * Extiende la información del producto con la cantidad seleccionada.
 * 
 * @property {number} id - Identificador único del producto
 * @property {string} title - Título o nombre del producto
 * @property {number} price - Precio unitario del producto en la moneda base (USD)
 * @property {number} quantity - Cantidad de unidades de este producto en el carrito
 * @property {string} thumbnail - URL de la imagen miniatura del producto
 * @property {number} stock - Cantidad disponible en inventario
 * 
 * @example
 * const item: CartItem = {
 *   id: 1,
 *   title: "Laptop HP",
 *   price: 899.99,
 *   quantity: 2,
 *   thumbnail: "https://example.com/laptop.jpg",
 *   stock: 10
 * };
 */
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
    stock: number;
}

/**
 * @interface Product
 * @description Representa un producto disponible en el catálogo.
 * Información base necesaria para mostrar y agregar productos al carrito.
 * 
 * @property {number} id - Identificador único del producto
 * @property {string} title - Título o nombre del producto
 * @property {number} price - Precio del producto en USD
 * @property {string} thumbnail - URL de la imagen del producto
 * @property {number} stock - Cantidad disponible en stock
 * 
 * @example
 * const producto: Product = {
 *   id: 5,
 *   title: "Mouse Inalámbrico",
 *   price: 29.99,
 *   thumbnail: "https://example.com/mouse.jpg",
 *   stock: 50
 * };
 */
export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    stock: number;
}

/**
 * @interface ValidationResult
 * @description Resultado de una validación de item del carrito.
 * Indica si la validación fue exitosa y proporciona mensaje de error si falló.
 * 
 * @property {boolean} valid - true si la validación fue exitosa, false en caso contrario
 * @property {string | null} error - Mensaje de error descriptivo si valid es false, null si es válido
 * 
 * @example
 * // Validación exitosa
 * const resultado: ValidationResult = {
 *   valid: true,
 *   error: null
 * };
 * 
 * @example
 * // Validación fallida
 * const resultado: ValidationResult = {
 *   valid: false,
 *   error: "Insufficient stock"
 * };
 */
export interface ValidationResult {
    valid: boolean;
    error: string | null;
}
