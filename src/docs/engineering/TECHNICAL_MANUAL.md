# 🛠️ Technical Manual — MyProjectAPI12
> **Versión:** 2.0.0 | **Última actualización:** 2026-03-13 | **Estado:** ✅ Activo

Este documento es la fuente de verdad técnica para el proyecto. Consolida decisiones de arquitectura, estándares de código, sistema de diseño, testing y despliegue.

---

## 1. 🚀 Tech Stack

| Capa | Tecnología | Versión |
|---|---|---|
| UI Framework | React | 18.3 |
| Language | TypeScript | 5.9 (Strict) |
| Build Tool | Vite | 5.4 |
| Styling | Tailwind CSS (CSS-first) | v4.1 |
| Server State | TanStack Query | v5 |
| Routing | React Router | v7 |
| Animations | Framer Motion | v12 |
| Icons | react-icons/hi2 | latest |
| Unit Testing | Vitest + React Testing Library | 4.0 / 16 |
| Component Primitives | Radix UI + Shadcn/ui | latest |

> **Nota:** Los iconos provienen de `react-icons/hi2` (Heroicons v2). Verificar exportaciones antes de usar: `HiMiniCircle` **no existe** → usar SVG inline o `HiMiniXCircle`.

---

## 2. 🏁 Comenzar el Desarrollo

### Requisitos
- Node.js ≥ 18.0
- npm o pnpm ≥ 8.0

### Instalación

```bash
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12
npm install        # o: pnpm install
npm run dev        # Servidor local con HMR
```

### Variables de Entorno

```env
VITE_API_BASE_URL=https://dummyjson.com
```

### Scripts disponibles

```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build de producción → /dist
npm run preview        # Preview del build
npm run lint           # ESLint check
npm run type-check     # tsc --noEmit (0 errores esperados)
npm run test           # Vitest (watch)
npm run test -- --run  # Vitest (single run)
npm run test:coverage  # Cobertura
npm run deploy         # Build + deploy a GitHub Pages
```

---

## 3. 🏗️ Arquitectura

El proyecto sigue una **Feature-Based Clean Architecture** (DDD + FSD Hybrid).

```
src/
├── app/              # Configuración global: router, providers, API client
├── components/
│   ├── ui/           # Primitivos UI (Button, Input, Card, DropdownMenu...)
│   └── common/       # Comunes (Navbar, Loader, ErrorBoundary, ImageZoom)
├── features/         # Módulos por feature
│   └── {feature}/
│       ├── domain/        # Tipos puros, utils, lógica de negocio sin React
│       ├── application/   # Hooks, Context, Providers, use cases
│       ├── infrastructure/# API clients, data mappers
│       └── presentation/  # Componentes React
├── shared/           # Utilidades globales (cn, stockUtils, animations)
├── pages/            # Páginas (HomeHeader, HomeContent)
├── widgets/          # Componentes compuestos grandes (Navbar, CartDrawer)
├── test/             # Infraestructura de testing
│   └── factories/    # Factories de datos (makeProduct, makeCartItem)
├── docs/             # Documentación técnica
└── index.css         # Diseño system (Tailwind @theme)
```

### Capas y Reglas de Dependencia

```
presentation → application → domain
                          ↘ infrastructure
```
- **domain**: 100% puro. Sin imports de React, sin side effects.
- **application**: React hooks, Context. No accede a `infrastructure` directamente.
- **infrastructure**: Fetchs, API mappers. Llamado solo desde `application`.
- **presentation**: Solo renderiza. Toda lógica en `application`.

---

## 4. 🎨 Sistema de Diseño (Color System v2)

El sistema usa **tokens semánticos CSS** definidos en `src/index.css` vía `@theme`. Todos los colores deben usarse a través de estos tokens — **nunca hardcodear** (ej: `text-slate-500`).

### Tokens disponibles

| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `bg-background` | `#ffffff` | `#020617` | Fondo base de páginas |
| `bg-card` | `#ffffff` | `#0a0e23` | Superficie de tarjetas |
| `text-foreground` | `#020617` | `#f8fafc` | Texto principal |
| `text-muted-foreground` | `#64748b` | `#94a3b8` | Texto secundario |
| `border-border` | `#e2e8f0` | `#1e293b` | Bordes y separadores |
| `bg-primary` | `#4651d6` | `#7389f2` | Acento principal (Indigo) |
| `text-primary-foreground` | `#ffffff` | `#020617` | Texto sobre primary |
| `bg-accent` | `#f8f1e7` | `#2c251a` | Hover, fondo acento |
| `text-accent-foreground` | `#b5945b` | `#d8cbaa` | Texto acento (Gold) |
| `bg-secondary` | `#f1f5f9` | `#1e293b` | Fondos alternativos |
| `text-success` | `#10b981` | `#10b981` | Stock disponible, éxito |
| `text-warning` | `#f59e0b` | `#f59e0b` | Stock bajo, advertencia |
| `bg-destructive` | `#ef4444` | `#ef4444` | Errores, eliminar |

