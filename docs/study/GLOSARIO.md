# Glosario de Términos Técnicos

Más de 50 términos usados en el proyecto myprojectapi12, ordenados alfabéticamente.

---

## A

**API (Application Programming Interface)**
Conjunto de endpoints HTTP que el frontend consume. En este proyecto, se consume la API pública DummyJSON en `https://dummyjson.com`.

**`as const`**
Aserción de TypeScript que marca un objeto como de solo lectura e infiere tipos literales. Se usa en `ROUTES` y `QUERY_KEYS` para obtener tipado preciso.

---

## B

**Barrel file**
Archivo `index.ts` que re-exporta múltiples módulos para simplificar las importaciones. Ejemplo: `src/shared/lib/index.ts` exporta `cn`, `animations` y `stockUtils`.

**Bundle**
Archivo único (o conjunto de archivos) generado por Vite que contiene todo el código JavaScript optimizado para producción.

**Base URL**
Ruta base de la aplicación en el servidor. En Vite se configura con `base: "/myprojectapi12/"` para GitHub Pages.

---

## C

**CVA (Class Variance Authority)**
Librería para definir variantes de componentes con TypeScript. Se usa en el componente `Button` para manejar variantes (default, destructive, outline, ghost, link) y tamaños.

**CI/CD (Continuous Integration / Continuous Deployment)**
Práctica de automatizar la integración y despliegue de código. En este proyecto, GitHub Actions ejecuta lint → build → deploy en cada push a main.

**`cn()`**
Función utility que combina `clsx` y `tailwind-merge` para unir clases CSS sin conflictos. Definida en `src/shared/lib/cn.ts`.

**Composición**
Patrón donde componentes pequeños y reutilizables se combinan para crear interfaces complejas. Ejemplo: `ProductList` compone `ProductGrid`, `ErrorMessage`, `EmptyState`.

**Compound Components**
Patrón donde un componente padre expone sub-componentes que comparten estado implícitamente. Ejemplo: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.

**Context API**
Sistema de React para compartir estado global sin props drilling. Se usa para tema, carrito y modal de producto.

**CSP (Content Security Policy)**
Cabecera HTTP que controla qué recursos puede cargar el navegador. Definida en `index.html` para restringir scripts, estilos, fuentes y conexiones.

**Cursor pagination**
Estrategia de paginación que usa un cursor (número de página) para navegar entre páginas. En este proyecto: `pageParam` → `skip = (page - 1) * 20`.

**Custom Hook**
Función de React que encapsula lógica reutilizable usando hooks nativos. Prefijo `use` obligatorio. Ej: `useDebounce`, `useCart`, `useProducts`.

---

## D

**Dark Mode**
Tema oscuro de la UI. Implementado con contexto `ThemeContext`, clase `.dark` en `<html>`, y variables CSS semánticas.

**DDD (Domain-Driven Design)**
Enfoque de diseño donde la estructura del código refleja el dominio del negocio. Las capas `domain/` contienen tipos y lógica pura de negocio.

**Debounce**
Técnica que retrasa la ejecución de una función hasta que transcurre un tiempo sin nuevas llamadas. Implementado en `useDebounce`.

**Design Tokens**
Variables de diseño (colores, espaciados, tipografía) definidas centralmente. En Tailwind v4 se definen con `@theme` en CSS.

**Discriminated Union**
Tipo de TypeScript que usa una propiedad literal (`type`) para diferenciar variantes. Usado en `CheckoutAction` para el reducer.

---

## E

**Early Return**
Patrón donde las validaciones retornan inmediatamente al encontrar un error, evitando anidamiento. Implementado en `validateCardInfo`.

**Error Boundary**
Componente de clase de React que captura errores de renderizado en su árbol de hijos. Hay dos: `ErrorBoundary` (global) y `FeatureErrorBoundary` (por feature).

---

## F

**`flatMap()`**
Método de array que primero mapea y luego aplana un nivel. Usado para convertir `pages[][]` de `useInfiniteQuery` en un array plano de productos.

**Framer Motion**
Librería de animaciones declarativas para React. Usa variantes (`Variants`), `AnimatePresence`, `m.` elementos y `useReducedMotion`.

**FSD (Feature-Sliced Design)**
Arquitectura que organiza el código por funcionalidades (features) en lugar de por tipo técnico. Capas: app, pages, features, shared, entities.

