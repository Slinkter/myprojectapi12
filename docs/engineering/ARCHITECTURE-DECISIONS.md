# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas siguiendo el formato de Michael Nygard (*Documenting Architecture Decisions*).

---

## ADR-001: React como Framework de UI

| Campo | Valor |
|---|---|
| **Contexto** | Necesitamos construir una SPA de comercio electrónico interactiva con actualizaciones dinámicas de UI |
| **Decisión** | Usar React 18 con componentes funcionales y hooks |
| **Alternativas** | Vue 3, Svelte, Angular, Solid |
| **Estado** | Aceptada |
| **Consecuencias** | Ecosistema maduro, gran comunidad, React DevTools, facilidad de contratación. Bundle size mayor que Svelte o Solid |
| **Fundamento** | React ofrece el mejor equilibrio entre madurez, ecosistema (TanStack Query, Framer Motion, React Router) y rendimiento para una SPA de este tamaño |

---

## ADR-002: TypeScript en Modo Estricto

| Campo | Valor |
|---|---|
| **Contexto** | El código base debe ser mantenible y resistente a errores en tiempo de ejecución |
| **Decisión** | Usar TypeScript 5.9 con `strict: true` en `tsconfig.json` |
| **Alternativas** | JavaScript puro, TypeScript sin strict, Flow |
| **Estado** | Aceptada |
| **Consecuencias** | Mayor tiempo de escritura inicial, pero detección de errores en compilación. Curva de aprendizaje para developers menos experimentados |
| **Fundamento** | Previene bugs comunes (null/undefined, tipos incorrectos, retornos no contemplados) y sirve como documentación viva |

---

## ADR-003: Vite en lugar de Create React App

| Campo | Valor |
|---|---|
| **Contexto** | Necesitamos un bundler rápido con HMR, TypeScript y Tailwind CSS |
| **Decisión** | Usar Vite 5 como build tool |
| **Alternativas** | Create React App (CRA), Webpack, Turbopack, Parcel |
| **Estado** | Aceptada |
| **Consecuencias** | HMR instantáneo, builds rápidos, configuración mínima. CRA quedó deprecado. Vite es el estándar de facto en la comunidad React |
| **Fundamento** | Vite es significativamente más rápido que Webpack/CRA, tiene soporte nativo para TypeScript y Tailwind v4 vía plugin |

---

## ADR-004: Tailwind CSS v4 (CSS-first)

| Campo | Valor |
|---|---|
| **Contexto** | Necesitamos estilos rápidos, consistentes y responsivos sin archivos CSS separados |
| **Decisión** | Usar Tailwind CSS v4 con el plugin `@tailwindcss/vite` |
| **Alternativas** | CSS Modules, Styled Components, Emotion, vanilla CSS, Bootstrap |
| **Estado** | Aceptada |
| **Consecuencias** | Sin `tailwind.config.js` ni `postcss.config.js` — todo se configura vía CSS. Bundle CSS purgado automáticamente |
| **Fundamento** | Tailwind v4 elimina la configuración JS, se integra nativamente con Vite, y produce CSS optimizado sin clases no usadas. Utility-first permite desarrollo rápido sin cambiar de archivo |

---

## ADR-005: TanStack Query para Estado del Servidor

| Campo | Valor |
|---|---|
| **Contexto** | La app consume datos asíncronos de una API REST y necesita caché, re-fetch, paginación y estados de carga |
| **Decisión** | Usar TanStack Query v5 para gestión de estado asíncrono |
| **Alternativas** | RTK Query, SWR, useEffect + useState manual, Apollo Client (GraphQL) |
| **Estado** | Aceptada |
| **Consecuencias** | Elimina boilerplate de loading/error/data. Caché configurable con staleTime 5min y gcTime 30min. `useInfiniteQuery` para scroll infinito |
| **Fundamento** | TanStack Query es la solución más madura para React, con soporte nativo para paginación infinita, retry, refetch en background y devtools |

---

## ADR-006: Context API en lugar de Redux/Zustand

