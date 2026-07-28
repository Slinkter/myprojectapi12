# PLAN DE MEJORA, OPTIMIZACION Y REFACTOR — myprojectapi12

> **Modo de ejecucion:** Seguir el orden de fases. Despues de CADA fase ejecutar:
> `pnpm lint && pnpm type-check && pnpm build`
> Si algo falla, corregir antes de continuar.
>
> **Package manager:** pnpm (nunca npm). Scripts: `pnpm dev | build | lint | type-check | deploy`
> **ESLint:** `--max-warnings 2`. No acumular warnings.
> **Pre-commit:** `pnpm lint && pnpm type-check`
> **JSDoc:** Siempre en espanol. Usar bloques `/** ... */`.
> **Tailwind v4:** No crear `tailwind.config.js` ni `postcss.config.js`.
> **Aliases:** `@/`, `@shared/`, `@features/`, `@pages/`, `@widgets/`, `@entities/`

---

## FASE 0 — Quick wins (bugs latentes, 5 minutos)

4 ediciones puntuales que arreglan clases Tailwind inexistentes (no-ops silenciosos).

| #   | Archivo                                                  | Cambio                                        |
| --- | -------------------------------------------------------- | --------------------------------------------- |
| 0.1 | `src/shared/ui/Button/Button.tsx:15`                     | `dark:text-slate-350` -> `dark:text-slate-300` |
| 0.2 | `src/features/checkout/presentation/PaymentFormContainer.tsx:54` | `dark:border-slate-850` -> `dark:border-slate-800` |
| 0.3 | `src/features/checkout/presentation/components/OrderItemRow.tsx:33` | `dark:border-slate-850` -> `dark:border-slate-800` |
| 0.4 | `src/features/checkout/presentation/components/OrderSummary.tsx:92` | `dark:border-slate-850` -> `dark:border-slate-800` |

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build` sin errores.

---

## FASE 1 — Consolidacion de duplicados (20 minutos)

### 1.1 Eliminar Navbar huerfano

1. Ejecutar `grep -r "shared/ui/Navbar" src/` para confirmar 0 referencias activas.
2. Borrar `src/shared/ui/Navbar.tsx`.
3. El canonico es `src/widgets/Navbar.tsx` (importado en `src/shared/ui/Layout.tsx:8`).

### 1.2 Consolidar clientes HTTP

Estado actual:
- `src/app/api/apiClient.ts` -> usado por `src/features/products/infrastructure/productsApi.ts`.
- `src/shared/api/httpClient.ts` -> SIN USO, estilo objeto.

Pasos:
1. Ejecutar `grep -r "shared/api/httpClient" src/` para confirmar 0 resultados.
2. Borrar `src/shared/api/httpClient.ts`.
3. Borrar `src/shared/api/index.ts` (solo reexportaba httpClient).
4. Verificar que `src/shared/lib/` y `src/shared/hooks/` NO importan de `shared/api`.
5. Ejecutar `pnpm lint && pnpm type-check && pnpm build`.

### 1.3 Reducir verbosidad en hooks de productos

Archivo: `src/features/products/application/useProducts.ts`

Separar en dos hooks internos:
- `useProductsQuery(category)` -> solo `useInfiniteQuery` (puro, sin transformar).
- `useFlattenedProducts(query)` -> `useMemo` que aplana `data?.pages.flatMap(...)`.

El hook publico `useProducts(category)` orquesta ambos y retorna la API publica completa.

### 1.4 Hook reutilizable `useLocalStorage`

Crear `src/shared/hooks/useLocalStorage.ts`:
- Generico `(key: string, initialValue: T) => [T, (value: T) => void]`
- Lee de `localStorage` al montar, serializa/deserializa con `JSON`.
- Reemplaza la logica manual en `src/features/cart/application/CartContext.tsx` (linea ~20, el `useEffect` de persistencia).
- Reemplaza la lectura inicial en `src/features/theme/infrastructure/themeStorage.ts`.

### 1.5 Actualizar barrel exports

Despues de los cambios, actualizar `src/shared/hooks/index.ts` para exportar los nuevos hooks.

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build`

