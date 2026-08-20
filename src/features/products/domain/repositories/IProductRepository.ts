/**
 * @file IProductRepository.ts
 * @description Interfaz de repositorio de dominio para la abstracción de fuentes de datos de productos.
 * @architecture Domain Layer - Repository Pattern Interface
 */

import type { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";
import type { ICategory } from "@/features/products/infrastructure/productsApi";

/**
 * Contrato de operaciones que cualquier repositorio de productos debe satisfacer
 * independientemente del mecanismo de persistencia (Firestore, API REST o Memoria).
 */
export interface IProductRepository {
  /**
   * Obtiene una lista paginada de productos, opcionalmente filtrada por categoría.
   */
  getProducts(skip: number, limit: number, category?: string): Promise<IProductsApiResponse>;

  /**
   * Obtiene un producto por su identificador numérico único.
   */
  getProductById(id: number): Promise<IProduct | null>;

  /**
   * Obtiene la lista completa de categorías disponibles.
   */
  getCategories(): Promise<ICategory[]>;

  /**
   * Registra un nuevo producto en el catálogo.
   */
  createProduct(productData: Omit<IProduct, "id">): Promise<IProduct>;

  /**
   * Actualiza parcialmente un producto existente.
   */
  updateProduct(id: number, productData: Partial<IProduct>): Promise<void>;

  /**
   * Elimina un producto por su ID.
   */
  deleteProduct(id: number): Promise<void>;

  /**
   * Obtiene todos los productos (incluyendo inactivos) para gestión administrativa.
   */
  getAllProductsForAdmin(): Promise<IProduct[]>;
}
