# Guía de Estudio Completa — MyProjectAPI12

> **Audiencia:** Desarrolladores nuevos en el proyecto, revisores de código senior y Comité de Alta Gerencia.
> **Objetivo:** Explicar de forma pedagógica y exhaustiva la arquitectura, el stack tecnológico, los patrones de diseño, los flujos de datos y las decisiones técnicas de la plataforma **MyProjectAPI12**.

---

## 1. Visión General del Proyecto

**MyProjectAPI12** es una **SPA** (Single Page Application) de comercio electrónico construida con las mejores prácticas del ecosistema React moderno. Ofrece:

- Catálogo de productos con paginación infinita y búsqueda en tiempo real.
- Sistema de carrito persistente con `localStorage`.
- Checkout seguro con validación de tarjeta (algoritmo de Luhn) y transacciones atómicas en Firestore.
- Roles diferenciados: `buyer` (comprador) y `admin` (administrador).
- Panel de administración con CRUD completo de productos y gestión de usuarios.
- Historial de pedidos en tiempo real con flujo de 8 estados de entrega.
- Centro de Ayuda (FAQ) y modo oscuro/claro.

**URL de Producción:** https://slinkter.github.io/myprojectapi12

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión | Rol |
| :--- | :--- | :---: | :--- |
| UI Library | React | 18.3 | Motor de componentes y reconciliación del DOM virtual. |
| Lenguaje | TypeScript | 5.9 | Tipado estático estricto para seguridad y autocompletado. |
| Build Tool | Vite | 5.4 | Bundling ultrarrápido con HMR y tree-shaking. |
| Estilos | Tailwind CSS v4 | 4.x | Utility-first CSS con tokens de diseño en `@theme`. |
| Backend | Firebase Firestore | v10 | Base de datos NoSQL reactiva en tiempo real. |
| Autenticación | Firebase Auth | v10 | Registro, login y gestión de sesiones. |
| Data Fetching | TanStack Query | v5 | Caché reactivo, paginación infinita y sincronización de estado del servidor. |
| Animaciones | Framer Motion | 12 | Animaciones GPU-aceleradas (`opacity`, `transform`) a 60fps. |
| Enrutamiento | React Router | 6 | Enrutamiento declarativo con code-splitting mediante `lazy()`. |

---

## 3. Arquitectura de Software (Feature-Sliced Design + Clean Architecture)

El proyecto combina **Feature-Sliced Design (FSD)** con principios de **Clean Architecture** para garantizar bajo acoplamiento, alta cohesión y dependencias unidireccionales.

```
src/
├── app/           ← Configuración global: providers, router
├── entities/      ← Entidades de dominio puras (product, cart-item, order)
├── features/      ← Módulos funcionales independientes
│   ├── auth/      ← {domain, application, infrastructure, presentation, index.ts}
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   ├── orders/
│   └── users/
├── pages/         ← Composición de features por ruta (Home, Orders, AdminDashboard)
├── shared/        ← Primitivas reutilizables (ui/, hooks/, lib/, infrastructure/)
└── widgets/       ← Widgets compuestos (Navbar, CartDrawer)
```

### Regla de Dependencia

```
pages → widgets → features → entities → shared
```

Cada capa solo puede importar de capas inferiores. Nunca al revés.

---

## 4. Patrones de Diseño Implementados (GoF)

### 4.1 Repository Pattern
**Dónde:** `src/features/*/domain/repositories/` e `infrastructure/`
**Por qué:** Desacopla la lógica de negocio (dominio) del proveedor de datos (Firestore). Si mañana se cambia Firestore por PostgreSQL, solo cambia el adaptador.

```typescript
// Interfaz de dominio (tecnología-agnóstica)
interface IProductRepository {
  getAll(limit: number, skip: number): Promise<IProductsApiResponse>;
  getById(id: string): Promise<IProduct | null>;
}

// Adaptador concreto de infraestructura
class FirestoreProductRepository implements IProductRepository { ... }
```

### 4.2 Strategy Pattern
**Dónde:** `src/features/checkout/domain/strategies/`
**Por qué:** Permite intercambiar el algoritmo de pago o descuento sin modificar el flujo de checkout.

```typescript
interface IPaymentStrategy {
  validate(data: ICardFormData): IValidationResult;
  process(data: ICardFormData): Promise<void>;
}
// Estrategias concretas: CreditCardPaymentStrategy (Luhn), BitcoinPaymentStrategy
```

### 4.3 Observer / EventBus Pattern
**Dónde:** `src/shared/infrastructure/eventBus.ts`
**Por qué:** Desacopla emisores y receptores de eventos de dominio. El Navbar emite `SEARCH_TRIGGERED` sin saber que `HomeContent` lo escucha.

### 4.4 Factory Pattern
**Dónde:** `src/features/*/domain/factories/`
**Por qué:** Centraliza la construcción de entidades complejas (órdenes, productos) garantizando consistencia e invariantes del dominio.

### 4.5 Facade Pattern
**Dónde:** `src/features/checkout/application/CheckoutFacade.ts`
**Por qué:** Simplifica la API del checkout. Un solo método `processCheckout()` orquesta internamente validación, descuento, cálculo de envío, transacción atómica y publicación de eventos.

