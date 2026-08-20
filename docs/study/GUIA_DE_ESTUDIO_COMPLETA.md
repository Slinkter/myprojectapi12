# Guía de Estudio Completa — MyProjectAPI12 v1.3.0

> **Versión:** 1.3.0 — 2026-08-20
> **Audiencia:** Desarrolladores junior/senior nuevos al proyecto, revisores técnicos y Comité de Alta Gerencia.
> **Objetivo:** Documentar de forma pedagógica y exhaustiva la arquitectura, el stack tecnológico, los patrones de diseño GoF, los flujos de datos y las decisiones técnicas de la plataforma **MyProjectAPI12**.

---

## Índice

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura de Software (FSD + Clean Architecture)](#3-arquitectura-de-software-fsd--clean-architecture)
4. [Patrones de Diseño GoF Implementados](#4-patrones-de-diseño-gof-implementados)
5. [Optimización Algorítmica (Big-O)](#5-optimización-algorítmica-big-o)
6. [Sistema de Diseño y Tokens de Color](#6-sistema-de-diseño-y-tokens-de-color)
7. [Firebase: Arquitectura de Datos y Seguridad](#7-firebase-arquitectura-de-datos-y-seguridad)
8. [Flujo de Compra (End-to-End)](#8-flujo-de-compra-end-to-end)
9. [Gestión de Estado](#9-gestión-de-estado)
10. [Enrutamiento y Code Splitting](#10-enrutamiento-y-code-splitting)
11. [Accesibilidad (WCAG 2.1 AA)](#11-accesibilidad-wcag-21-aa)
12. [Calidad y Estándares de Entrega](#12-calidad-y-estándares-de-entrega)
13. [Guía de Instalación y Comandos](#13-guía-de-instalación-y-comandos)
14. [Módulos de Estudio Detallado](#14-módulos-de-estudio-detallado)

---

## 1. Visión General del Proyecto

**MyProjectAPI12** es una **SPA** (_Single Page Application_) de comercio electrónico construida con las mejores prácticas del ecosistema React moderno. Ofrece:

| Funcionalidad | Descripción |
| :--- | :--- |
| **Catálogo de productos** | Paginación infinita con TanStack Query. Búsqueda en tiempo real con debounce (300ms). Filtros por categoría y orden. |
| **Carrito persistente** | Estado separado (datos vs. acciones) para eliminar re-renders innecesarios. Sincronizado con `localStorage`. |
| **Checkout seguro** | Validación de tarjeta con algoritmo de Luhn. Transacción atómica Firestore: deduce stock y crea la orden en una sola escritura. |
| **Roles diferenciados** | `buyer` — comprador estándar. `admin` — accede a CRUD de productos, gestión de usuarios y todas las órdenes. |
| **Panel de administración** | CRUD completo de productos con formulario modal, gestión de estados de pedidos y bloqueo/desbloqueo de usuarios. |
| **Historial de pedidos** | Suscripción reactiva `onSnapshot`. Flujo de 8 estados de entrega con línea de tiempo visual y notas de auditoría. |
| **Modo oscuro/claro** | Tokens CSS semánticos. Preferencia persiste en `localStorage`. |
| **Centro de Ayuda (FAQ)** | Acordeones accesibles, chat de WhatsApp y preguntas frecuentes sobre envíos, pagos y garantías. |

**URLs del proyecto:**

- **Producción:** https://slinkter.github.io/myprojectapi12
- **Repositorio:** https://github.com/Slinkter/myprojectapi12

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :---: | :--- |
| UI Library | React | 18.3 | Motor de componentes, reconciliación del DOM virtual y rendering concurrente. |
| Lenguaje | TypeScript | 5.9 | Tipado estático estricto (`strict: true`). Cero `any` implícitos. |
| Build Tool | Vite | 5.4 | Bundling ultrarrápido con HMR, tree-shaking y code-splitting automático. |
| Estilos | Tailwind CSS | v4 | Utility-first CSS configurado en `@theme {}` de `src/index.css`. Sin `tailwind.config.js`. |
| Backend | Firebase Firestore | v10 | Base de datos NoSQL reactiva en tiempo real. SDK modular (tree-shakeable). |
| Autenticación | Firebase Auth | v10 | Registro, login con email/contraseña y gestión de sesiones. |
| Data Fetching | TanStack Query | v5 | Caché reactivo, paginación infinita (`useInfiniteQuery`) y sincronización de estado del servidor. |
| Animaciones | Framer Motion | 12 | Animaciones GPU-aceleradas (`opacity`, `transform`) a 60fps. `LazyMotion` reduce el bundle. |
| Enrutamiento | React Router | 6 | Enrutamiento declarativo con `lazy()` y `Suspense` para code-splitting. |
| Gestor de paquetes | pnpm | ≥ 8 | Instalación rápida con lockfile. **Nunca usar npm en este proyecto.** |

---

## 3. Arquitectura de Software (FSD + Clean Architecture)

El proyecto combina **Feature-Sliced Design (FSD)** con principios de **Clean Architecture** para garantizar bajo acoplamiento, alta cohesión y dependencias unidireccionales.

### Estructura de carpetas

```
src/
├── app/                        ← Configuración global de la aplicación
│   └── routing/AppRouter.tsx   ← Rutas lazy con React Router 6
├── entities/                   ← Tipos de dominio puros (sin lógica de negocio)
│   └── product/
├── features/                   ← Módulos funcionales independientes (FSD)
│   ├── auth/
│   │   ├── domain/             ← Tipos, interfaces, reglas de negocio
│   │   ├── application/        ← Hooks, casos de uso (useAuth)
│   │   ├── infrastructure/     ← Adaptadores Firebase (authFirebase.ts)
│   │   ├── presentation/       ← Componentes UI (LoginModal.tsx)
│   │   └── index.ts            ← Barrel: exports públicos de la feature
│   ├── cart/
│   │   ├── application/CartStateContext.ts    ← [NUEVO v1.3] Solo datos
│   │   ├── application/CartActionsContext.ts  ← [NUEVO v1.3] Solo callbacks
│   │   ├── application/CartProvider.tsx       ← Pasada única O(n)
│   │   └── domain/cartUtils.ts               ← calculateCartSummary()
│   ├── checkout/
│   │   ├── domain/strategies/  ← [NUEVO v1.3] IPaymentStrategy, IDiscountStrategy...
│   │   ├── domain/repositories/← [NUEVO v1.3] ICheckoutRepository
│   │   ├── domain/factories/   ← [NUEVO v1.3] PaymentStrategyFactory
│   │   ├── application/CheckoutFacade.ts ← [NUEVO v1.3] Facade completo
│   │   └── infrastructure/FirestoreCheckoutRepository.ts
│   ├── products/
│   │   ├── domain/repositories/IProductRepository.ts  ← [NUEVO v1.3]
│   │   ├── domain/factories/ProductFactory.ts         ← [NUEVO v1.3] O(1)
│   │   └── infrastructure/FirestoreProductRepository.ts
│   ├── orders/
│   │   ├── domain/repositories/IOrderRepository.ts   ← [NUEVO v1.3]
│   │   ├── domain/factories/OrderFactory.ts          ← [NUEVO v1.3]
│   │   └── infrastructure/FirestoreOrderRepository.ts
│   └── users/
│       ├── domain/repositories/IUserRepository.ts   ← [NUEVO v1.3]
│       └── infrastructure/FirestoreUserRepository.ts
├── pages/                      ← Composición de features por ruta
│   ├── CheckoutPage.tsx         ← [NUEVO v1.3] Wrapper lazy FSD
│   ├── CheckoutSuccessPage.tsx  ← [NUEVO v1.3] Wrapper lazy FSD
│   ├── Orders.tsx               ← Historial real-time + PDF
│   └── AdminDashboard.tsx       ← CRUD + gestión de usuarios
├── shared/                     ← Primitivas reutilizables (sin dependencias de features)
│   ├── infrastructure/eventBus.ts ← [NUEVO v1.3] DomainEventBus + DomainEvents
│   ├── hooks/                   ← useLocalStorage, useLogLifecycle...
│   ├── ui/Button.tsx            ← Componente atómico reutilizable
│   └── lib/firebase.ts          ← Instancia db y auth de Firebase
└── widgets/                    ← Widgets compuestos (dependen de features)
    └── Navbar.tsx               ← Usa eventBus en lugar de DOM dispatch
```

### Regla de Dependencia (debe respetarse siempre)

```
pages → widgets → features → entities → shared
```

- Cada capa solo puede importar de capas inferiores o del mismo nivel.
- `features/` nunca importan de `pages/` ni de `widgets/`.
- `shared/` no importa de ninguna otra capa.

---

## 4. Patrones de Diseño GoF Implementados

### 4.1 Repository Pattern

**Archivos:** `src/features/*/domain/repositories/I*.ts` y `infrastructure/Firestore*.ts`

**Problema que resuelve:** La lógica de negocio no debe saber si los datos vienen de Firestore, de una API REST o de un mock. Si mañana se migra de Firestore a PostgreSQL, solo cambia el adaptador — no el dominio.

```typescript
// Interfaz de dominio — tecnología-agnóstica
interface IProductRepository {
  getAll(limit: number, skip: number): Promise<IProductsApiResponse>;
  getById(id: string): Promise<IProduct | null>;
  create(product: Omit<IProduct, 'id'>): Promise<IProduct>;
  update(id: string, data: Partial<IProduct>): Promise<void>;
  delete(id: string): Promise<void>;
}

// Adaptador Firestore — implementación concreta
class FirestoreProductRepository implements IProductRepository {
  async getAll(limit: number, skip: number) {
    const q = query(collection(db, 'products'), orderBy('title'), limit(limit));
    // ...
  }
}
```

### 4.2 Strategy Pattern

**Archivos:** `src/features/checkout/domain/strategies/`

**Problema que resuelve:** El flujo de checkout es el mismo, pero el algoritmo de validación y procesamiento de pago puede variar (tarjeta de crédito, Bitcoin, etc.) sin cambiar el flujo.

```typescript
interface IPaymentStrategy {
  validate(data: ICardFormData): IValidationResult;
  process(data: ICardFormData): Promise<void>;
}

// Estrategia concreta con algoritmo de Luhn
class CreditCardPaymentStrategy implements IPaymentStrategy {
  validate(data: ICardFormData): IValidationResult {
    return luhnCheck(data.cardNumber) ? { valid: true } : { valid: false, error: 'Número inválido' };
  }
}
```

### 4.3 Observer / EventBus Pattern

**Archivo:** `src/shared/infrastructure/eventBus.ts`

**Problema que resuelve:** El `Navbar` necesita disparar una búsqueda en `HomeContent`, pero ambos son componentes independientes sin relación padre-hijo. El EventBus los desacopla.

```typescript
// Antes (hack DOM — eliminado en v1.3):
document.querySelector('#search-input')?.dispatchEvent(new Event('search'));

// Después (EventBus tipado):
eventBus.emit(DomainEvents.SEARCH_TRIGGERED, { query: searchTerm });
// En HomeContent:
eventBus.on(DomainEvents.SEARCH_TRIGGERED, ({ query }) => setSearch(query));
```

### 4.4 Factory Pattern

**Archivos:** `src/features/*/domain/factories/`

**Problema que resuelve:** La construcción de una entidad compleja (Orden) requiere múltiples pasos y puede salir inconsistente si se dispersa por el código.

```typescript
class OrderFactory {
  static create(items: ICartItem[], userId: string): IOrder {
    const id = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    return { id, userId, items, status: 'pending', createdAt: new Date().toISOString() };
  }
}
```

### 4.5 Facade Pattern

**Archivo:** `src/features/checkout/application/CheckoutFacade.ts`

**Problema que resuelve:** El proceso de checkout tiene 6 pasos (validar, descontar, calcular envío, crear orden, deducir stock, publicar evento). Sin Facade, el componente UI tendría que orquestarlos todos, violando el principio de responsabilidad única.

```typescript
class CheckoutFacade {
  async processCheckout(formData: ICardFormData, cart: ICartItem[]): Promise<void> {
    const paymentStrategy = PaymentStrategyFactory.create(formData.paymentMethod);
    const validation = paymentStrategy.validate(formData);
    if (!validation.valid) throw new Error(validation.error);

    const discount = DiscountStrategyFactory.create(formData.couponCode);
    const total = discount.apply(calculateCartTotal(cart));

    await this.checkoutRepository.runAtomicTransaction(cart, total);
    eventBus.emit(DomainEvents.ORDER_PLACED, { total });
  }
}
```

---

## 5. Optimización Algorítmica (Big-O)

| Operación | Complejidad Antes | Complejidad Después | Técnica |
| :--- | :---: | :---: | :--- |
| Lectura de stock en transacción Firestore | O(n) secuencial | **O(1) paralelo** | `Promise.all` — todas las lecturas al mismo tiempo |
| Cálculo de totales del carrito | O(2n) — dos `useMemo` | **O(n)** — una pasada | `calculateCartSummary()` con un solo `for` |
| Búsqueda de producto en carrito | O(n) + `Set` allocation | **O(n)** sin asignaciones | Loop directo sin estructuras intermedias |
| Generación de ID de entidad | O(n) — scan de tabla | **O(1)** | UUID local con timestamp |
| Renderizado del catálogo | O(n) re-renders | **O(1) re-renders** | `useCartActions()` aislado del estado |

### Detalle: Carrito de pasada única

```typescript
// Antes — dos iteraciones separadas:
const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

// Después — una sola pasada O(n):
function calculateCartSummary(cart: ICartItem[]) {
  let total = 0;
  let count = 0;
  for (const item of cart) {
    total += item.price * item.qty;
    count += item.qty;
  }
  return { total, count };
}
```

---

## 6. Sistema de Diseño y Tokens de Color

Los tokens están definidos en `src/index.css` dentro de la directiva `@theme {}` de Tailwind v4. No existe `tailwind.config.js`.

```css
@theme {
  /* Paleta de Marca */
  --color-primary:       #059669;  /* Verde esmeralda — acciones principales */
  --color-primary-hover: #047857;  /* Estado hover — botones primarios */
  --color-accent:        #d97706;  /* Ámbar — advertencias, pago pendiente */
  --color-accent-2:      #7c3aed;  /* Violeta — badges de oferta especial */

  /* Texto & Fondo — modo claro */
  --background:  #ffffff;
  --foreground:  #0f172a;
  --card:        #ffffff;

  /* Texto & Fondo — modo oscuro (.dark) */
  --background:  #0b0c15;
  --foreground:  #f8fafc;
  --card:        #111827;
}
```

### Principios del Sistema

- **Consistencia:** Todos los botones primarios usan `bg-primary hover:bg-primary-hover`.
- **Semántica:** Los colores tienen significado fijo: verde = éxito/acción, ámbar = advertencia, violeta = especial.
- **Modo oscuro:** Variables CSS resueltas en runtime mediante la clase `.dark` en el `<html>`. Sin JavaScript adicional.
- **GPU-first:** Todas las animaciones usan `opacity` y `transform`. `transition-all` está prohibido.

---

## 7. Firebase: Arquitectura de Datos y Seguridad

### Colecciones Firestore

| Colección | ID de Documento | Campos Clave | Quién puede acceder |
| :--- | :--- | :--- | :--- |
| `products` | `{productId}` | `title`, `price`, `stock`, `category`, `thumbnail` | Lectura pública; escritura solo admin |
| `compras` | `{orderId}` | `userId`, `items[]`, `total`, `status`, `history[]` | Comprador ve las suyas; admin ve todas |
| `users` | `{uid}` | `email`, `role`, `suspended`, `createdAt` | Admin puede actualizar rol/suspensión |

### Transacción Atómica de Checkout

El checkout usa `runTransaction()` de Firestore para garantizar que **nunca haya sobreventa**:

```typescript
await runTransaction(db, async (transaction) => {
  // 1. Leer stocks en paralelo — O(1) en tiempo de red
  const stockDocs = await Promise.all(items.map(item => transaction.get(productRef(item.id))));

  // 2. Verificar que hay stock suficiente
  for (const [i, doc] of stockDocs.entries()) {
    if (doc.data().stock < items[i].qty) throw new Error('Stock insuficiente');
  }

  // 3. Deducir stock y crear orden — operaciones atómicas
  for (const [i, doc] of stockDocs.entries()) {
    transaction.update(productRef(items[i].id), { stock: doc.data().stock - items[i].qty });
  }
  transaction.set(orderRef, newOrder);
});
```

### Seguridad con Firebase Security Rules

```
// Solo el propietario puede leer sus órdenes; el admin puede leer todas
match /compras/{orderId} {
  allow read: if request.auth.uid == resource.data.userId
               || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  allow create: if request.auth != null;
  allow update: if get(...).data.role == 'admin';
}
```

---

## 8. Flujo de Compra (End-to-End)

```
Home (catálogo infinito)
  ↓ click en ProductCard
ProductDetailModal (detalle, variantes, stock)
  ↓ "Agregar al carrito" → eventBus.emit(CART_UPDATED)
CartDrawer (resumen del carrito) → OrderSummary (barra envío gratis)
  ↓ "Proceder al pago"
[Auth Gate] ← si no está logueado → LoginModal
  ↓ autenticado
Checkout (formulario de pago)
  ↓ submit → CheckoutFacade.processCheckout()
    ├── PaymentStrategyFactory.create() → CreditCardPaymentStrategy
    ├── validate() → Algoritmo de Luhn
    ├── DiscountStrategyFactory.create() → PercentageDiscountStrategy
    ├── apply() → total con descuento
    ├── StandardShippingStrategy.calculate() → costo de envío
    └── runTransaction(Firestore) → deducir stock + crear orden
          → eventBus.emit(DomainEvents.ORDER_PLACED)
  ↓
CheckoutSuccess (confirmación)
  ↓ "Ver mis pedidos"
/orders (historial en tiempo real con onSnapshot)
  → 8 estados: pending → processing → shipped → delivered...
  → Ticket PDF con miniaturas, auditoría y fecha estimada
```

---

## 9. Gestión de Estado

El proyecto usa tres estrategias de estado según el tipo de dato:

| Tipo de Estado | Herramienta | Ejemplo |
| :--- | :--- | :--- |
| **Estado del servidor** (remoto, caché) | TanStack Query | Lista de productos, paginación |
| **Estado global del cliente** | React Context API | Carrito, autenticación, tema |
| **Estado local del componente** | `useState` / `useReducer` | Formularios, modales abiertos |

### Segregación del Contexto del Carrito (v1.3)

El contexto del carrito fue dividido en dos para eliminar re-renders innecesarios:

```typescript
// CartStateContext — solo datos (lectura)
const { cart, totalPrice, totalItems } = useCartState();

// CartActionsContext — solo callbacks (no causa re-renders al cambiar datos)
const { addToCart, removeFromCart, clearCart } = useCartActions();
```

Los componentes del catálogo (`ProductCard`, `ProductDetailModal`) ahora solo consumen `useCartActions()` — no se re-renderizan cuando cambia el conteo de items del carrito.

---

## 10. Enrutamiento y Code Splitting

```typescript
// src/app/routing/AppRouter.tsx
const Home = lazy(() => import('@/pages/HomeContent'));
const Checkout = lazy(() => import('@/pages/CheckoutPage'));        // [NUEVO v1.3]
const CheckoutSuccess = lazy(() => import('@/pages/CheckoutSuccessPage')); // [NUEVO v1.3]
const Orders = lazy(() => import('@/pages/Orders'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
```

Cada ruta es un chunk separado. El navegador descarga el código de `AdminDashboard` solo cuando el usuario navega a `/admin`. El bundle inicial es mínimo.

---

## 11. Accesibilidad (WCAG 2.1 AA)

| Requisito | Implementación |
| :--- | :--- |
| No anidar elementos interactivos | `ProductCard` usa `<article>` + `tabIndex` sin `role="button"` para evitar `<button>` dentro de otro elemento interactivo |
| Etiquetas semánticas | Todos los `<input>` tienen `<label htmlFor>` explícito o `aria-label` |
| Navegación por teclado | `onKeyDown` con `Enter` y `Space` en elementos clickeables |
| Estados de ARIA | `aria-expanded`, `aria-disabled`, `aria-label` en búsquedas y modales |
| Contraste de color | Paleta `--color-primary: #059669` sobre blanco cumple ratio ≥ 4.5:1 |

---

## 12. Calidad y Estándares de Entrega

| Métrica | Resultado | Objetivo | Estado |
| :--- | :---: | :---: | :---: |
| React Doctor Score | **97 / 100** | ≥ 90 / 100 | ✅ Superado (+7 pts) |
| ESLint Errores | **0** | 0 | ✅ |
| ESLint Warnings | **0** | 0 | ✅ |
| TypeScript Errores | **0** | 0 | ✅ |
| Build de producción | **✅ Exitoso** | Exitoso | ✅ |
| JSDoc en español | **100%** | 100% | ✅ |
| Patrones GoF | **5 / 5** | 5 | ✅ |
| Accesibilidad WCAG 2.1 AA | **Cumple** | Cumple | ✅ |

El único aviso pendiente de React Doctor es `no-giant-component` en `Navbar.tsx` — un componente históricamente grande que gestiona múltiples responsabilidades (búsqueda, carrito, auth, tema). Su refactorización se planifica para v1.4.

---

## 13. Guía de Instalación y Comandos

### Prerrequisitos

- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12

# 2. Instalar dependencias (SIEMPRE con pnpm, nunca con npm)
pnpm install

# Si aparece ERR_PNPM_IGNORED_BUILDS, ejecutar:
pnpm approve-builds
```

### Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Servidor de desarrollo con HMR en `http://localhost:5173` |
| `pnpm build` | Build de producción → genera `dist/` |
| `pnpm preview` | Previsualiza `dist/` localmente |
| `pnpm lint` | ESLint con `--max-warnings 2` (debe dar 0) |
| `pnpm type-check` | TypeScript sin emitir archivos (debe dar 0 errores) |
| `pnpm deploy` | Build + deploy a GitHub Pages vía `gh-pages` |

### Variables de entorno

```bash
# .env.local (crear localmente, nunca commitear)
VITE_API_URL=https://dummyjson.com
# Las credenciales de Firebase van en src/shared/lib/firebase.ts
```

---

## 14. Módulos de Estudio Detallado

Para profundizar en cada tema, consulta los archivos en `docs/study/`:

| Módulo | Archivo | Contenido | Tiempo |
| :---: | :--- | :--- | :---: |
| 00 | `00-PRERREQUISITOS.md` | Node.js, pnpm, Git, extensiones VS Code | 15 min |
| 01 | `01-INICIO-RAPIDO.md` | Clonar, instalar, ejecutar y construir | 10 min |
| 02 | `02-ESTRUCTURA.md` | Arquitectura FSD, capas y regla de dependencia | 30 min |
| 03 | `03-TECNOLOGIAS.md` | React 18, TypeScript, Vite, Tailwind v4 | 45 min |
| 04 | `04-ALGORITMOS.md` | Infinite scroll, validaciones Big-O, debounce | 60 min |
| 05 | `05-CUSTOM-HOOKS.md` | useProducts, useCart, useCheckout, useAuth | 45 min |
| 06 | `06-ESTADO-GLOBAL.md` | Context API vs TanStack Query | 30 min |
| 07 | `07-FLUIDO-COMPRA.md` | Flujo completo Home → Success | 30 min |
| 08 | `08-COMPONENTES-UI.md` | Composición, Radix, Tailwind | 30 min |
| 09 | `09-ESTILOS.md` | Tailwind v4, tokens `@theme`, dark mode | 30 min |
| 10 | `10-API-Y-DATOS.md` | httpClient, Firestore, mappers, type safety | 30 min |
| 11 | `11-DESPLIEGUE.md` | CI/CD GitHub Actions, Pages, pnpm | 20 min |
| 12 | `12-EJERCICIOS.md` | 15+ ejercicios progresivos (BASIC / INTERMEDIATE / ADVANCED) | 4-6 h |
| — | `GUIA_DE_ESTUDIO_COMPLETA.md` | **Este documento** — visión holística del proyecto | 90 min |

**Ruta de aprendizaje recomendada:**

```
00 → 01 → 02 → 03 → 06 → 05 → 04 → 07 → 08 → 09 → 10 → 11 → 12
```
