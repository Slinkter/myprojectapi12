/**
 * @file types.ts
 * @description Interface dominial de la entidad CartItem.
 * @architecture Entity Layer - CartItem Model
 */

import type { IProduct } from "@/entities/product";

export interface ICartItem extends IProduct {
    quantity: number;
}