| Campo | Valor |
|---|---|
| **Contexto** | Necesitamos estado global compartido (carrito, tema) sin agregar complejidad |
| **Decisión** | Usar React Context API con `useReducer` + `useMemo` |
| **Alternativas** | Redux Toolkit, Zustand, Jotai, Pinia |
| **Estado** | Aceptada |
| **Consecuencias** | Sin dependencias externas. Para estado global pequeño (2 contextos), Context API es suficiente. Si el estado creciera, migrar a Zustand sería sencillo |
| **Fundamento** | El estado global es mínimo (carrito + tema). Context API nativo elimina la sobrecarga de Redux (actions, reducers, slices, store) innecesaria para este alcance |

---

## ADR-007: Framer Motion para Animaciones

| Campo | Valor |
|---|---|
| **Contexto** | La app necesita animaciones fluidas: transiciones entre páginas, entrada de tarjetas, drawer del carrito, micro-interacciones |
| **Decisión** | Usar Framer Motion 12 con `LazyMotion` + `domAnimation` |
| **Alternativas** | CSS transitions/animations, GSAP, react-spring, anime.js, motion (nuevo) |
| **Estado** | Aceptada |
| **Consecuencias** | +124 KB gzip al bundle principal. `LazyMotion` con `domAnimation` reduce el impacto cargando solo el motor de animaciones DOM (no SVG/gestures) |
| **Fundamento** | Framer Motion ofrece la API más expresiva para React: variants, AnimatePresence, layout animations, spring physics, whileInView. GSAP no está tan integrado con React |

---

## ADR-008: Feature-Sliced Design (FSD)

| Campo | Valor |
|---|---|
| **Contexto** | El proyecto necesita una estructura escalable que separe concerns por dominio de negocio |
| **Decisión** | Usar arquitectura FSD: `features/<feature>/{domain, application, infrastructure, presentation}` |
| **Alternativas** | Arquitectura plana (`components/`, `pages/`, `hooks/`), Atomic Design, Clean Architecture |
| **Estado** | Aceptada |
| **Consecuencias** | Mayor estructura de carpetas. Cada feature es autónoma. Reglas de dependencia estrictas (presentation → application → domain). Curva de aprendizaje inicial |
| **Fundamento** | FSD escala mejor que estructura plana: cada feature contiene su propia lógica, UI y tipos. La regla de dependencia unidireccional previene imports cruzados. Ideal para equipos medianos |

---

## ADR-009: React Router v7 con Lazy Loading

| Campo | Valor |
|---|---|
| **Contexto** | La app tiene 3 rutas principales; las páginas deben cargarse bajo demanda para optimizar el bundle inicial |
| **Decisión** | Usar React Router v7 con `React.lazy()` + `Suspense` |
| **Alternativas** | React Router v6 (similar), TanStack Router, wouter, páginas sin lazy loading |
| **Estado** | Aceptada |
| **Consecuencias** | Cada página es un chunk separado (~29 kB Home, ~23 kB Checkout, ~1 kB Success). La carga inicial es más rápida |
| **Fundamento** | Code-splitting por ruta es la estrategia recomendada para SPAs. React Router v7 mantiene compatibilidad con v6 y ofrece BrowserRouter con basename para GitHub Pages |

---

## ADR-010: pnpm en lugar de npm

| Campo | Valor |
|---|---|
| **Contexto** | El gestor de paquetes debe ser rápido, seguro y eficiente en espacio en disco |
| **Decisión** | Usar pnpm ≥ 8 como gestor de paquetes |
| **Alternativas** | npm, yarn classic, yarn berry |
| **Estado** | Aceptada |
| **Consecuencias** | `node_modules` con linking simbólico. `pnpm-lock.yaml` en lugar de `package-lock.json`. CI usa `pnpm/action-setup@v3` |
| **Fundamento** | pnpm es más rápido que npm, usa menos espacio (contenido compartido), y tiene mejor seguridad (no permite dependencias implícitas) |
