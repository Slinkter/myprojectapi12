# 03 — Tecnologías del Stack

---

## React 18

Librería de UI declarativa basada en componentes.

- **`React.StrictMode`** en `main.tsx` detecta problemas en desarrollo.
- **`React.FC`** tipo para componentes funcionales.
- **`React.memo`** para evitar re-renders innecesarios (ej: `ProductCard.tsx:96`).
- **`forwardRef`** para pasar refs a componentes hijos (ej: `Button.tsx:38`).
- **`Suspense`** + `lazy()` para carga diferida de páginas en `AppRouter.tsx`.

```typescript
const Home = lazy(() => import("@/pages/Home"));

<Routes>
    <Route path="/" element={<Home />} />
</Routes>
```

---

## TypeScript

Tipado estático estricto (`strict: true` en `tsconfig.json`).

- **`noUnusedLocals`**, **`noUnusedParameters`**: evita código muerto.
- **`noImplicitReturns`**: obliga a que todas las rutas retornen un valor.
- **Discriminated unions** para acciones del reducer:

```typescript
// src/features/checkout/application/types.ts
export type CheckoutAction =
    | { type: "SET_FIELD_VALUE"; payload: { name: keyof ICardInfo; value: string } }
    | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
    | { type: "SET_ERRORS"; payload: IValidationErrors }
    | { type: "SET_CARD_TYPE"; payload: string };
```

- **`as const`** para objetos constantes como `ROUTES` y `QUERY_KEYS`.

---

## Vite

Herramienta de build ultrarrápida.

- **HMR** (Hot Module Replacement): cambios en caliente.
- **Plugins**: `@vitejs/plugin-react` + `@tailwindcss/vite`.
- **Path aliases** configurados en `vite.config.js`.
- **Base URL**: `/myprojectapi12/` para GitHub Pages.

---

## Tailwind CSS v4

Framework CSS utility-first basado en el motor Lightning CSS.

- **Enfoque CSS-first**: `@import "tailwindcss"` en `index.css` (sin archivo `tailwind.config.js`).
- **`@theme`** para tokens de diseño personalizados:

```css
@theme {
    --color-primary: #059669;
    --color-accent: #d97706;
    --color-background-light: #f4f6f8;
    --color-background-dark: #0b0c15;
}
```

- **`@custom-variant`** para dark mode:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

- **Variables CSS semánticas**: `--background`, `--foreground`, `--card`, etc.

---

## TanStack Query v5

Gestión de estado del servidor (server state).

| Concepto | Configuración | Archivo |
|----------|--------------|---------|
| `staleTime` | 5 minutos | `queryClient.ts:21` |
| `gcTime` | 30 minutos | `queryClient.ts:22` |
| `retry` | 2 reintentos | `queryClient.ts:23` |
| `refetchOnWindowFocus` | `false` | `queryClient.ts:24` |

Hooks principales:

- `useInfiniteQuery` → paginación infinita de productos
- `useQuery` → categorías, detalle de producto

---

## Context API

Estado global de UI (no server state):

| Contexto | Estado | Archivo |
|----------|--------|---------|
| `CartContext` | Lista de items, drawer | `CartContext.tsx` |
| `ThemeContext` | Modo claro/oscuro | `ThemeContext.tsx` |
| `ProductModalContext` | Modal de producto | `ProductModalContext.ts` |

---

## Radix UI (Shadcn)

Primitivas de componentes accesibles y sin estilos:

- `dialog.tsx` — Modal base
- `dropdown-menu.tsx` — Menú desplegable de categorías
- `sheet.tsx` — Drawer del carrito
- `scroll-area.tsx` — Área desplazable
- `input.tsx`, `label.tsx` — Formularios

---

## Framer Motion

Animaciones declarativas:

- `m.div`, `m.button` — elementos animados
- `AnimatePresence` — animaciones de entrada/salida
- `useReducedMotion()` — respeta preferencias de accesibilidad
- Variantes en `shared/lib/animations.ts`: `fadeIn`, `slideUp`, `staggerContainer`, `modalSlideUp`

---

## Otras dependencias

| Librería | Uso |
|----------|-----|
| `lucide-react` | Iconos (ShoppingCart, Search, X, etc.) |
| `react-icons` | Iconos adicionales (HiOutlineMoon, etc.) |
| `react-hot-toast` | Notificaciones toast |
| `class-variance-authority` | Variantes de componentes (Button) |
| `clsx` + `tailwind-merge` | `cn()` utility para merge de clases |
| `gh-pages` | Despliegue a GitHub Pages |
| `husky` | Git hooks (pre-commit) |

---

## Enlaces relacionados

- [02-ESTRUCTURA.md](./02-ESTRUCTURA.md) — Cómo se organizan estas tecnologías
- [06-ESTADO-GLOBAL.md](./06-ESTADO-GLOBAL.md) — Context vs TanStack Query
- [09-ESTILOS.md](./09-ESTILOS.md) — Tailwind v4 en detalle