---

## FASE 2 — Crear capa `entities/` (FSD completa, 60 minutos)

> El alias `@entities/` ya existe en `vite.config.js` y `tsconfig.json` pero la
> carpeta `src/entities/` no existe. Cumplimos la promesa arquitectonica.

### 2.1 Crear estructura de directorios

```
src/entities/
  product/
    model/
      types.ts          <- mover IProduct, IProductsApiResponse
    index.ts            <- re-export publico
  cart-item/
    model/
      types.ts          <- ICartItem (estaba duplicado en features)
    index.ts
  order/
    model/
      types.ts          <- IOrder, IOrderItem
    index.ts
```

### 2.2 Migrar tipos de productos

1. Crear `src/entities/product/model/types.ts` con:
   ```ts
   export interface IProduct {
     id: number;
     title: string;
     description: string;
     price: number;
     discountPercentage?: number;
     rating?: number;
     stock: number;
     brand?: string;
     category?: string;
     thumbnail: string;
     images?: string[];
   }

   export interface IProductsApiResponse {
     products: IProduct[];
     total: number;
     skip: number;
     limit: number;
   }
   ```

2. Crear `src/entities/product/index.ts`:
   ```ts
   export type { IProduct, IProductsApiResponse } from "./model/types";
   ```

3. Actualizar `src/shared/types/product.ts` para que sea un re-export temporal:
   ```ts
   export type { IProduct, IProductsApiResponse } from "@/entities/product";
   ```

4. Actualizar `src/features/products/domain/productTypes.ts` para importar de `@/entities/product`.

### 2.3 Migrar tipos de cart-item

1. Crear `src/entities/cart-item/model/types.ts` con `ICartItem`.
2. Crear `src/entities/cart-item/index.ts`.
3. Actualizar `src/features/cart/domain/cartTypes.ts` para importar `ICartItem` desde `@/entities/cart-item`.
4. Actualizar `src/features/checkout/application/types.ts` para importar `ICartItem` desde `@/entities/cart-item` (elimina la duplicacion de la interfaz en linea ~4).

### 2.4 Migrar stockUtils

1. Mover `src/shared/lib/stockUtils.ts` a `src/entities/product/model/stockUtils.ts`.
2. Actualizar imports en `src/features/cart/domain/cartUtils.ts` (usa `validateCartItem`).
3. Actualizar `src/shared/lib/index.ts` si reexportaba `stockUtils`.

### 2.5 Eliminar re-exports temporales

