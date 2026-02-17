/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 */

import { ReactNode } from "react";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  category?: string;
  thumbnail: string;
  images?: string[];
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface UseProductModalResult {
  isModalOpen: boolean;
  selectedProduct: Product | null;
  handleOpenModal: (product: Product) => void;
  handleCloseModal: () => void;
}

export interface ProductModalProviderProps {
  children: ReactNode;
}
