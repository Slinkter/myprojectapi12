/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 */

/**
 * @interface Product
 * @description Representa un producto en el sistema con todos sus detalles.
 */
export interface Product {
    /** Identificador único del producto */
    id: number;
    /** Título o nombre del producto */
    title: string;
    /** Descripción detallada del producto */
    description: string;
    /** Precio del producto en USD */
    price: number;
    /** Porcentaje de descuento opcional */
    discountPercentage?: number;
    /** Calificación del producto (1-5) */
    rating?: number;
    /** Cantidad disponible en stock */
    stock: number;
    /** Marca del fabricante */
    brand?: string;
    /** Categoría a la que pertenece */
    category?: string;
    /** URL de la imagen principal */
    thumbnail: string;
    /** Lista de URLs de imágenes secundarias */
    images?: string[];
}

/**
 * @interface ProductsApiResponse
 * @description Estructura de la respuesta enviada por la API de productos.
 */
export interface ProductsApiResponse {
    /** Lista de productos devueltos */
    products: Product[];
    /** Número total de productos disponibles en la API */
    total: number;
    /** Número de elementos omitidos (para paginación) */
    skip: number;
    /** Límite de elementos por página */
    limit: number;
}
