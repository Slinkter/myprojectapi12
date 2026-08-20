/**
 * @file index.ts
 * @description Public API barrel para la feature del Carrito de Compras (FSD Architecture).
 * @architecture Feature Layer - Cart Public API Barrel
 */

export * from "./domain/cartTypes";
export * from "./domain/cartUtils";
export * from "./application/CartStateContext";
export * from "./application/CartActionsContext";
export { CartContext, useCart } from "./application/CartContext";
export * from "./application/CartProvider";
export * from "./application/hooks/useCartDrawer";
export { default as Cart } from "./presentation/Cart";
export * from "./presentation/CartHeader";
export * from "./presentation/CartFooter";
export * from "./presentation/CartItemRow";
export * from "./presentation/CartEmptyState";
