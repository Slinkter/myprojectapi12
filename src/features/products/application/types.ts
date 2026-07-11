/**
 * @file types.ts
 * @description Definiciones de tipos para el nivel de aplicación de productos.
 * @architecture Application Layer - Tipos de aplicación
 */

import { ReactNode } from "react";
import type { IProduct } from "@/features/products/domain/productTypes";
import type { IProductsApiResponse } from "@/features/products/domain/productTypes";
export type { IProduct, IProductsApiResponse };

/** Tipo alias para IProduct del dominio. */
export type Product = IProduct;
/** Tipo alias para IProductsApiResponse del dominio. */
export type ProductsApiResponse = IProductsApiResponse;

/**
 * Resultado del hook useProductModal.
 * @interface IUseProductModalResult
 * @property {boolean} isModalOpen - Indica si el modal está actualmente abierto.
 * @property {IProduct | null} selectedProduct - Producto seleccionado para mostrar en el modal.
 * @property {(product: IProduct) => void} openProductModal - Abre el modal con el producto especificado.
 * @property {() => void} closeProductModal - Cierra el modal y limpia el producto seleccionado.
 */
export interface IUseProductModalResult {
    isModalOpen: boolean;
    selectedProduct: IProduct | null;
    openProductModal: (product: IProduct) => void;
    closeProductModal: () => void;
}

/**
 * Propiedades para el componente ProductModalProvider.
 * @interface IProductModalProviderProps
 * @property {ReactNode} children - Elementos hijos que tendrán acceso al contexto del modal.
 */
export interface IProductModalProviderProps {
    children: ReactNode;
}

/**
 * Resultado del hook useProducts.
 * @interface IUseProductsResult
 * @property {IProduct[]} products - Lista plana de productos obtenidos hasta el momento.
 * @property {string | null} error - Mensaje de error si la consulta falló, o null.
 * @property {boolean} isLoading - Indica si hay una operación de carga en curso (inicial o paginación).
 * @property {boolean} initialLoading - Indica exclusivamente la carga inicial de la primera página.
 * @property {boolean} hasMore - Indica si existen más páginas disponibles para cargar.
 * @property {() => void} loadMoreProducts - Dispara la carga de la siguiente página de productos.
 * @property {boolean} isLoadingMore - Indica si se está cargando una página adicional.
 */
export interface IUseProductsResult {
    products: IProduct[];
    error: string | null;
    isLoading: boolean;
    initialLoading: boolean;
    hasMore: boolean;
    loadMoreProducts: () => void;
    isLoadingMore: boolean;
}

/**
 * Propiedades para el componente ProductDetailModal.
 * @interface IProductDetailModalProps
 * @property {IProduct | null} product - Producto a mostrar en el modal, o null si no hay selección.
 * @property {boolean} isOpen - Controla la visibilidad del modal.
 * @property {() => void} onClose - Callback ejecutado al cerrar el modal.
 */
export interface IProductDetailModalProps {
    product: IProduct | null;
    isOpen: boolean;
    onClose: () => void;
}
