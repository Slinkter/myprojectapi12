# Plan de Trabajo — Documentación React SPA

**Proyecto:** myprojectapi12  
**Inicio:** 2026-07-10  
**Total archivos fuente:** 109 (43 `.ts` + 66 `.tsx`)

---

## Barra de Progreso Global

```
FASE 0 ████████████████████ 100%  Setup ✅
FASE 1 ████████████████████ 100%  JSDoc ✅ (94 files, 1287 insertions)
FASE 2 ░░░░░░░░░░░░░░░░░░░░   0%  Documentación Técnica
FASE 3 ░░░░░░░░░░░░░░░░░░░░   0%  Guía de Estudio
FASE 4 ░░░░░░░░░░░░░░░░░░░░   0%  Verificación

TOTAL  ████░░░░░░░░░░░░░░░░  25%
```

---

## Fase 0: Setup ✅

- [x] Instalar skills: `find-skills`, `jsdoc-typescript-docs`
- [x] Verificar que `docs/` está vacío — 0 archivos
- [x] Crear estructura de directorios para docs
- [x] Commit: `chore(docs): initialize docs workspace and install skills` (`f488abd`)

**Progreso:** `████████████████████ 100% ✅`

---

## Fase 1: JSDoc ✅

- [x] **A1 — Core Lib:** 16 files (shared/lib, hooks, api, constants, app/config)
- [x] **A2 — UI Primitives:** 11 files (dialog, dropdown-menu, button, card, input, label, scroll-area, sheet)
- [x] **A3 — UI Shared:** 10 files (Navbar, Layout, Loader, ErrorBoundary, ErrorFallback, ErrorMessage, EmptyState, LazyImage, ImageZoom, FeatureErrorBoundary)
- [x] **A4 — Products:** 27 files (domain, infrastructure, application, presentation, components)
- [x] **A5 — Cart:** 12 files (domain, application, hooks, presentation)
- [x] **A6 — Checkout:** 23 files (domain, application, presentation, components)
- [x] **A7 — Theme & App:** 9 files (ThemeContext, themeStorage, ThemeSwitcher, AppRouter, Home, HomeContent, App, main, vite-env)
- [x] Commit: `docs(jsdoc): add JSDoc annotations to all 108 source files` (`41a0eca`)

**Progreso:** `████████████████████ 100% ✅`

---

## Fase 1: JSDoc (8 agentes en paralelo ~30 min)

### Lote A1 — Core Lib (~10 archivos)
- [ ] `shared/lib/cn.ts`
- [ ] `shared/lib/animations.ts`
- [ ] `shared/lib/stockUtils.ts`
- [ ] `shared/lib/index.ts`
- [ ] `shared/constants/routes.ts`
- [ ] `shared/constants/queryKeys.ts`
- [ ] `shared/constants/index.ts`
- [ ] `constants/animations.ts`

### Lote A2 — Hooks & API (~9 archivos)
- [ ] `shared/api/httpClient.ts`
- [ ] `shared/api/index.ts`
- [ ] `shared/hooks/useDebounce.ts`
- [ ] `shared/hooks/useLogLifecycle.ts`
- [ ] `shared/hooks/index.ts`
- [ ] `app/api/apiClient.ts`
- [ ] `app/config/queryClient.ts`
- [ ] `app/config/env.ts`

### Lote A3 — UI Primitives (~10 archivos)
- [ ] `shared/ui/dialog.tsx`
- [ ] `shared/ui/dropdown-menu.tsx`
- [ ] `shared/ui/scroll-area.tsx`
- [ ] `shared/ui/sheet.tsx`
- [ ] `shared/ui/input.tsx`
- [ ] `shared/ui/label.tsx`
- [ ] `shared/ui/index.ts`
- [ ] `shared/ui/Button/Button.tsx`
- [ ] `shared/ui/Button/index.ts`
- [ ] `shared/ui/Card/Card.tsx`
- [ ] `shared/ui/Card/index.ts`

### Lote A4 — UI Shared (~10 archivos)
- [ ] `shared/ui/Navbar.tsx`
- [ ] `shared/ui/Layout.tsx`
- [ ] `shared/ui/Loader.tsx`
- [ ] `shared/ui/ErrorBoundary.tsx`
- [ ] `shared/ui/ErrorFallback.tsx`
- [ ] `shared/ui/ErrorMessage.tsx`
- [ ] `shared/ui/EmptyState.tsx`
- [ ] `shared/ui/LazyImage.tsx`
- [ ] `shared/ui/ImageZoom.tsx`
- [ ] `shared/ui/FeatureErrorBoundary.tsx`

