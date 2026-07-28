/**
 * @file index.ts
 * @description Exportaciones públicas de la entidad Product.
 * @architecture Entity Layer - Product Barrel
 */

export type { IProduct, IProductsApiResponse } from "./model/types";
export { getStockStatus } from "./model/stockUtils";
export type { StockStatus } from "./model/stockUtils";
