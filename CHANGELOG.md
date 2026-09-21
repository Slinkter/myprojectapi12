# Changelog

## [1.4.0] - 2026-09-20

### Purga de Código Muerto, Profundización Arquitectónica FSD, React Doctor y Optimización de Chunks

#### Purga de Código y Desacoplamiento (Fases 1 a 4)
- **Eliminación de 19 archivos obsoletos y huérfanos:** Purga de componentes no utilizados (`dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `scroll-area.tsx`, `sheet.tsx`, `LoadMoreButton.tsx`, `EmptyState.tsx`, `ErrorMessage.tsx`, `useCheckoutForm.ts`, etc.).
- **Disolución de la micro-capa `src/entities/cart-item`:** Eliminado el wrapper superficial y unificado `ICartItem` directamente en `src/features/cart/domain/cartTypes.ts`.
- **Purga de `src/entities/order`:** Centralizada la lógica de órdenes en `src/features/orders`, reduciendo `src/entities/` únicamente a modelos globales puros de catálogo (`product`).
- **Consolidación de `CartBadge`:** Reutilización de un único componente para Navbar y Drawer.
- **Unificación de formato monetario:** Reemplazo de utilidades duplicadas por `formatPrice` canónico en `src/shared/lib/formatters.ts`.

#### Profundización Arquitectónica & Anti-Leaking
- **Cálculo financiero unificado (`calculateOrderFinancials`):** Creado en `src/features/checkout/domain/financials.ts` para encapsular subtotal, descuento, umbral de envío gratis, costo de envío y total en un solo punto matemático libre de acoplamientos, consumido idénticamente por `OrderSummary` y `CheckoutFacade`.
- **Hook profundo `useCheckoutOrder`:** Creado en `src/features/checkout/application/useCheckoutOrder.ts` para esconder la orquestación entre `CheckoutFacade`, `useCartActions`, autenticación y navegación tras una interfaz de un solo llamado (`processOrder`).
- **Glosario de Dominio `CONTEXT.md`:** Documentación viva de términos ubícuos del negocio y principios de diseño modular (depth, seams, leverage, locality).

#### Optimización de Bundle y Rendimiento (Fase 5)
- **Vendor Splitting en Vite 8 (`manualChunks`):** Desacoplamiento de librerías de terceros pesadas en chunks independientes (`vendor-react`, `vendor-firebase`, `vendor-motion`, `vendor-query`). Reducción del chunk principal de entrada de **958 kB a 277 kB**.
- **Animaciones GPU y Prohibición de `transition-all`:** Erradicación completa de transiciones generales en favor de propiedades compuestas (`transition-colors`, `transition-[width]`).

#### Calidad y React Doctor (Score 72/100)
- **0 Errores críticos, 0 fallos de accesibilidad:**
  - Animación de layout corregida en `src/pages/FAQ.tsx` (reemplazo de `height` por `opacity` e `y` sin provocar reflow de pintura de 60fps).
  - Formularios accesibles en `src/pages/AdminDashboard.tsx` y `src/features/products/presentation/ProductFormModal.tsx` con emparejamiento semántico de etiquetas `label` / `id`.
  - Conversión estricta con `valueAsNumber` para evitar mutaciones inseguras de tipos numéricos.
  - Reset reactivo de formularios mediante `key={productToEdit?.id ?? 'create'}` eliminando efectos secundarios imperativos.
  - Verificación estricta de variables de entorno y autorización documentada en `AuthProvider.tsx`.

---

## [1.3.1] - 2026-08-27

### Tooling: Vite 8 y decisión documentada sobre TypeScript 7

- **Vite actualizado a 8.2** (`vite ^8.2.2`) y **`@vitejs/plugin-react` a 6.1** (`^6.1.0`, major obligatoria porque la línea 4.x solo peera Vite `≤7`). Rama `chore/upgrade-vite8` mergeada en `feature/refactor-navbar`.
  - Ajuste de configuración derivado: `vite.config.js` migra `__dirname` → `import.meta.dirname` (el config loader nativo de Vite 8 marca `__dirname` como obsoleto). Sin cambios de lógica.
  - Verificación: `pnpm install` OK · `pnpm type-check` 0 errores · `pnpm lint` 0 errores · `pnpm build` exitoso.

- **TypeScript 7: experimento realizado y descartado** (rama `experiment/typescript7`, eliminada al finalizar).
  - Hallazgo empírico con `typescript@7.0.2`:
    - `pnpm type-check`: ✅ funciona tras eliminar `baseUrl` de `tsconfig.json` — TS7 eliminó esa opción (deprecada en TS 5.x; error `TS5102`).
    - `pnpm build`: ✅ sin impacto (Vite no usa la API JS de TypeScript).
    - `pnpm lint`: ❌ **bloqueado** — `@typescript-eslint` 8.x falla al cargar (`Cannot read properties of undefined (reading 'Cjs')`) porque `typescript@7` eliminó `lib/typescript.js` (API JS clásica). El último estable (8.68.0) exige peer `typescript <6.1.0`.
    - Vía alfa probada (`@typescript-eslint` `7.0.0-alpha.0`): ❌ también falla (`ts-api-utils` no puede leer la API de TS7 — `reading 'Intrinsic'`).
  - **Decisión:** se mantiene **`typescript ^5.9.3`**. La migración a TS7 requiere que el ecosistema de lint publique una herramienta estable compatible con la nueva API nativa. Cuando ocurra, retomar en una rama dedicada.

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
