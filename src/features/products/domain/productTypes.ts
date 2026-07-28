/**
 * @file productTypes.ts
 * @description Definiciones de tipos para el dominio de productos.
 * @architecture Domain Layer - Tipos de producto
 *
 * @remarks
 * Los tipos compartidos IProduct e IProductsApiResponse se definen en
 * @shared/types/product.ts para evitar dependencias cruzadas entre features.
 * Este archivo los re-exporta para mantener compatibilidad con imports existentes.
 */

export type { IProduct, IProductsApiResponse } from "@/entities/product";
