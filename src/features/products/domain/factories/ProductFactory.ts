/**
 * @file ProductFactory.ts
 * @description Fábrica para la validación, normalización y creación de entidades de Producto (Product Factory Pattern).
 * @architecture Domain Layer - Product Factory (Factory Pattern)
 */

import type { IProduct } from "@/features/products/domain/productTypes";

/**
 * Parámetros requeridos y opcionales para crear un nuevo producto.
 */
export interface ICreateProductInput {
  id?: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  isActive?: boolean;
}

/**
 * @class ProductFactory
 * @description Fábrica dominial que valida y asegura la coherencia estructural de nuevos productos en el catálogo.
 */
export class ProductFactory {
  /**
   * Genera un ID numérico pseudo-aleatorio basado en timestamp de alta resolución para evitar escaneos O(N).
   *
   * @returns {number} Identificador numérico único positivo.
   */
  public static generateProductId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  /**
   * Crea y valida una instancia completa de `IProduct`.
   *
   * @param {ICreateProductInput} input Datos base del producto.
   * @returns {IProduct} Instancia normalizada del producto.
   * @throws {Error} Si los campos obligatorios son inválidos (precio < 0, stock < 0, o título vacío).
   */
  public static createProduct(input: ICreateProductInput): IProduct {
    if (!input.title || input.title.trim() === "") {
      throw new Error("El título del producto es obligatorio y no puede estar vacío.");
    }

    if (input.price < 0) {
      throw new Error("El precio del producto no puede ser negativo.");
    }

    if (input.stock < 0) {
      throw new Error("El stock del producto no puede ser negativo.");
    }

    const id = input.id ?? this.generateProductId();
    const thumbnail = input.thumbnail?.trim() || (input.images && input.images.length > 0 ? input.images[0] : "https://via.placeholder.com/300");
    const images = input.images && input.images.length > 0 ? input.images : [thumbnail];

    return {
      id,
      title: input.title.trim(),
      description: input.description?.trim() || "",
      price: Number(input.price),
      discountPercentage: input.discountPercentage ?? 0,
      rating: input.rating ?? 4.5,
      stock: Math.floor(Number(input.stock)),
      brand: input.brand?.trim() || "Genérico",
      category: input.category?.trim() || "general",
      thumbnail,
      images,
      isActive: input.isActive !== false,
    };
  }
}
