# Changelog

## [1.3.0] - 2026-08-20

### Excelencia Técnica, Arquitectura Limpia (FSD + Clean Architecture), 5 Patrones GoF, Optimización Big-O, UX/UI y Documentación para Alta Gerencia

#### Arquitectura & Patrones de Diseño (GoF)
- **Repository Pattern** — Interfaces de dominio tecnología-agnósticas (`IProductRepository`, `IOrderRepository`, `IUserRepository`, `ICheckoutRepository`) con adaptadores Firestore concretos en `infrastructure/`.
- **Strategy Pattern** — Algoritmos de pago intercambiables (`CreditCardPaymentStrategy` con algoritmo de Luhn, `BitcoinPaymentStrategy`), descuento (`PercentageDiscountStrategy`, `FixedDiscountStrategy`) y envío (`StandardShippingStrategy`), seleccionados por Factory y Facade.
- **Observer / EventBus** — `src/shared/infrastructure/eventBus.ts`: `DomainEventBus` con `on/emit/subscribe/publish` y eventos tipados (`DomainEvents.SEARCH_TRIGGERED`, `ORDER_PLACED`). Elimina hacks `document.querySelector + dispatchEvent`.
- **Factory Pattern** — `OrderFactory` (IDs `ORD-{timestamp}-{random}`), `ProductFactory` (IDs O(1)), `PaymentStrategyFactory` y `DiscountStrategyFactory`.
- **Facade Pattern** — `CheckoutFacade.ts`: un solo método `processCheckout()` orquesta validación, descuento, cálculo de envío, transacción atómica Firestore y publicación de eventos de dominio.

#### Context API — Segregación de Responsabilidades
- `CartContext.ts` dividido en `CartStateContext.ts` (solo datos) + `CartActionsContext.ts` (solo callbacks). Hooks `useCartState()` y `useCartActions()` eliminan re-renders innecesarios en catálogo y modal de producto. `useCart()` mantenido por compatibilidad retroactiva.

#### Optimización Algorítmica (Big-O)
- **Lecturas de stock concurrentes:** `Promise.all` reduce lecturas Firestore de O(n) secuencial a **O(1) en tiempo de red**.
- **Cálculo de carrito en pasada única:** `calculateCartSummary()` reemplaza dos `useMemo` separados; complejidad **O(n)** con una sola iteración.
- **Búsqueda en carrito:** `isProductInCart` optimizado a **O(n)** sin alocaciones de `Set` intermedias.
- **IDs de entidades:** Generación en **O(1)** en `ProductFactory` y `OrderFactory`.

#### UX/UI & Rendimiento Visual
- Eliminados todos los `transition-all` (9 instancias), reemplazados por clases específicas GPU: `transition-colors`, `transition-[width]`.
- Accesibilidad WCAG 2.1 AA: eliminado `role="button"` anidado dentro de `<article>` en `ProductCard.tsx` — no puede haber un elemento interactivo dentro de otro.
- Barra de progreso "envío gratis" en `OrderSummary.tsx`: ahora usa `transition-[width]` — solo anima la propiedad que cambia.

#### Enrutamiento Optimizado
- `AppRouter.tsx` — Rutas lazy actualizadas a páginas wrapper `@/pages/CheckoutPage` y `@/pages/CheckoutSuccessPage` siguiendo la convención FSD.

#### Calidad Certificada
- **React Doctor:** **97 / 100** (era 86/100 al inicio del sprint — +11 puntos). Un solo warning de mantenibilidad en `Navbar.tsx` (componente grande, conocido y aceptado).
- **`pnpm lint`:** 0 errores, 0 warnings.
- **`pnpm type-check`:** 0 errores TypeScript.
- **`pnpm build`:** Exitoso — 53 archivos modificados, 2280 líneas añadidas.

#### Documentación
- `docs/study/GUIA_DE_ESTUDIO_COMPLETA.md` — Guía unificada para nuevos desarrolladores y revisores senior.
- `README.md` — Portada ejecutiva con métricas de calidad, arquitectura, tabla de patrones GoF y badges actualizados.
- JSDoc en español al 100% en todos los archivos `.ts` y `.tsx` nuevos y modificados.

## [1.2.0] - 2026-08-20

### Autenticación, Catálogo Firestore, Transacciones de Stock, Historial Real-time y FAQ

- **Autenticación & Roles**:
  - Integración completa con Firebase Auth y colección `users` en Firestore.
  - Roles diferenciados de `buyer` (comprador) y `admin` (administrador) con flujos UI adaptativos.
  - Centrado responsivo del modal de login/registro y alternador de visibilidad de contraseña (Eye/EyeOff).
- **Catálogo Firestore & CRUD (Admin)**:
  - Migración del catálogo de productos a Firebase Firestore con mecanismo de auto-seeding y fallback automático a la API de DummyJSON para evitar pantallas en blanco.
  - Interfaz de creación, edición y eliminación de productos (`ProductFormModal.tsx`) exclusiva para administradores.
  - Selector de ordenamiento de productos (Precio, Valoración, Nombre) integrado en la vista principal.
- **Checkout Seguro & Transacciones**:
  - Implementación de transacciones atómicas (`runTransaction`) en `checkoutFirestore.ts` para deducción de stock e inserción del pedido, garantizando que no haya sobreventa.
  - Puerta de autenticación integrada en `/checkout` que invita al inicio de sesión mediante un banner en lugar de redireccionar bruscamente al Home.
- **Historial en Tiempo Real & Gestión de Pedidos (`/orders`)**:
  - Suscripción reactiva en vivo (`onSnapshot`) a los pedidos (por usuario o globales para el admin).
  - Flujo de 8 estados de entrega con timeline visual, historial de auditoría y notas personalizadas de administración.
  - Botón de confirmación de recepción para el comprador e impresión de ticket/comprobante oficial en PDF.
  - Reintegro automático de stock en inventario al anular o rechazar un pedido.
- **Centro de Ayuda (`/faq`)**:
  - Página dedicada con acordeones de preguntas sobre envíos, pagos y garantías, enlaces rápidos de soporte y chat de WhatsApp.
- **Mantenimiento & Seguridad**:
  - CSP actualizada en `index.html` para permitir scripts de Google Auth y Analytics.
  - Optimización estricta de `.gitignore` para bloquear fugas de secretos y archivos de agentes.
  - Linter y TypeScript con 100% de cumplimiento (0 warnings, 0 errores).

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
