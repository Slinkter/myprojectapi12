/**
 * @file types.ts
 * @description Interfaces dominiales de la entidad Order.
 * @architecture Entity Layer - Order Model
 */

import type { ICartItem } from "@/entities/cart-item";

export interface IOrderItem {
    productId: number;
    title: string;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: string;
    items: ICartItem[];
    totalAmount: number;
    createdAt: string;
    status: "pending" | "completed" | "cancelled";
}
