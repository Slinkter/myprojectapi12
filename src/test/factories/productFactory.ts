/**
 * @file productFactory.ts
 * @description Fábrica de datos de prueba para entidades de producto.
 * Centraliza la creación de fixtures tipados para evitar duplicidad en tests.
 * @architecture Test Infrastructure - Factory Functions
 */

import type { IProduct } from "@/features/products/domain/productTypes";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

/**
 * Sobreescrituras parciales para customizar el producto generado.
 */
type ProductOverrides = Partial<IProduct>;
type CartItemOverrides = Partial<ICartItem>;

/**
 * Crea un IProduct válido con valores por defecto sensibles.
 * Todos los campos requeridos por la interfaz IProduct están incluidos.
 *
 * @param overrides - Campos a sobrescribir sobre los valores por defecto.
 * @returns Un IProduct válido para usar en tests.
 *
 * @example
 * const product = makeProduct({ price: 99.99, stock: 5 });
 */
export const makeProduct = (overrides: ProductOverrides = {}): IProduct => ({
  id: 1,
  title: "Test Product",
  description: "A product used in unit tests.",
  price: 100,
  stock: 10,
  thumbnail: "https://example.com/img.jpg",
  ...overrides,
});

/**
 * Crea un ICartItem válido (IProduct + quantity).
 *
 * @param overrides - Campos a sobrescribir sobre los valores por defecto.
 * @returns Un ICartItem válido para usar en tests.
 *
 * @example
 * const item = makeCartItem({ quantity: 3, price: 50 });
 */
export const makeCartItem = (overrides: CartItemOverrides = {}): ICartItem => ({
  ...makeProduct(),
  quantity: 1,
  ...overrides,
});
