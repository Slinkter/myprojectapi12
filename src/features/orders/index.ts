/**
 * @file index.ts
 * @description Public API barrel para la feature de Pedidos e Historial de Compras (FSD Architecture).
 * @architecture Feature Layer - Orders Public API Barrel
 */

export * from "./domain/orderTypes";
export * from "./domain/repositories/IOrderRepository";
export * from "./domain/factories/OrderFactory";
export * from "./infrastructure/ordersFirestore";
export * from "./infrastructure/FirestoreOrderRepository";
