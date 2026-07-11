# 02 — Estructura del Proyecto (FSD + DDD)

El proyecto combina **Feature-Sliced Design (FSD)** con **Domain-Driven Design (DDD)** para organizar el código en capas con responsabilidades claras y dependencias unidireccionales.

---

## Capas de la arquitectura

```
src/
├── app/           ← Capa de Aplicación (configuración global)
├── features/      ← Features (módulos funcionales)
├── pages/         ← Páginas (composición de features)
├── shared/        ← Código compartido (UI, hooks, lib)
├── constants/     ← Constantes globales de animación
├── assets/        ← Recursos estáticos
├── App.tsx        ← Raíz de la aplicación
├── main.tsx       ← Entry point
└── index.css      ← Estilos globales + tokens de diseño
```

---

## Regla de dependencia

Cada capa solo puede importar de capas inferiores. La dirección es:

```
pages → features → shared → app
```

```
+----------------------------------------------------+
|                   pages                             |
|  HomePage, CheckoutPage, SuccessPage                |
+-----------------------------------+
                |  (importa features y shared)
                v
+-----------------------------------+
|                features           |
|  products, cart, checkout, theme  |
+-----------------------------------+
                |  (importa shared y app)
                v
+-----------------------------------+
|                shared             |
|  ui, hooks, api, lib, constants   |
+-----------------------------------+
                |  (importa app/config)
                v
+-----------------------------------+
|                app                |
|  config, api, routing             |
+-----------------------------------+
```

---

## Capa `app/` — Configuración Global

```typescript
// src/app/config/queryClient.ts
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,      // 5 min
            gcTime: 1000 * 60 * 30,         // 30 min
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});
```

| Archivo | Propósito |
|---------|-----------|
| `app/config/env.ts` | Variables de entorno (VITE_API_BASE_URL) |
| `app/config/queryClient.ts` | Cliente de TanStack Query |
| `app/routing/AppRouter.tsx` | Enrutador con lazy loading |
| `app/api/apiClient.ts` | Cliente HTTP base con `ApiError` |

---

## Capa `features/` — Módulos Funcionales

Cada feature sigue una estructura interna de 5 subcapas:

```
features/products/
├── domain/            ← Tipos y lógica de negocio pura
│   └── productTypes.ts
├── infrastructure/    ← Comunicación con APIs externas
│   └── productsApi.ts
├── application/       ← Hooks, contextos, estado de aplicación
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useProductModal.ts
│   ├── ProductModalContext.ts
│   ├── ProductModalProvider.tsx
│   └── types.ts
├── presentation/      ← Componentes de UI de la feature
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── ProductDetailModal.tsx
│   ├── SkeletonCard.tsx
│   └── components/
└── hooks/             ← Hooks específicos de la feature
```

**Features del proyecto:**

| Feature | Descripción |
|---------|-------------|
| `products` | Catálogo, búsqueda, filtros, modal de detalle |
| `cart` | Carrito de compras, drawer, persistencia localStorage |
| `checkout` | Formulario de pago, validación, reducer, descuentos |
| `theme` | Modo claro/oscuro, persistencia, detección prefers-color-scheme |

---

## Capa `shared/` — Código Compartido

```
shared/
├── api/               ← Cliente HTTP genérico
│   ├── httpClient.ts
│   └── index.ts
├── hooks/             ← Hooks genéricos reutilizables
│   ├── useDebounce.ts
│   ├── useLogLifecycle.ts
│   └── index.ts
├── lib/               ← Utilidades puras
│   ├── cn.ts               (clsx + tailwind-merge)
│   ├── animations.ts       (variantes Framer Motion)
│   ├── stockUtils.ts       (getStockStatus)
│   └── index.ts
├── constants/         ← Constantes compartidas
│   ├── routes.ts           (ROUTES)
│   ├── queryKeys.ts        (QUERY_KEYS)
│   └── index.ts
└── ui/                ← Componentes de UI base
    ├── Button/
    ├── Card/
    ├── Layout.tsx
    ├── Navbar.tsx
    ├── LazyImage.tsx
    ├── ErrorBoundary.tsx
    ├── ErrorMessage.tsx
    ├── EmptyState.tsx
    ├── Loader.tsx
    ├── dialog.tsx
    ├── sheet.tsx
    └── ...
```

---

## Barrel files

Cada módulo exporta desde un `index.ts` para simplificar las importaciones:

```typescript
// src/shared/lib/index.ts
export * from './cn'
export * from './animations'
export * from './stockUtils'
```

```typescript
// Consumo limpio
import { cn, fadeIn, getStockStatus } from '@/shared/lib'
```

---

## Path aliases (Vite + TypeScript)

Configurados en `vite.config.js` y `tsconfig.json`:

| Alias | Resuelve a |
|-------|------------|
| `@` | `./src` |
| `@shared` | `./src/shared` |
| `@features` | `./src/features` |
| `@pages` | `./src/pages` |
| `@entities` | `./src/entities` |
| `@widgets` | `./src/widgets` |

```typescript
import { useProducts } from '@/features/products/application/useProducts'
import { cn } from '@/shared/lib/cn'
```

---

## Enlaces relacionados

- [03-TECNOLOGIAS.md](./03-TECNOLOGIAS.md) — Stack tecnológico
- [06-ESTADO-GLOBAL.md](./06-ESTADO-GLOBAL.md) — Gestión de estado
- [GLOSARIO.md](./GLOSARIO.md) — Términos: FSD, barrel file, path alias