---

## G

**`gcTime` (garbage collection time)**
Tiempo que TanStack Query mantiene los datos en caché después de que se marcan como stale. Configurado a 30 minutos.

**GitHub Actions**
Plataforma de CI/CD integrada en GitHub. El pipeline `.github/workflows/deploy.yml` automatiza build y deploy.

**Glassmorphism**
Efecto visual de vidrio esmerilado con transparencia y blur. Implementado con la clase `.glass-panel` que usa `backdrop-filter: blur(12px)`.

---

## H

**HMR (Hot Module Replacement)**
Capacidad de Vite de reemplazar módulos en caliente sin recargar la página completa, preservando el estado de la app.

**Hook**
Función de React que permite usar estado y ciclo de vida en componentes funcionales. Reglas: solo llamarlos en el nivel superior, solo en componentes o hooks.

**HttpError**
Clase de error personalizada que extiende `Error` e incluye `status` y `statusText` de la respuesta HTTP. Definida en `httpClient.ts`.

---

## I

**Infinite Scroll**
Patrón de UX donde el contenido se carga progresivamente al hacer scroll. Implementado con `useInfiniteQuery` en `useProducts.ts`.

**IntersectionObserver**
API nativa del navegador para detectar cuándo un elemento entra en el viewport. Usado implícitamente por el atributo `loading="lazy"` en imágenes.

---

## J

**JSX (JavaScript XML)**
Extensión de sintaxis de React que permite escribir HTML en JavaScript. Compilado por Vite a `React.createElement`.

**JSDoc**
Sistema de documentación en comentarios (`/** ... */`) para TypeScript/JavaScript. Todo el proyecto está anotado con JSDoc en español.

---

## L

**Lazy Loading**
Carga diferida de módulos o recursos cuando son necesarios. Implementado con `React.lazy()` + `Suspense` en `AppRouter.tsx` y con `loading="lazy"` en imágenes.

**Luhn Algorithm**
Algoritmo de validación de números de tarjetas de crédito. Suma dígitos con duplicación alternada y verifica que el total sea múltiplo de 10.

**Lucide React**
Librería de iconos como componentes React. Usada en todo el proyecto: `ShoppingCart`, `Search`, `X`, `ChevronDown`, `Heart`, etc.

---

## M

**Mapper**
Función que transforma datos de un formato a otro. En el proyecto, el `flatMap` de `useProducts.ts` funciona como mapper de páginas a productos planos.

**Memoization**
Técnica de optimización que cachea resultados de funciones costosas. Implementada con `React.memo` (componentes), `useMemo` (valores), `useCallback` (funciones).

**`motion.div` (`m.div`)**
Componente de Framer Motion que envuelve un `div` y permite animaciones declarativas con props como `whileHover`, `animate`, `initial`, `exit`.

---

## P

**Path Alias**
Atajo de importación configurado en `vite.config.js` y `tsconfig.json`. Ejemplo: `@/features/products` → `src/features/products`.

**Portal**
Mecanismo de React (`createPortal`) para renderizar un componente fuera del árbol DOM normal. Usado en `Cart.tsx` y `ProductDetailModal.tsx`.

**`prefers-color-scheme`**
Media query CSS que detecta la preferencia de tema del sistema operativo. Usada en `themeStorage.ts` para determinar el tema inicial.

**Provider**
Componente que envuelve a otros y proporciona contexto. Ej: `CartProvider`, `ThemeProvider`, `ProductModalProvider`, `QueryClientProvider`.

---

## Q

**Query Key**
Identificador único de una consulta en TanStack Query. Estructura jerárquica: `["products", category]`, `["categories"]`. Definido en `queryKeys.ts`.

**`QueryClient`**
Instancia central de TanStack Query que gestiona la caché y las consultas. Configurado en `app/config/queryClient.ts`.

---

## R

**Radix UI**
(Llamado "Radix" en el proyecto) Conjunto de primitivas de UI accesibles y sin estilos. Base de los componentes shadcn/ui como Dialog, DropdownMenu, ScrollArea.

**Reducer** (`useReducer`)
Hook de React para manejar estado complejo con acciones tipadas. Implementado en `checkoutReducer.ts` con acciones discriminadas.

