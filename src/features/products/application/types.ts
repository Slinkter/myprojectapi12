/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 */

import { ReactNode } from "react";

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

/**
 * @interface UseProductModalResult
 * @description Estructura del objeto devuelto por el hook useProductModal.
 */
export interface UseProductModalResult {
  /** Indica si el modal está actualmente visible */
  isModalOpen: boolean;
  /** El producto seleccionado para mostrar detalles, o null si no hay ninguno */
  selectedProduct: Product | null;
  /** Función para abrir el modal con un producto específico */
  handleOpenModal: (product: Product) => void;
  /** Función para cerrar el modal y limpiar el producto seleccionado */
  handleCloseModal: () => void;
}

/**
 * @interface ProductModalProviderProps
 * @description Props para el componente ProductModalProvider.
 */
export interface ProductModalProviderProps {
  /** Componentes hijos que tendrán acceso al contexto */
  children: ReactNode;
}

/**
 * @interface UseProductsResult
 * @description Interfaz para el valor de retorno del hook useProducts.
 */
export interface UseProductsResult {
  /** Array de productos aplanados de todas las páginas */
  products: Product[];
  /** Mensaje de error si la consulta falla */
  error: string | null;
  /** Verdadero si se está obteniendo la siguiente página */
  loading: boolean;
  /** Verdadero si se está obteniendo la primera página */
  initialLoading: boolean;
  /** Verdadero si hay más páginas para obtener */
  hasMore: boolean;
  /** Función para obtener la siguiente página */
  loadMore: () => void;
  /** Verdadero si se está cargando específicamente más datos (siguiente página) */
  isLoadingMore: boolean;
}

/**
 * @interface ProductDetailModalProps
 * @description Propiedades para el modal de detalles del producto.
 */
export interface ProductDetailModalProps {
  /** El objeto del producto a mostrar, o null si está cerrado */
  product: Product | null;
  /** Booleano que controla si el modal es visible */
  open: boolean;
  /** Función callback para solicitar el cierre del modal */
  onClose: () => void;
}
