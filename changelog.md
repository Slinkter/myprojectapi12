# Changelog

## [Unreleased] - 2025-12-04

### Refactoring & Architecture Improvements

| Feature | Before | After |
| :--- | :--- | :--- |
| **Architecture** | Flat structure (`component`, `pages`, `hooks`) | **Feature-Based Architecture** (`features/cart`, `features/products`, `features/checkout`) |
| **Component Organization** | All components in `src/component` | Components grouped by feature in `src/features/*/components` and generic ones in `src/components/common` |
| **State Management** | `Checkout.jsx` contained complex reducer logic | Logic extracted to `useCheckout` hook (Separation of Concerns) |
| **Performance** | All pages loaded instantly (large bundle) | **Lazy Loading** implemented in `AppRouter` with `Suspense` |
| **Styles** | Mixed styles, some BEM | **Full BEM methodology** applied in `index.css` (verified) |
| **Maintainability** | Hard to scale, mixed responsibilities | Highly scalable, modular, and easy to maintain |

### Added
- `src/features/checkout/hooks/useCheckout.js`: Custom hook for checkout logic.
- `TECHNICAL_DOCUMENT.md`: Detailed technical documentation.
- `TUTORIAL.md`: Step-by-step guide to recreate the project.

### Changed
- Moved all components to their respective feature folders.
- Updated `AppRouter.jsx` to use `React.lazy`.
- Updated all imports to reflect the new structure.