**`React.FC`**
Tipo de TypeScript para componentes funcionales de React. No es obligatorio pero se usa en el proyecto para consistencia.

**Refetch**
Recarga de datos desde la API. Configurado con `refetchOnWindowFocus: false` y `refetchOnReconnect: true` en el QueryClient.

---

## S

**Server State**
Estado que proviene del servidor y se sincroniza con TanStack Query (productos, categorías). Distinto del estado de UI (carrito, tema, modal).

**Shadcn/UI**
Colección de componentes basados en Radix UI con estilos Tailwind. No es una librería instalable sino componentes copiados al proyecto. Ej: `dialog.tsx`, `sheet.tsx`.

**Skeleton**
Placeholder visual que se muestra mientras el contenido carga. Implementado como `SkeletonCard` y `SkeletonGrid` en la feature de productos.

**`staleTime`**
Tiempo que TanStack Query considera los datos como frescos antes de marcarlos como obsoletos. Configurado a 5 minutos para productos.

**`Suspense`**
Componente de React que muestra un fallback mientras se cargan componentes lazy. Usado en `AppRouter.tsx` con `<Loader />`.

---

## T

**Tailwind CSS v4**
Framework CSS utility-first. Versión 4 con enfoque CSS-first, `@theme` para tokens, `@import "tailwindcss"` sin archivo de configuración.

**TanStack Query (React Query v5)**
Librería para gestión de estado del servidor. Proporciona `useQuery`, `useInfiniteQuery`, caché, re-intentos, devtools.

**Theme**
Modo visual de la aplicación (claro/oscuro). Gestionado por `ThemeContext` con persistencia en localStorage y detección del sistema.

**Toast**
Notificación temporal que aparece en la UI. Implementado con `react-hot-toast` para feedback de acciones (añadir al carrito, eliminar, error).

**Tree-shaking**
Eliminación de código no utilizado durante el build. Vite y esbuild lo realizan automáticamente para reducir el tamaño del bundle.

**`tsc --noEmit`**
Comando de TypeScript que verifica tipos sin generar archivos JavaScript. Usado en `pnpm type-check`.

**Type Guard**
Función que verifica el tipo de un valor en tiempo de ejecución. El `useContext` con verificación `if (!context)` actúa como type guard en los hooks de contexto.

---

## U

**`useCallback`**
Hook de React que memoiza funciones para evitar su recreación en cada render. Usado en `useCartActions`, `useProductModal`, `useCheckout`.

**`useInfiniteQuery`**
Hook de TanStack Query para paginación infinita. Proporciona `fetchNextPage`, `hasNextPage`, `data.pages`. Implementado en `useProducts.ts`.

**`useMemo`**
Hook de React que memoiza valores calculados. Usado en `CartContext` para `totalPrice` y `totalItems`, y en `HomeContent` para `filteredProducts`.

**`useQuery`**
Hook de TanStack Query para consultas simples. Usado en `useCategories.ts` con `staleTime` de 1 hora.

**`useReducer`**
Hook de React para estado complejo con lógica de transición. Implementado en `useCheckout.ts` para el formulario de pago.

**`useState`**
Hook fundamental de React para estado local. Usado extensivamente en `useProductModal`, `useCartDrawer`, `ProductDetailModal`, `Navbar`.

---

## V

**Variants (Framer Motion)**
Objeto con estados de animación (`hidden`, `visible`, `exit`) que se aplican a componentes `m.*`. Definidos en `shared/lib/animations.ts`.

**Vite**
Herramienta de build ultrarrápida con HMR nativo. Usa esbuild para desarrollo y Rollup para producción.

---

## W

**`whileHover`**
Prop de Framer Motion que define animaciones al hacer hover. Usado en `ProductCard.tsx` para elevar la tarjeta.

---

## Enlaces relacionados

- [02-ESTRUCTURA.md](./02-ESTRUCTURA.md) — Términos FSD, barrel file, path alias
- [03-TECNOLOGIAS.md](./03-TECNOLOGIAS.md) — Stack tecnológico
- [04-ALGORITMOS.md](./04-ALGORITMOS.md) — Algoritmos y complejidad
- [06-ESTADO-GLOBAL.md](./06-ESTADO-GLOBAL.md) — Estrategias de estado
