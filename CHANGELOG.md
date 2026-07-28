# Changelog

## [1.1.0] - 2026-07-27

### Plan de Mejora, Optimización y Capa Entities FSD

- **Arquitectura FSD**: Implementación de la capa `@entities/` (`product`, `cart-item`, `order`). Se trasladaron tipos y utilidades dominiales (`stockUtils.ts`).
- **Nuevas Utilidades**:
  - `src/shared/hooks/useLocalStorage.ts`: Hook reactivo para sincronización con `localStorage`.
  - `src/features/checkout/domain/discounts.ts`: Objeto de configuración dominial `DISCOUNT_CODES`.
- **Refactorización de Hooks & Componentes**:
  - `useProducts`: Modularización en sub-hooks `useProductsQuery` y `useFlattenedProducts`.
  - `CartContext`: Persistencia automática mediante `useLocalStorage`.
  - `SkeletonCard`: Migración de clases repetitivas a la utilidad `.skeleton-line`.
- **CSS y Diseño**:
  - Eliminación de inline-styles innecesarios.
  - Corrección de clases de Tailwind obsoletas (`dark:text-slate-350`, `dark:border-slate-850`).
  - Creación de utilidades visuales (`.focus-ring`, `.skeleton-line`, `.tap-feedback`, `.icon-button`, `.spinner`).
  - Adaptación de botones a tokens de color primario (`bg-primary`, `hover:bg-primary-hover`).
- **Documentación & DX**:
  - JSDoc 100% en español con diagramas de carga `@remarks` en componentes principales (`ProductCard`, `Cart`, `Checkout`, `Navbar`, `HomeContent`).
  - Limpieza de cliente HTTP huérfano (`shared/api/httpClient.ts`) y `Navbar` duplicado.

## [1.0.0] - 2026-02-24

### Refactorización y Mejoras de Arquitectura (Fases A y B)

| Feature             | Antes                     | Después                                                   |
| :------------------ | :------------------------ | :-------------------------------------------------------- |
| **Logic Stock**     | Duplicada en Componentes  | Centralizada en `stockUtils.ts` (`getStockStatus`)        |
| **Componentes UI**  | Inline/Duplicados         | Extraídos a `QuantityControl.tsx` y `ButtonMore.tsx`      |
| **Consistencia UI** | Mezcla de EN/ES           | Unificada 100% en Español                                 |
| **Limpieza**        | Debug logs y Node imports | Eliminada `console.log` y dependencias de Node en browser |
| **Semántica**       | `loading` confuso         | `loading` vinculado a `isFetchingNextPage`                |
| **Documentación**   | Parcial                   | Guía Técnica completa en `TECHNICAL_MANUAL.md`            |

### Added

- `src/features/products/application/stockUtils.ts`: Lógica de stock centralizada.
- `src/features/products/presentation/components/ButtonMore.tsx`: Abstracción del botón de paginación.
- `src/features/products/presentation/components/QuantityControl.tsx`: Control de cantidad reutilizable.
- `src/docs/TECHNICAL_MANUAL.md`: Manual técnico detallado del proyecto.

### Changed

- Refactorizado `useProducts.ts` para eliminar fugas de logs de desarrollo y corregir semántica de carga.
- Refactorizado `ProductDetailModal.tsx` para reducir su complejidad (de 217 a ~140 líneas).
- Refactorizado `ProductCard.tsx` para usar utilidades de stock compartidas.
- Actualizada `ProductList.tsx` con soporte multi-idioma corregido.

## [0.1.0] - 2025-12-04

### Refactoring & Architecture Improvements

| Feature                    | Before                                         | After                                                                                                    |
| :------------------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Architecture**           | Flat structure (`component`, `pages`, `hooks`) | **Feature-Based Architecture** (`features/cart`, `features/products`, `features/checkout`)               |
| **Component Organization** | All components in `src/component`              | Components grouped by feature in `src/features/*/components` and generic ones in `src/components/common` |
| **State Management**       | `Checkout.jsx` contained complex reducer logic | Logic extracted to `useCheckout` hook (Separation of Concerns)                                           |
| **Performance**            | All pages loaded instantly (large bundle)      | **Lazy Loading** implemented in `AppRouter` with `Suspense`                                              |
| **Styles**                 | Mixed styles, some BEM                         | **Full BEM methodology** applied in `index.css` (verified)                                               |
| **Maintainability**        | Hard to scale, mixed responsibilities          | Highly scalable, modular, and easy to maintain                                                           |

### Added

- `src/features/checkout/hooks/useCheckout.js`: Custom hook for checkout logic.
- `TECHNICAL_DOCUMENT.md`: Detailed technical documentation.
- `TUTORIAL.md`: Step-by-step guide to recreate the project.

### Changed

- Moved all components to their respective feature folders.
- Updated `AppRouter.jsx` to use `React.lazy`.
- Updated all imports to reflect the new structure.
