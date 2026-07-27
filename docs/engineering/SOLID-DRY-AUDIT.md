# Auditoría SOLID + DRY

Análisis de cumplimiento de principios SOLID (*Clean Architecture*, Robert C. Martin) y DRY (*Code Complete*, Steve McConnell) con ejemplos concretos del código.

---

## S — Single Responsibility Principle (SRP)

> Una clase/módulo debe tener una única razón para cambiar.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`useCartActions`** — Solo gestiona acciones del carrito (add, remove, update, clear). No sabe de UI ni de la API |
| ✅ | **`ProductCard`** — Solo renderiza la tarjeta de un producto. No sabe de fetching ni de rutas |
| ✅ | **`checkoutReducer`** — Solo muta el estado del checkout. No sabe de validación ni de UI |
| ✅ | **`apiClient`** — Solo hace peticiones HTTP. No sabe de React ni de componentes |
| ❌ | **`Navbar.tsx`** — Maneja logo, navegación, búsqueda, categorías, tema, carrito Y menú móvil. 600 líneas. Tiene al menos 4 responsabilidades |
| ❌ | **`Cart.tsx`** — Drawer que maneja UI, lógica de negocio (precios, envío) y navegación. Mezcla presentación con lógica |

**Recomendación**: Extraer `Navbar` en componentes más pequeños (NavSearch, NavCategories, NavActions, MobileMenu). Separar lógica de precios de `Cart.tsx`.

---

## O — Open/Closed Principle (OCP)

> Las entidades deben estar abiertas para extensión, cerradas para modificación.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`Button` (CVA)** — Se extiende agregando variantes sin modificar el código existente. Solo se agrega un nuevo objeto en `variants` |
| ✅ | **`animations.ts`** — Se agregan nuevas variantes de animación sin modificar las existentes |
| ✅ | **`cartUtils.ts`** — `calculateTotal`, `addItemToCart`, `removeItemFromCart` son funciones puras que se extienden componiéndolas |
| ✅ | **`ErrorBoundary` + `FeatureErrorBoundary`** — Atrapan errores sin modificar componentes internos |
| ❌ | **`useCheckout.ts`** — Para agregar un nuevo método de pago, hay que modificar la lógica interna de `handlePayment` y `isPaymentDisabled` |

**Recomendación**: Extraer métodos de pago a una estrategia (Strategy Pattern) para que cada método sea una clase independiente.

---

## L — Liskov Substitution Principle (LSP)

> Las subclases deben poder sustituir a sus clases base sin alterar el comportamiento.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`ICartItem extends IProduct`** — Añade `quantity` sin alterar el contrato de `IProduct`. Usable donde se espera `IProduct` |
| ✅ | **Componentes de Radix** — Dialog, Sheet, DropdownMenu siguen la interfaz estándar de Radix y son intercambiables |
| ✅ | **`Button` variants (cva)** — Todas las variantes producen un `<button>`, intercambiables |
| ✅ | **`ErrorFallback` y `ErrorMessage`** — Ambos implementan la misma interfaz de presentación de errores |

**No se encontraron violaciones de LSP.**

---

## I — Interface Segregation Principle (ISP)

> Interfaces pequeñas y específicas mejor que una interfaz general.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`IProductDetailModalProps`** — Solo 3 props: `product`, `isOpen`, `onClose`. Nada más |
| ✅ | **`IProductGridProps`** — Solo `products: IProduct[]`. Mínimo necesario |
| ✅ | **`IValidationResult`** — Solo `isValid` y `error`. Simple y específico |
| ✅ | **`ICartItem extends IProduct`** — No fuerza a usar propiedades que no se necesitan |
| ❌ | **`ICartContextValue`** — 9 propiedades y 7 métodos. El `CartItemRow` solo necesita `updateQuantity`, pero recibe todo el contexto. Violación menor |
| ❌ | **`IUseCheckoutReturn`** — 7 propiedades. Si un test quiere solo `errors`, igual recibe todo |

**Recomendación**: Usar hooks más pequeños. `CartItemRow` podría recibir `updateQuantity` como prop en lugar de consumir todo el contexto.

---

## D — Dependency Inversion Principle (DIP)

> Depender de abstracciones, no de concreciones.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`apiClient`** — Depende del tipo `IProductsApiResponse`, no de la implementación concreta de fetch |
| ✅ | **`useProducts`** — Depende de `productsApi` (interfaz), no del httpClient directamente |
| ✅ | **`useCartActions`** — Recibe `setCart` y `openCart` como parámetros (inyección de dependencias) |
| ✅ | **`Button` (cva)** — Depende de variantes tipadas, no de clases CSS concretas |
| ❌ | **`Checkout.tsx`** — Depende directamente de `useCheckout()` que a su vez depende de `navigate` de React Router. Dificulta el testeo |
| ❌ | **`CartItemRow.tsx`** — Consume `useCart()` directamente en lugar de recibir `updateQuantity` como prop |

**Recomendación**: Inyectar dependencias de navegación y estado en los componentes de presentación para facilitar pruebas unitarias.

---

## DRY — Don't Repeat Yourself

> Cada pieza de conocimiento debe tener una representación única, no ambigua y autoritativa.

| Cumplimiento | Ejemplo |
|---|---|
| ✅ | **`formatPrice`** — Se usa en `ProductCard`, `Cart`, `CartItemRow`, `CartFooter`, `CheckoutSuccess`. Definido centralmente con `Intl.NumberFormat` |
| ✅ | **`getStockStatus`** — Lógica de stock centralizada en `stockUtils.ts`. Usada en `ProductCard` y `ProductDetailModal` |
| ✅ | **`cn()` utility** — `clsx` + `tailwind-merge` centralizado. Todos los componentes lo usan |
| ✅ | **`cartUtils.ts`** — `calculateTotal`, `addItemToCart`, `removeItemFromCart` son funciones puras usadas desde hooks y contextos |
| ✅ | **`animations.ts`** — Variantes de animación centralizadas y reusadas en todos los componentes |
| ❌ | **`StarIcon`/`StarRating`** — El SVG de estrella se repite en `ProductCard.tsx` (líneas 32-72) y `ProductDetailModal.tsx` (líneas 153-168). Lógica duplicada |
| ❌ | **Dos HTTP clients** — `httpClient` en `shared/api/` y `apiClient` en `app/api/`. Hacen casi lo mismo pero con interfaces diferentes |
| ❌ | **`MODAL_SLIDE_UP` / `BACKDROP_FADE`** — Definidos en `src/constants/animations.ts` y también en `src/shared/lib/animations.ts` como `modalSlideUp` / `backdropFade`. Contenido idéntico |

**Recomendación**: Unificar los HTTP clients, eliminar `src/constants/animations.ts` (usar solo `src/shared/lib/animations.ts`), y extraer `StarRating` a un componente compartido.

---

## Resumen de Cumplimiento

| Principio | Cumplimiento | Prioridad de mejora |
|---|---|---|
| **SRP** | 5/7 ✅✅✅✅✅❌❌ | Extraer Navbar en submódulos |
| **OCP** | 5/6 ✅✅✅✅✅❌ | Strategy Pattern para métodos de pago |
| **LSP** | 4/4 ✅✅✅✅ | Sin acciones necesarias |
| **ISP** | 5/6 ✅✅✅✅✅❌ | Interfaces más pequeñas en contextos |
| **DIP** | 4/6 ✅✅✅✅❌❌ | Inyección de dependencias en componentes |
| **DRY** | 6/9 ✅✅✅✅✅✅❌❌❌ | Unificar HTTP clients, eliminar animaciones duplicadas, extraer StarRating |