1. Ejecutar `grep -r "shared/types/product" src/` y migrar todos los imports restantes a `@/entities/product`.
2. Cuando no queden imports, borrar `src/shared/types/product.ts`.

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build`
**Criterio:** `@/shared/types/product` no se importa en ningun archivo de `features/`.

---

## FASE 3 — Refactor de hooks (45 minutos)

### 3.1 Refactorizar `useCheckout`

Archivo: `src/features/checkout/application/useCheckout.ts` (~120 lineas, 7 responsabilidades).

Crear 3 hooks internos:

**`src/features/checkout/application/hooks/useCheckoutReducer.ts`**:
- Estado puro + dispatch.
- Exporta `checkoutReducer`, `initialState`, y el hook `useCheckoutReducer()`.
- Retorna `{ state, dispatch }`.

**`src/features/checkout/application/hooks/useCheckoutValidation.ts`**:
- Recibe `state` del reducer.
- Retorna errores derivados con `useMemo`.
- Exporta `useCheckoutValidation(state)`.

**`src/features/checkout/application/hooks/useCheckoutSubmit.ts`**:
- Genera `ORD-{timestamp}-{random}` order ID.
- Llama `clearCart()` del carrito.
- Navega a `/checkout-success` con state.
- Exporta `useCheckoutSubmit({ state, hasErrors })`.

**`useCheckout.ts`** queda como orquestador puro (~30 lineas):
```ts
export function useCheckout(): IUseCheckoutReturn {
  const { state, dispatch } = useCheckoutReducer();
  const errors = useCheckoutValidation(state);
  const { submitOrder, isSubmitting } = useCheckoutSubmit({ state, hasErrors: Object.keys(errors).length > 0 });
  // ... retorna API publica
}
```

### 3.2 Limpiar `useDiscountValidation`

Archivo: `src/features/checkout/application/useDiscountValidation.ts`

1. Extraer `DISCOUNT_CODES` a `src/features/checkout/domain/discounts.ts`:
   ```ts
   export const DISCOUNT_CODES: Record<string, { type: "percent" | "fixed"; value: number }> = {
     WELCOME10: { type: "percent", value: 10 },
     SAVE5:     { type: "fixed",   value: 5 },
     VIP20:     { type: "percent", value: 20 },
   };
   ```

2. Unificar el return del hook en un solo objeto:
   ```ts
   interface DiscountResult {
     status: "idle" | "validating" | "valid" | "invalid";
     message: string;
     appliedCode: string | null;
     discountAmount: number;
   }
   ```

### 3.3 Crear `useMediaQuery` (opcional, baja prioridad)

Crear `src/shared/hooks/useMediaQuery.ts`:
- `useMediaQuery(query: string) => boolean`
- Para sustituir `useReducedMotion` de framer-motion en sitios donde solo se lee el valor (sin animar).

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build`

---

## FASE 4 — Utilities CSS y migracion de tokens (45 minutos)

### 4.1 Anadir utilities CSS nuevas

Archivo: `src/index.css`

Anadir despues de las clases existentes (antes del cierre del archivo):

```css
@layer components {
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-ring focus-visible:ring-offset-2
           focus-visible:ring-offset-background;
  }

  .skeleton-line {
    @apply animate-pulse rounded-md bg-slate-200 dark:bg-slate-800;
  }

  .tap-feedback {
    @apply active:scale-95 transition-transform duration-150;
  }

  .icon-button {
    @apply focus-ring tap-feedback inline-flex items-center justify-center
           rounded-md p-2 text-muted-foreground
           hover:text-foreground hover:bg-accent/40;
  }

  .spinner {
    @apply inline-block h-4 w-4 animate-spin rounded-full
           border-2 border-current border-r-transparent;
  }
}
```

### 4.2 Limpiar estilos inline evitables (4 archivos)

| Archivo:Lina                                | Cambio                                      |
| ------------------------------------------- | ------------------------------------------- |
| `src/pages/HomeContent.tsx:97`              | `style={{ width: "100%" }}` -> `className="w-full"` |
| `src/shared/ui/EmptyState.tsx:55`           | `style={{ maxWidth: "320px" }}` -> `className="max-w-[320px]"` |
| `src/features/products/presentation/ProductGrid.tsx:31` | `style={{ height: "100%" }}` -> `className="h-full"` |
| `src/features/products/presentation/ProductList.tsx:53` | `style={{ minHeight: "400px" }}` -> `className="min-h-[400px]"` |

Los 5 estilos inline restantes son DINAMICOS y se conservan (dropdown position, image zoom, safe-area insets).

### 4.3 Sustituir duplicados por utilities

**`.focus-ring`** reemplaza en estos archivos el patron `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30`:
- `src/widgets/Navbar.tsx`
- `src/features/cart/presentation/CartHeader.tsx`
- `src/features/cart/presentation/Cart.tsx`
- `src/features/checkout/presentation/CheckoutHeader.tsx`
- `src/features/products/presentation/components/SearchInput.tsx`
- `src/features/products/presentation/components/QuantityControl.tsx`
- `src/features/products/presentation/ProductDetailModal.tsx`
- `src/features/products/presentation/ProductCard.tsx`
- `src/features/checkout/presentation/Checkout.tsx`
- `src/features/checkout/presentation/components/CardForm.tsx`
- `src/features/products/presentation/components/ModalCloseButton.tsx`