### Lote A5 — Products (~25 archivos)
- [ ] `features/products/domain/productTypes.ts`
- [ ] `features/products/infrastructure/productsApi.ts`
- [ ] `features/products/application/types.ts`
- [ ] `features/products/application/useProducts.ts`
- [ ] `features/products/application/useCategories.ts`
- [ ] `features/products/application/useProductModal.ts`
- [ ] `features/products/application/useProductModalContext.ts`
- [ ] `features/products/application/ProductModalContext.ts`
- [ ] `features/products/application/ProductModalProvider.tsx`
- [ ] `features/products/presentation/type.ts`
- [ ] `features/products/presentation/ProductCard.tsx`
- [ ] `features/products/presentation/ProductDetailModal.tsx`
- [ ] `features/products/presentation/ProductGrid.tsx`
- [ ] `features/products/presentation/ProductList.tsx`
- [ ] `features/products/presentation/SkeletonCard.tsx`
- [ ] `features/products/presentation/SkeletonGrid.tsx`
- [ ] `features/products/presentation/components/useProductSearch.ts`
- [ ] `features/products/presentation/components/SearchInput.tsx`
- [ ] `features/products/presentation/components/QuantityControl.tsx`
- [ ] `features/products/presentation/components/ProductStockInfo.tsx`
- [ ] `features/products/presentation/components/ProductPriceSection.tsx`
- [ ] `features/products/presentation/components/ProductImageGallery.tsx`
- [ ] `features/products/presentation/components/ProductHeader.tsx`
- [ ] `features/products/presentation/components/ModalCloseButton.tsx`
- [ ] `features/products/presentation/components/LoadMoreSection.tsx`
- [ ] `features/products/presentation/components/LoadMoreButton.tsx`
- [ ] `features/products/presentation/components/AddToCartActions.tsx`

### Lote A6 — Cart (~8 archivos)
- [ ] `features/cart/domain/cartTypes.ts`
- [ ] `features/cart/domain/cart.types.ts`
- [ ] `features/cart/domain/cartUtils.ts`
- [ ] `features/cart/application/CartContext.tsx`
- [ ] `features/cart/application/useCart.ts`
- [ ] `features/cart/application/hooks/useCartDrawer.ts`
- [ ] `features/cart/application/hooks/useCartActions.ts`
- [ ] `features/cart/presentation/Cart.tsx`
- [ ] `features/cart/presentation/CartHeader.tsx`
- [ ] `features/cart/presentation/CartFooter.tsx`
- [ ] `features/cart/presentation/CartItemRow.tsx`
- [ ] `features/cart/presentation/CartEmptyState.tsx`

### Lote A7 — Checkout (~23 archivos)
- [ ] `features/checkout/domain/formatters.ts`
- [ ] `features/checkout/application/types.ts`
- [ ] `features/checkout/application/useCheckout.ts`
- [ ] `features/checkout/application/validation.ts`
- [ ] `features/checkout/application/checkoutReducer.ts`
- [ ] `features/checkout/application/useDiscountValidation.ts`
- [ ] `features/checkout/presentation/Checkout.tsx`
- [ ] `features/checkout/presentation/CheckoutSuccess.tsx`
- [ ] `features/checkout/presentation/CheckoutHeader.tsx`
- [ ] `features/checkout/presentation/CardForm.tsx`
- [ ] `features/checkout/presentation/CardInputField.tsx`
- [ ] `features/checkout/presentation/OrderSummary.tsx`
- [ ] `features/checkout/presentation/PaymentMethodRadio.tsx`
- [ ] `features/checkout/presentation/PaymentMethodSelector.tsx`
- [ ] `features/checkout/presentation/SecurityBadge.tsx`
- [ ] `features/checkout/presentation/PaymentFormContainer.tsx`
- [ ] `features/checkout/presentation/PaymentSubmitButton.tsx`
- [ ] `features/checkout/presentation/components/PriceRow.tsx`
- [ ] `features/checkout/presentation/components/OrderItemRow.tsx`
- [ ] `features/checkout/presentation/components/DiscountInput.tsx`
- [ ] `features/checkout/presentation/components/CheckoutSteps.tsx`
- [ ] `features/checkout/presentation/components/CardTypeIndicator.tsx`
- [ ] `features/checkout/presentation/components/AppliedDiscountBadge.tsx`

### Lote A8 — Theme & App Root (~8 archivos)
- [ ] `features/theme/application/ThemeContext.tsx`
- [ ] `features/theme/infrastructure/themeStorage.ts`
- [ ] `features/theme/presentation/ThemeSwitcher.tsx`
- [ ] `app/routing/AppRouter.tsx`
- [ ] `pages/Home.tsx`
- [ ] `pages/HomeContent.tsx`
- [ ] `src/App.tsx`
- [ ] `src/main.tsx`
- [ ] `src/vite-env.d.ts`

