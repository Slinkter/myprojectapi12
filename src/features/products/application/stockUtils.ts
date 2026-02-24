/**
 * @file stockUtils.ts
 * @description Utilidades puras para determinar el estado del stock de un producto.
 * @architecture Domain Layer - Lógica pura de negocio
 */

/** Posibles estados del stock de un producto */
export type StockStatus = "out" | "low" | "ok";

/**
 * @function getStockStatus
 * @description Determina el estado del stock de un producto a partir de su cantidad.
 *
 * @param {number} stock - Cantidad actual en inventario
 * @returns {StockStatus} `"out"` si no hay stock, `"low"` si quedan 10 o menos, `"ok"` si hay disponibilidad normal.
 *
 * @example
 * getStockStatus(0)  // "out"
 * getStockStatus(5)  // "low"
 * getStockStatus(50) // "ok"
 */
export const getStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return "out";
  if (stock <= 10) return "low";
  return "ok";
};