### Regla anti-hardcode

```tsx
// ❌ MAL — No adapta al tema
<p className="text-slate-500 bg-white border-slate-200">

// ✅ BIEN — Se adapta a dark/light automáticamente
<p className="text-muted-foreground bg-card border-border">
```

### Tokens de shadow

```css
shadow-soft    /* Elevación sutil, cards en reposo     */
shadow-premium /* Elevación media, cards en hover      */
shadow-glass   /* Glassmorphism, modales y drawers     */
```

### Utilidades CSS adicionales

```css
.glass-card   /* Glassmorphism: backdrop-blur + bg translúcido */
.hover-lift   /* -translate-y-1 en hover                      */
.input-focus  /* Ring redondeado en focus (no rectangular)     */
.card-surface /* Atajo: bg-card + border-border + rounded-2xl  */
.text-gradient /* Gradiente de texto desde primary a accent    */
```

---

## 5. 📐 SearchInput — Bug del Ring Rectangular (Resuelto)

**Causa**: El `ring-2` se aplicaba al wrapper `<div>` sin `border-radius`, mientras `rounded-xl` solo estaba en el `<input>`.

**Solución**: El wrapper lleva `rounded-xl + border + ring`, el input es `bg-transparent`:

```tsx
<div className={cn(
  'relative flex items-center rounded-xl border',  // ← border-radius aquí
  isFocused && 'border-primary ring-2 ring-primary/30'  // ← ring también aquí
)}>
  <input className="bg-transparent rounded-xl focus:outline-none" />
</div>
```

---

## 6. 📦 Patrones de Componente

### ProductCard Footer (alineación correcta)

El footer de la card usa `items-end` (no `items-center`) para alinear el bloque de 2 líneas (precio + stock) con el botón por la base inferior:

```tsx
<CardFooter className="px-5 pb-5 pt-4 flex items-end justify-between gap-4 border-t border-border/50">
  <div className="flex flex-col gap-0.5 min-w-0">
    <span className="text-xl font-bold leading-none">${price.toFixed(2)}</span>
    <span className="text-success text-[10px]">{stock} en stock</span>
  </div>
  <Button className="shrink-0 self-end rounded-full ...">Ver detalles</Button>
</CardFooter>
```

> **Regla**: Para footers con bloques de altura diferente, usar `items-end` + `self-end`.

### ProductGrid (altura uniforme)

Para que el footer de todas las cards quede al mismo nivel horizontal:

```tsx
<m.div className="grid ... items-stretch">  {/* ← items-stretch */}
  {products.map(p => (
    <m.div className="h-full">  {/* ← h-full necesario */}
      <ProductCard product={p} />
    </m.div>
  ))}
</m.div>
```

---

## 7. 🧪 Testing

### Infraestructura de Test Factories

Los fixtures de test viven en `src/test/factories/`:

```typescript
import { makeProduct, makeCartItem } from "@/test/factories/productFactory";

// Producto con valores por defecto válidos (incluye `description` requerida)
const product = makeProduct({ price: 50, stock: 3 });

// CartItem = IProduct + quantity
const item = makeCartItem({ id: 2, quantity: 3 });
```

> **⚠️ Importante**: Siempre usar las factories en lugar de objetos literales. El campo `description` es **requerido** en `IProduct` y los objetos incompletos causarán errores TS2741.

### Errores corregidos (2026-03-13)

| Error | Causa | Fix |
|---|---|---|
| `TS2459: IProduct not exported` | `cartTypes.ts` importaba pero no re-exportaba `IProduct` | Añadido `export type { IProduct }` |
| `TS2724: HiMiniCircle not found` | `dropdown-menu.tsx` importaba un ícono inexistente | SVG inline circle |
| `TS2741: description missing` | Fixtures de test incompletos | Refactorizados con `makeProduct` factory |
| Toast en inglés | `useCartActions` mezclaba idiomas | Corregido a español |

---

## 8. 🚢 Despliegue

GitHub Actions despliega automáticamente a GitHub Pages en cada push a `main`:

```
push to main → lint → build → deploy → github-pages
```

**URL Live:** [https://slinkter.github.io/myprojectapi12/](https://slinkter.github.io/myprojectapi12/)

---

_Documento reescrito: 2026-03-13 | Autor: Gemini Engineering Agent_