**Progreso JSDoc:** `████░░░░░░░░░░░░░░░░ 20%`

### Commit Fase 1
```
docs(core): add JSDoc to shared lib, hooks, api, and constants
docs(ui): add JSDoc to shared ui components
docs(features): add JSDoc to products, cart, checkout, and theme
docs(app): add JSDoc to app routing, pages, and root files
```

---

## Fase 2: Documentación Técnica (~15 archivos)

- [ ] `docs/README.md` — Índice general
- [ ] `docs/architecture/OVERVIEW.md` — Visión general del proyecto
- [ ] `docs/architecture/TECH-STACK.md` — Stack tecnológico
- [ ] `docs/api/API-CLIENT.md` — Cliente HTTP y configuración
- [ ] `docs/api/PRODUCTS-API.md` — Endpoints de productos
- [ ] `docs/api/API-REFERENCE.md` — Referencia de API
- [ ] `docs/features/CART.md` — Feature de carrito
- [ ] `docs/features/CHECKOUT.md` — Feature de checkout
- [ ] `docs/features/PRODUCTS.md` — Feature de productos
- [ ] `docs/features/THEME.md` — Feature de tema
- [ ] `docs/components/UI-KIT.md` — Biblioteca de componentes
- [ ] `docs/patterns/HOOKS.md` — Patrones de custom hooks
- [ ] `docs/patterns/CONTEXTS.md` — Patrones de contextos
- [ ] `docs/operations/DEPLOYMENT.md` — Despliegue
- [ ] `docs/operations/TROUBLESHOOTING.md` — Solución de problemas

**Progreso Docs Técnicos:** `████░░░░░░░░░░░░░░░░ 20%`

### Commit Fase 2
```
docs(architecture): generate technical documentation for architecture, api, and features
```

---

## Fase 3: Guía de Estudio (~13 archivos)

- [ ] `docs/study/README.md` — Ruta de aprendizaje
- [ ] `docs/study/00-PRERREQUISITOS.md` — Node, pnpm, Git, VS Code
- [ ] `docs/study/01-INICIO-RAPIDO.md` — Clonar, instalar, ejecutar
- [ ] `docs/study/02-ESTRUCTURA.md` — FSD: capas y regla de dependencia
- [ ] `docs/study/03-TECNOLOGIAS.md` — React, TypeScript, Vite, Tailwind v4
- [ ] `docs/study/04-ALGORITMOS.md` — Algoritmos y patrones de datos
- [ ] `docs/study/05-CUSTOM-HOOKS.md` — Custom hooks explicados
- [ ] `docs/study/06-ESTADO-GLOBAL.md` — Estado global (Context vs TanStack Query)
- [ ] `docs/study/07-FLUIDO-COMPRA.md` — Flujo de compra completo
- [ ] `docs/study/08-COMPONENTES-UI.md` — Componentes y composición
- [ ] `docs/study/09-ESTILOS.md` — Tailwind v4 y dark mode
- [ ] `docs/study/10-API-Y-DATOS.md` — Consumo de API externa
- [ ] `docs/study/11-DESPLIEGUE.md` — CI/CD con GitHub Actions
- [ ] `docs/study/12-EJERCICIOS.md` — Ejercicios progresivos
- [ ] `docs/study/GLOSARIO.md` — Glosario de términos

**Progreso Guía Estudio:** `████░░░░░░░░░░░░░░░░ 20%`

### Commit Fase 3
```
docs(study): create learning guide with algorithms, custom hooks, and progressive exercises
```

---

## Fase 4: Verificación (5 min)

- [ ] `pnpm lint` — 0 errores
- [ ] `pnpm type-check` — 0 errores
- [ ] `pnpm build` — Build exitoso

**Progreso Verificación:** `████░░░░░░░░░░░░░░░░ 20%`

### Commit Fase 4
```
ci: verify build, lint, and type-check pass after full documentation
```

---

## Barra de Progreso Final

```
FASE 0 ████████████████████ 100%  Setup
FASE 1 ████████████████████ 100%  JSDoc
FASE 2 ████████████████████ 100%  Docs Técnicos
FASE 3 ████████████████████ 100%  Guía Estudio
FASE 4 ████████████████████ 100%  Verificación

TOTAL  ████████████████████ 100%  COMPLETADO
```

---

## Notas

- Si se interrumpe la ejecución, retomar desde la última fase marcada.
- Cada commit semántico permite rastrear el progreso con `git log --oneline`.
- 8 agentes JSDoc se ejecutan en paralelo para minimizar tiempo real.
- Archivos de documentación se generan a partir del JSDoc ya insertado.
