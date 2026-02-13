/**
 * @file cartTypes.ts
 * @description Definiciones de tipos para el dominio del carrito de compras.
 * Incluye interfaces para items del carrito, productos y resultados de validación.
 * @architecture Domain Layer - Tipos de dominio del carrito
 */

/**
 * Representa un artículo dentro del carrito de compras.
 *
 * @remarks
 * Esta interfaz extiende la información básica del producto con la cantidad
 * seleccionada actualmente por el usuario.
 */
export interface CartItem {
    /** Identificador único del producto */
    id: number;
    /** Nombre visible del producto */
    title: string;
    /** Precio unitario en USD */
    price: number;
    /** Número de unidades actualmente en el carrito */
    quantity: number;
    /** URL de la imagen en miniatura del producto */
    thumbnail: string;
    /** Unidades totales disponibles en el almacén */
    stock: number;
}

/**
 * Representa un producto base del catálogo.
 */
export interface Product {
    /** ID único del producto */
    id: number;
    /** Nombre del producto */
    title: string;
    /** Precio del producto en USD */
    price: number;
    /** URL de la imagen del producto */
    thumbnail: string;
    /** Nivel de stock actual */
    stock: number;
}

/**
 * Resultado de una comprobación de validación de un artículo del carrito.
 */
export interface ValidationResult {
    /** Indica si la validación fue exitosa */
    valid: boolean;
    /**
     * Mensaje de error descriptivo si `valid` es false.
     * @example "Stock insuficiente"
     */
    error: string | null;
}
