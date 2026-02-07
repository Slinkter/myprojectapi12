# 📋 Lista de Archivos Pendientes de Documentación JSDoc

**Fecha**: 2026-02-07  
**Progreso Actual**: 5/42 archivos documentados (12%)  
**Archivos Pendientes**: 37/42 (88%)

---

## ✅ Archivos YA Documentados (16)

### Domain Layer - Cart (2/2)
- [x] `features/cart/domain/cartTypes.ts` ✅
- [x] `features/cart/domain/cartUtils.ts` ✅

### Application Layer - Cart (3/3)
- [x] `features/cart/application/CartContext.tsx` ✅
- [x] `features/cart/application/hooks/useCartActions.ts` ✅
- [x] `features/cart/application/hooks/useCartDrawer.ts` ✅

### Application Layer - Products (4/4)
- [x] `features/products/application/useProducts.ts` ✅
- [x] `features/products/application/types.ts` ✅
- [x] `features/products/application/useProductModal.ts` ✅
- [x] `features/products/application/ProductModalContext.tsx` ✅

### Infrastructure Layer - Products (1/1)
- [x] `features/products/infrastructure/productsApi.ts` ✅

### Presentation Layer - Products (6/6)
- [x] `features/products/presentation/Product.tsx` ✅
- [x] `features/products/presentation/ProductGrid.tsx` ✅
- [x] `features/products/presentation/ProductList.tsx` ✅
- [x] `features/products/presentation/ProductDetailModal.tsx` ✅
- [x] `features/products/presentation/SkeletonCard.tsx` ✅
- [x] `features/products/presentation/SkeletonGrid.tsx` ✅

---

## ⏳ Archivos PENDIENTES de Documentación (26)

### 🔴 ALTA PRIORIDAD (3 archivos)

#### Application Layer - Checkout
- [ ] `features/checkout/application/useCheckout.ts` ⭐ CRÍTICO
- [ ] `features/checkout/application/types.ts`
- [ ] `features/checkout/application/validation.ts`

#### Infrastructure Layer - Core
- [ ] `app/api/apiClient.ts` ⭐ CRÍTICO
- [ ] `app/config/queryClient.ts`

---

### 🟡 MEDIA PRIORIDAD (11 archivos)

#### Presentation Layer - Checkout & Cart
- [ ] `features/cart/presentation/Cart.tsx`
- [ ] `features/cart/presentation/CartIcon.tsx`
- [ ] `features/checkout/presentation/Checkout.tsx`
- [ ] `features/checkout/presentation/components/CardForm.tsx`
- [ ] `features/checkout/presentation/components/PaymentMethodRadio.tsx`

#### Pages
- [ ] `pages/Home.tsx`
- [ ] `features/checkout/presentation/CheckoutSuccess.tsx`

#### Application Layer - Theme
- [ ] `features/theme/application/ThemeContext.tsx`
- [ ] `features/theme/presentation/ThemeSwitcher.tsx`
- [ ] `components/common/ErrorMessage.tsx`
- [ ] `components/common/FeatureErrorBoundary.tsx`

---

### 🟢 BAJA PRIORIDAD (12 archivos)

#### Infrastructure/Config
- [ ] `App.tsx`
- [ ] `app/routing/AppRouter.tsx`
- [ ] `app/config/env.ts`
- [ ] `main.tsx`

#### Common Components
- [ ] `components/common/ErrorBoundary.tsx`
- [ ] `components/common/ErrorFallback.tsx`
- [ ] `components/common/Layout.tsx`
- [ ] `components/common/Loader.tsx`

#### Presentation Layer - UI Components
- [ ] `features/products/presentation/SkeletonCard.tsx`
- [ ] `features/products/presentation/SkeletonGrid.tsx`

#### Constants
- [ ] `constants/animations.ts`

#### Cart (Re-export)
- [ ] `features/cart/application/useCart.ts` (solo re-export)

---

## 📊 Resumen por Categoría

| Categoría | Total | Documentados | Pendientes | % Completo |
|-----------|-------|--------------|------------|------------|
| **Domain Layer** | 2 | 2 | 0 | 100% ✅ |
| **Application Layer** | 13 | 3 | 10 | 23% 🟡 |
| **Infrastructure Layer** | 5 | 0 | 5 | 0% ⏳ |
| **Presentation Layer** | 18 | 0 | 18 | 0% ⏳ |
| **Config/Setup** | 4 | 0 | 4 | 0% ⏳ |
| **TOTAL** | **42** | **5** | **37** | **12%** |

---

## ⏱️ Estimación de Tiempo

| Prioridad | Archivos | Tiempo Estimado |
|-----------|----------|-----------------|
| 🔴 Alta | 10 | 3-4 horas |
| 🟡 Media | 15 | 4-6 horas |
| 🟢 Baja | 12 | 3-4 horas |
| **TOTAL** | **37** | **10-14 horas** |

---

## 🎯 Plan de Acción Recomendado

### Fase 1: Críticos (3-4 horas)
1. `useProducts.ts` - Hook principal de productos
2. `useCheckout.ts` - Hook principal de checkout
3. `productsApi.ts` - API de productos
4. `apiClient.ts` - Cliente HTTP base
5. `types.ts` (Products) - Tipos de productos
6. `types.ts` (Checkout) - Tipos de checkout
7. `validation.ts` - Validaciones de checkout

### Fase 2: Application Layer (2-3 horas)
8. `useProductModal.ts`
9. `ProductModalContext.tsx`
10. `ThemeContext.tsx`
11. `queryClient.ts`

### Fase 3: Presentation Layer (4-6 horas)
12-27. Todos los componentes de presentación

### Fase 4: Config y Otros (2-3 horas)
28-37. Archivos de configuración y setup
