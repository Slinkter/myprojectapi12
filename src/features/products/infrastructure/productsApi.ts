/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con el catálogo de productos respaldado en Firestore.
 * @architecture Infrastructure Layer - Fetching y operaciones de productos
 */

import type { IProductsApiResponse } from "@/features/products/domain/productTypes";
import {
  getProductsFromFirestore,
  getCategoriesFromFirestore,
  getProductByIdFromFirestore,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
} from "./productsFirestore";

/**
 * Representa una categoría de producto.
 * @interface ICategory
 * @property {string} slug - Identificador único en formato slug para la categoría.
 * @property {string} name - Nombre legible de la categoría.
 * @property {string} url - URL de la ruta para esta categoría.
 */
export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

/**
 * Obtiene la lista de categorías disponibles desde Firestore.
 * @returns {Promise<ICategory[]>}
 */
export const getCategories = async (): Promise<ICategory[]> => {
  return getCategoriesFromFirestore();
};

/**
 * Obtiene una lista paginada de productos de Firestore, opcionalmente filtrada por categoría.
 * 
 * @param {number} skip - Cantidad de elementos a saltar (offset).
 * @param {number} limit - Cantidad máxima de elementos a retornar.
 * @param {string} [category] - Categoría opcional para filtrar los productos.
 * @returns {Promise<IProductsApiResponse>} Promesa con la respuesta paginada de productos.
 */
export const getProducts = async (
  skip: number,
  limit: number,
  category?: string,
): Promise<IProductsApiResponse> => {
  return getProductsFromFirestore(skip, limit, category);
};

export {
  getProductByIdFromFirestore,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
};
