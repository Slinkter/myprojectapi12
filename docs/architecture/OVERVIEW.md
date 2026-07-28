# Vista General de la Arquitectura

## Propósito

Aplicación SPA (Single Page Application) de comercio electrónico que consume la API de DummyJSON para explorar productos, gestionar un carrito de compras y simular un proceso de pago.

## Stack Principal

- **React 18** con `React.StrictMode` y componentes funcionales
- **TypeScript 5.9** con tipado estricto
- **Vite 5** como bundler y dev server
- **Tailwind CSS v4** con el plugin `@tailwindcss/vite`
- **React Router v7** para enrutamiento SPA
- **TanStack Query v5** para gestión de estado asíncrono
- **Framer Motion** para animaciones declarativas
- **class-variance-authority** + **tailwind-merge** para variantes de componentes

## Arquitectura FSD (Feature-Sliced Design)

El proyecto sigue una arquitectura modular inspirada en FSD con las siguientes capas:

```
src/
├── app/            # Capa de aplicación: configuración global
│   ├── api/        # Cliente API estandarizado (apiClient)
│   ├── config/     # Configuración: env.ts, queryClient.ts
│   └── routing/    # Enrutador principal (AppRouter.tsx)
├── entities/       # Capa dominial de entidades compartidas (FSD)
│   ├── product/    # Modelo, tipos y utilidades dominiales de Producto
│   ├── cart-item/  # Modelo y tipos dominiales de CartItem
│   └── order/      # Modelo y tipos dominiales de Pedido/Orden
├── features/       # Features: módulos funcionales autónomos
│   ├── cart/       # Carrito de compras
│   ├── checkout/   # Proceso de pago
│   ├── products/   # Productos
│   └── theme/      # Tema claro/oscuro
├── pages/          # Páginas de la aplicación
│   ├── Home.tsx
│   └── HomeContent.tsx
├── shared/         # Código compartido entre features
│   ├── constants/  # Rutas y query keys
│   ├── hooks/      # Hooks compartidos (useDebounce, useLocalStorage, useLogLifecycle)
│   ├── lib/        # Utilidades (cn, animaciones)
│   └── ui/         # Componentes de UI primitivos
├── widgets/        # Componentes complejos de nivel superior (Navbar)
├── App.tsx         # Componente raíz con providers
└── main.tsx        # Punto de entrada
```

### Estructura interna de una Feature

Cada feature sigue una sub-arquitectura en 3 capas:

```
features/products/
├── domain/           # Lógica pura de negocio, tipos, utilidades
│   └── productTypes.ts
├── application/      # Hooks, contextos, lógica de aplicación
│   ├── useProducts.ts
│   ├── useCategories.ts
│   └── ProductModalContext.ts
├── infrastructure/   # Comunicación con APIs externas
│   └── productsApi.ts
└── presentation/     # Componentes de UI
    ├── ProductCard.tsx
    ├── ProductGrid.tsx
    └── components/
        ├── SearchInput.tsx
        └── QuantityControl.tsx
```

## Enrutamiento

El `AppRouter` (en `src/app/routing/AppRouter.tsx`) define las rutas con carga diferida (lazy loading):

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/checkout-success" element={<CheckoutSuccess />} />
  <Route path="*" element={<Home />} />
</Routes>
```

El `BrowserRouter` usa el basename `/myprojectapi12/` para compatibilidad con GitHub Pages.

## Jerarquía de Providers

```
QueryClientProvider        ← TanStack Query
  └── ThemeProvider        ← Tema claro/oscuro
      └── CartProvider     ← Estado del carrito
          └── BrowserRouter
              └── LazyMotion (Framer Motion)
                  └── ErrorBoundary
                      └── Layout
                          └── AppRouter
```

## Gestión de Estado

- **Estado global síncrono**: Context API con `useReducer` y `useMemo`
- **Estado asíncrono**: TanStack Query con caché, staleTime y paginación infinita
- **Estado local**: `useState` con `useCallback` para memoización
- **Persistencia**: localStorage para carrito (`api12-cart-storage`) y tema (`theme`)

## Animaciones

Framer Motion con `LazyMotion` + `domAnimation` para carga diferida del motor de animaciones. Variantes predefinidas en `src/shared/lib/animations.ts`:

- `fadeIn`, `slideUp`, `staggerContainer`
- `scaleIn`, `slideInFromRight`, `modalSlideUp`
- `backdropFade`, `pageFadeIn`