---

## 5. Optimización Algorítmica (Notación Big-O)

| Operación | Antes | Después | Técnica |
| :--- | :---: | :---: | :--- |
| Lectura de stock en transacción Firestore | O(n) secuencial | **O(1) paralelo** | `Promise.all` concurrente |
| Cálculo de totales en el carrito | O(2n) — dos iteraciones | **O(n)** — pasada única | `calculateCartSummary` con un solo `for` |
| Búsqueda de producto en carrito | O(n) con Set allocation | **O(n)** sin asignaciones | Loop directo `for` sin `map()` + `new Set()` |
| Generación de ID de producto | O(n) — scan de tabla | **O(1)** | UUID / ID atómico |

---

## 6. Sistema de Diseño y Tokens de Color

Los tokens de diseño están definidos en `src/index.css` usando las directivas `@theme` de Tailwind v4.

```css
@theme {
  --color-primary: #059669;       /* Verde esmeralda — acciones principales */
  --color-primary-hover: #047857; /* Estado hover de acciones primarias */
  --color-accent: #d97706;        /* Ámbar — advertencias y estado pendiente */
  --color-accent-2: #7c3aed;      /* Violeta — badges especiales */
}
```

### Modo Oscuro / Claro

El sistema de temas usa variables CSS semánticas (`:root` y `.dark`) resueltas en tiempo de ejecución, sin JavaScript adicional.

---

## 7. Flujo de Compra (End-to-End)

```
Home (catálogo) → ProductCard (click) → ProductDetailModal → Carrito
  → Checkout (autenticado) → CheckoutFacade.processCheckout()
    → IPaymentStrategy.validate() + Luhn
    → IDiscountStrategy.apply()
    → IShippingStrategy.calculate()
    → runTransaction(Firestore): deducir stock + crear orden
    → DomainEventBus.emit(ORDER_PLACED)
  → CheckoutSuccess → /orders (historial en tiempo real)
```

---

## 8. Firebase: Arquitectura de Datos

### Colecciones en Firestore

| Colección | Documentos | Descripción |
| :--- | :--- | :--- |
| `products` | `{id}` | Catálogo de productos con stock, precio, categoría y thumbnail. |
| `compras` | `{orderId}` | Pedidos con items, totales, descuentos, historial de estados. |
| `users` | `{uid}` | Perfil de usuario con rol (`buyer`/`admin`) y estado de suspensión. |

### Seguridad

Las reglas de Firestore garantizan que:
- Un comprador solo puede leer/crear sus propios pedidos.
- Solo un `admin` puede actualizar el estado de cualquier pedido.
- Solo un `admin` puede crear, editar o eliminar productos.

---

## 9. Calidad y Estándares de Entrega

| Métrica | Resultado | Objetivo |
| :--- | :---: | :---: |
| React Doctor Score | **97 / 100** | ≥ 90 / 100 |
| ESLint Warnings | **0** | 0 |
| TypeScript Errors | **0** | 0 |
| Production Build | **✅ Exitoso** | Exitoso |
| JSDoc en Español | **100% módulos** | 100% |

---

## 10. Guía de Instalación y Comandos

```bash
# Clonar el repositorio
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12

# Instalar dependencias (requiere pnpm ≥ 8)
pnpm install

# Servidor de desarrollo (HMR en http://localhost:5173)
pnpm dev

# Verificación de calidad
pnpm lint        # ESLint (0 errores, máx. 2 warnings)
pnpm type-check  # TypeScript sin emitir archivos

# Build de producción
pnpm build       # Genera dist/ con bundles optimizados y hasheados
pnpm preview     # Previsualiza dist/ localmente

# Despliegue a GitHub Pages
pnpm deploy      # Ejecuta predeploy (build) + gh-pages -d dist
```

---

## 11. Módulos de Estudio Detallado

Para profundizar en cada tema, consulta los módulos en `docs/study/`:

| Módulo | Archivo | Contenido |
| :--- | :--- | :--- |
| 00 | `00-PRERREQUISITOS.md` | Node.js, pnpm, Git, extensiones de VS Code |
| 01 | `01-INICIO-RAPIDO.md` | Clonar, instalar, ejecutar y construir |
| 02 | `02-ESTRUCTURA.md` | Arquitectura FSD y capas de dependencia |
| 03 | `03-TECNOLOGIAS.md` | React 18, TypeScript, Vite, Tailwind v4 |
| 04 | `04-ALGORITMOS.md` | Infinite scroll, validaciones, Big-O |
| 05 | `05-CUSTOM-HOOKS.md` | useProducts, useCart, useCheckout |
| 06 | `06-ESTADO-GLOBAL.md` | Context API vs TanStack Query |
| 07 | `07-FLUIDO-COMPRA.md` | Flujo completo Home → Success |
| 08 | `08-COMPONENTES-UI.md` | Composición, Radix, Tailwind |
| 09 | `09-ESTILOS.md` | Tailwind v4, tokens, dark mode |
| 10 | `10-API-Y-DATOS.md` | httpClient, Firestore, mappers |
| 11 | `11-DESPLIEGUE.md` | CI/CD GitHub Actions, Pages |
| 12 | `12-EJERCICIOS.md` | 15+ ejercicios progresivos |
