/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 */

/**
 * Representa una entidad de producto detallada del catálogo.
 *
 * @remarks
 * Esta interfaz contiene todos los metadatos proporcionados por la API de DummyJSON.
 * Algunos campos como `discountPercentage` y `rating` son opcionales.
 */
export interface Product {
    /** Identificador único del producto */
    id: number;
    /** Nombre del producto */
    title: string;
    /** Descripción completa del producto */
    description: string;
    /** Precio actual en USD */
    price: number;
    /** Porcentaje de descuento opcional (ej., 10.5) */
    discountPercentage?: number;
    /** Puntuación de calificación del producto (típicamente 0-5) */
    rating?: number;
    /** Niveles de inventario actuales */
    stock: number;
    /** Nombre de la marca del fabricante */
    brand?: string;
    /** Agrupación/clasificación del producto */
    category?: string;
    /** URL de la imagen de visualización principal */
    thumbnail: string;
    /** Array de URLs de imágenes adicionales */
    images?: string[];
}

/**
 * Estructura de la respuesta paginada de la API de productos.
 */
export interface ProductsApiResponse {
    /** Colección de productos para la página actual */
    products: Product[];
    /** Recuento global de todos los productos disponibles */
    total: number;
    /** Número de elementos omitidos (offset) */
    skip: number;
    /** Número máximo de elementos solicitados por página */
    limit: number;
}
