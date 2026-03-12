/**
 * @file types.ts
 * @description Definiciones de tipos para el nivel de aplicación de productos.
 * @architecture Application Layer - Tipos de aplicación
 */

import { ReactNode } from "react";
import type { Product, ProductsApiResponse } from "@/entities/product/types/product.types";

export type { Product, ProductsApiResponse };

export type IProduct = Product;
export type IProductsApiResponse = ProductsApiResponse;

export interface IUseProductModalResult {
  isModalOpen: boolean;
  selectedProduct: IProduct | null;
  handleOpenModal: (product: IProduct) => void;
  handleCloseModal: () => void;
}

export interface IProductModalProviderProps {
  children: ReactNode;
}

export interface IUseProductsResult {
  products: IProduct[];
  error: string | null;
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
}

export interface IProductDetailModalProps {
  product: IProduct | null;
  open: boolean;
  onClose: () => void;
}
