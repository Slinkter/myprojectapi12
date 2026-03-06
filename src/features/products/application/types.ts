/**
 * @file types.ts
 * @description Definiciones de tipos para el nivel de aplicación de productos.
 * @architecture Application Layer - Tipos de aplicación
 */

import { ReactNode } from "react";
import { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";

export type { IProduct, IProductsApiResponse };

/**
 * @interface IUseProductModalResult
 * @description Estructura del objeto devuelto por el hook useProductModal.
 */
export interface IUseProductModalResult {
  /** Indica si el modal está actualmente visible */
  isModalOpen: boolean;
  /** El producto seleccionado para mostrar detalles, o null si no hay ninguno */
  selectedProduct: IProduct | null;
  /** Función para abrir el modal con un producto específico */
  handleOpenModal: (product: IProduct) => void;
  /** Función para cerrar el modal y limpiar el producto seleccionado */
  handleCloseModal: () => void;
}

/**
 * @interface IProductModalProviderProps
 * @description Props para el componente ProductModalProvider.
 */
export interface IProductModalProviderProps {
  /** Componentes hijos que tendrán acceso al contexto */
  children: ReactNode;
}

/**
 * @interface IUseProductsResult
 * @description Interfaz para el valor de retorno del hook useProducts.
 */
export interface IUseProductsResult {
  /** Array de productos aplanados de todas las páginas */
  products: IProduct[];
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
 * @interface IProductDetailModalProps
 * @description Propiedades para el modal de detalles del producto.
 */
export interface IProductDetailModalProps {
  /** El objeto del producto a mostrar, o null si está cerrado */
  product: IProduct | null;
  /** Booleano que controla si el modal es visible */
  open: boolean;
  /** Función callback para solicitar el cierre del modal */
  onClose: () => void;
}
