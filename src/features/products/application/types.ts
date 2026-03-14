/**
 * @file types.ts
 * @description Definiciones de tipos para el nivel de aplicación de productos.
 * @architecture Application Layer - Tipos de aplicación
 */

import { ReactNode } from "react";
import type { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";

export type { IProduct, IProductsApiResponse };

/** Para compatibilidad mientras se refactorizan otros componentes */
export type Product = IProduct;
export type ProductsApiResponse = IProductsApiResponse;

export interface IUseProductModalResult {
  isModalOpen: boolean;
  selectedProduct: IProduct | null;
  openProductModal: (product: IProduct) => void;
  closeProductModal: () => void;
}

export interface IProductModalProviderProps {
  children: ReactNode;
}

export interface IUseProductsResult {
  products: IProduct[];
  error: string | null;
  isLoading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  loadMoreProducts: () => void;
  isLoadingMore: boolean;
}

export interface IProductDetailModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}