**`.skeleton-line`** reemplaza en `src/features/products/presentation/SkeletonCard.tsx` las 7 ocurrencias de `animate-pulse rounded-md bg-slate-200 dark:bg-slate-800`.

**`.spinner`** reemplaza en:
- `src/shared/ui/Loader.tsx`
- `src/features/products/presentation/components/LoadMoreButton.tsx`
- `src/features/checkout/presentation/PaymentSubmitButton.tsx`

### 4.4 Migrar hex hardcoded a tokens semanticos

Cada archivo que usa `bg-emerald-600`/`hover:bg-emerald-700` se migra a `bg-primary`/`hover:bg-primary-hover`:

| Archivo                                           | Cambio                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `src/shared/ui/Button/Button.tsx`                 | `bg-emerald-600 hover:bg-emerald-700` -> `bg-primary hover:bg-primary-hover` |
| `src/shared/ui/Button/Button.tsx`                 | `text-emerald-600` (ghost) -> `text-primary`                |
| `src/features/products/presentation/ProductCard.tsx:170` | `bg-emerald-600` -> `bg-primary`                            |
| `src/features/products/presentation/ProductCard.tsx:204` | `border-emerald-600` -> `border-primary`                    |
| `src/features/products/presentation/components/AddToCartActions.tsx` | `bg-emerald-600` -> `bg-primary`                   |
| `src/features/cart/presentation/Cart.tsx`        | `text-emerald-600` -> `text-primary`                        |
| `src/features/checkout/presentation/CheckoutSuccess.tsx` | `text-emerald-600` -> `text-primary`                  |

Focus rings (ya cubierto por `.focus-ring` usando `ring-ring` token).

**Resultado:** cambiar `--color-primary` en `src/index.css:6` propaga el color a toda la app.

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build`

---

## FASE 5 — JSDoc completo (90 minutos)

### Convenciones (del skill `jsdoc-typescript-docs` en `.agent:222-248`)

**Sobre la interfaz de props:**
```ts
/**
 * Props para el componente X.
 * @interface IXProps
 */
interface IXProps {
  /** Identificador unico del producto. */
  id: number;
  /** Callback al confirmar la seleccion. */
  onSelect: (id: number) => void;
}
```

**Sobre el componente:**
```ts
/**
 * @component X
 * Renderiza una tarjeta visual con la informacion esencial del producto.
 *
 * @param {IXProps} props - Props tipadas (ver {@link IXProps}).
 * @returns {JSX.Element} Elemento JSX renderizado.
 * @see {@link IXProps}
 *
 * @example
 * ```tsx
 * <X id={1} onSelect={(id) => console.log(id)} />
 * ```
 */
```

### 5.1 Archivos MISSING (5) — JSDoc completo nuevo

Cada archivo recibe: `@file`, `@description`, `@component`, `@param`, `@returns`, `@see {@link XProps}`, `@example`.

| Archivo                                                             | Notas                                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/features/products/presentation/ProductCard.tsx`                | El componente mas grande del proyecto. Documentar animacion hover, LazyImage, modal, carrito. |
| `src/features/products/presentation/ProductDetailModal.tsx`         | Mencionar AnimatePresence, portal, galeria de imagenes.                 |
| `src/features/products/presentation/ProductGrid.tsx`                | Mencionar memo, whileInView, useReducedMotion.                          |
| `src/features/cart/presentation/CartItemRow.tsx`                    | Documentar props: `item` (ICartItem), `onRemove` (callback).            |
| `src/features/checkout/presentation/CheckoutSuccess.tsx`            | Documentar interfaz interna `OrderState` (linea 14).                    |

### 5.2 Archivos WEAK (8) — Upgrade a formato completo

