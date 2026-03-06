# Changelog

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
