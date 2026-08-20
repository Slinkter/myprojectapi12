/**
 * @file index.ts
 * @description Public API barrel para la feature de Catálogo y Gestión de Productos (FSD Architecture).
 * @architecture Feature Layer - Products Public API Barrel
 */

// Domain
export * from "./domain/productTypes";
export * from "./domain/repositories/IProductRepository";
export * from "./domain/factories/ProductFactory";

// Application
export * from "./application/types";
export * from "./application/useProducts";
export * from "./application/useCategories";
export * from "./application/useProductModal";
export * from "./application/useProductModalContext";
export * from "./application/useProductSearch";
export * from "./application/ProductModalContext";
export * from "./application/ProductModalProvider";

// Infrastructure
export * from "./infrastructure/productsFirestore";
export * from "./infrastructure/FirestoreProductRepository";
export * as productsApi from "./infrastructure/productsApi";

// Presentation
export { default as ProductCard } from "./presentation/ProductCard";
export { default as ProductList } from "./presentation/ProductList";
export { default as ProductGrid } from "./presentation/ProductGrid";
export { default as ProductDetailModal } from "./presentation/ProductDetailModal";
export * from "./presentation/ProductFormModal";
export { default as SkeletonCard } from "./presentation/SkeletonCard";
export { default as SkeletonGrid } from "./presentation/SkeletonGrid";