| Archivo                                                             | Faltante                                            |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| `src/features/products/presentation/components/AddToCartActions.tsx` | Anadir `@param` por prop + `@returns` + `@example`. |
| `src/features/products/presentation/components/QuantityControl.tsx`  | Idem.                                               |
| `src/features/products/presentation/components/SearchInput.tsx`      | Quitar duplicacion de docs. Anadir `@returns`.      |
| `src/features/checkout/presentation/components/CardTypeIndicator.tsx`| Anadir `@param`/`@returns`.                         |
| `src/features/checkout/presentation/components/CardInputField.tsx`   | Idem.                                               |
| `src/features/checkout/presentation/components/CardForm.tsx`         | Idem.                                               |
| `src/features/checkout/presentation/components/AppliedDiscountBadge.tsx` | Idem.                                          |
| `src/features/products/presentation/SkeletonCard.tsx`                | Anadir `@file` y `@description`.                    |

### 5.3 Diagramas de carga de componentes (`@remarks`)

Para los 5 componentes principales, anadir bloque `@remarks` con la secuencia de carga:

**ProductCard:**
```ts
/**
 * @remarks
 * **Secuencia de carga:**
 * 1. Recibe props (`product`) desde `ProductGrid` (padre).
 * 2. `useReducedMotion` (framer-motion) -> decide si desactiva animaciones.
 * 3. `m.div` con `variants` aplica `initial="hidden"` en espera de viewport.
 * 4. `whileInView="visible"` dispara animacion de entrada.
 * 5. `<LazyImage>` carga la imagen diferida (IntersectionObserver).
 * 6. Click en "Detalles" -> `useProductModal().openModal(product)`.
 * 7. El modal (`ProductDetailModal`) se monta en portal con `AnimatePresence`.
 * 8. Click en "Anadir" -> `useCart().addToCart(product)` -> toast + drawer.
 *
 * Dependencias: useReducedMotion, useProductModal, useCart, LazyImage.
 */
```

**Cart (drawer):**
```ts
/**
 * @remarks
 * **Secuencia de carga:**
 * 1. `CartContext` provee `isDrawerOpen` + `closeDrawer`.
 * 2. `AnimatePresence mode="wait"` controla entrada/salida del drawer.
 * 3. Backdrop con `motion.div` -> fade-in.
 * 4. Panel con `motion.div` -> slide-in desde la derecha (`x: "100%"` -> `x: 0`).
 * 5. `CartHeader` renderiza titulo + boton cerrar.
 * 6. `Cart` lista items via `useCart().items`.
 * 7. `CartItemRow` por cada item (con boton eliminar).
 * 8. `CartFooter` muestra total + boton checkout.
 * 9. Click en checkout -> `navigate("/checkout")`.
 */
```

**Checkout:**
```ts
/**
 * @remarks
 * **Secuencia de carga:**
 * 1. `useCheckout()` orquesta reducer + validacion + submit.
 * 2. `CheckoutHeader` muestra pasos visuales (`CheckoutSteps`).
 * 3. `PaymentMethodSelector` -> usuario elige visa/mastercard/bitcoin.
 * 4. `PaymentFormContainer` -> `CardForm` si es tarjeta, o mensaje si es bitcoin.
 * 5. `DiscountInput` -> `useDiscountValidation()` valida codigo async (500ms delay).
 * 6. `OrderSummary` muestra items + subtotal + descuento + total.
 * 7. `PaymentSubmitButton` -> validacion + `useCheckoutSubmit()` -> navigate.
 * 8. `CheckoutSuccess` recibe orderId via `useLocation().state`.
 */
```

**Navbar:**
```ts
/**
 * @remarks
 * **Secuencia de carga:**
 * 1. `useCart()` -> lee items para badge de cantidad.
 * 2. `useTheme()` -> lee estado para toggle sun/moon.
 * 3. `useCategories()` -> carga categorias de la API.
 * 4. `Link` (react-router) -> navegacion interna.
 * 5. Busqueda: input expand-on-click -> dispatch de evento `input` en HomeContent.
 * 6. Categorias: dropdown animado con `AnimatePresence` + `layoutId`.
 * 7. Tema: `ThemeSwitcher` -> `toggleDarkMode()`.
 * 8. Carrito: badge con `m.span animate={{ scale }}` -> click abre drawer.
 * 9. Mobile: hamburger menu con `AnimatePresence` -> `motion.nav` slide-down.
 */
```

**Home:**
```ts
/**
 * @remarks
 * **Secuencia de carga:**
 * 1. `ProductModalProvider` envuelve todo (context para modal de detalle).
 * 2. `FeatureErrorBoundary` atrapa errores de la feature Products.
 * 3. `HomeContent` lee `category` de URL via `useSearchParams`.
 * 4. `SearchInput` -> debounce de 350ms via `useDebounce`.
 * 5. Hero section -> `m.div` con `slideUp` animation.
 * 6. `ProductList` -> `useProducts(category)` -> `useInfiniteQuery`.
 * 7. `ProductGrid` -> `m.div` con `whileInView` para lazy render.
 * 8. `ProductCard` por cada producto (lazy render via viewport).
 * 9. Click en card -> `ProductDetailModal` (portal + AnimatePresence).
 */
```

**Verificacion:** `pnpm lint && pnpm type-check && pnpm build`

---

## FASE 6 — Verificacion final (10 minutos)

1. Ejecutar `pnpm lint` y confirmar 0 warnings (ideal) o <= 2 warnings.
2. Ejecutar `pnpm type-check` y confirmar 0 errores.
3. Ejecutar `pnpm build` y confirmar que genera `dist/` sin errores.
4. Ejecutar `pnpm dev` y verificar visualmente:
   - Home carga productos.
   - Busqueda funciona.
   - Toggle tema funciona (light/dark).
   - Carrito abre/cierra.
   - Checkout completa el flujo.
   - CheckoutSuccess muestra orderId.
5. Verificar que el color primario (verde `#059669`) no cambio visualmente.

---

## Orden de ejecucion

```
FASE 0  ->  5 min   (4 ediciones puntuales)
FASE 1  ->  20 min  (Navbar + httpClient + useProducts + useLocalStorage)
FASE 4.1 -> 15 min  (anadir utilities CSS)
FASE 4.2 -> 10 min  (limpiar 4 inline styles)
FASE 4.3 -> 30 min  (sustituir duplicados por utilities)
FASE 4.4 -> 30 min  (migrar hex -> tokens; delicado, toca ~8 archivos)
FASE 2   -> 60 min  (crear entities/, mover tipos)
FASE 3   -> 45 min  (hooks extraction)
FASE 5   -> 90 min  (JSDoc completo en 13 archivos + diagramas de carga)
FASE 6   -> 10 min  (verificacion final)
```

**Total estimado:** ~5 horas.

---

## Riesgos

| Riesgo                                                  | Mitigacion                                                |
| ------------------------------------------------------- | --------------------------------------------------------- |
| Tokens semanticos rompen el visual                      | Verificar que `--color-primary: #059669` se mantiene.     |
| Migrar `entities/` rompe imports                        | Paso a paso: crear rutas, anadir re-exports, type-check, borrar viejo. |
| Cambiar `Button` rompe variantes en muchos sitios       | Migrar un variant a la vez, probar despues de cada uno.   |
| JSDoc en espanol puede chocar con herramientas          | El repo ya esta 100% en espanol, sin riesgo.              |
| `pnpm lint` acumula warnings durante el refactor       | Limpiar warnings despues de CADA fase, no al final.       |

---

## Metricas de exito

- **Codigo:** ~150-200 lineas menos (httpClient muerto, Navbar huerfano, duplicados en SkeletonCard).
- **Mantenibilidad:** cambiar el color primario toca 1 linea (`index.css:6`) en vez de ~15 ediciones.
- **Documentacion:** 0 archivos MISSING, 0 archivos WEAK, 5 archivos con `@remarks` de carga.
- **Lint:** 0 warnings.
- **Arquitectura:** capa `entities/` completa; features no importan tipos de otras features.
