# Documentación de myprojectapi12

**myprojectapi12** es una aplicación SPA de comercio electrónico construida con React 18, TypeScript, Vite y Tailwind CSS v4. Consume la API pública de [DummyJSON](https://dummyjson.com/) para mostrar productos, gestionar un carrito de compras y procesar un flujo de checkout simulado.

## Arquitectura

| Documento | Descripción |
|-----------|-------------|
| [Vista General](architecture/OVERVIEW.md) | Arquitectura FSD, estructura de directorios, enrutamiento |
| [Stack Tecnológico](architecture/TECH-STACK.md) | Tecnologías, versiones y dependencias clave |

## API

| Documento | Descripción |
|-----------|-------------|
| [Cliente HTTP](api/API-CLIENT.md) | `httpClient`, `apiClient`, manejo de errores, interceptores |
| [API de Productos](api/PRODUCTS-API.md) | Endpoints DummyJSON para productos y categorías |
| [Referencia Completa](api/API-REFERENCE.md) | Todos los endpoints, parámetros, tipos de retorno |

## Features

| Documento | Descripción |
|-----------|-------------|
| [Carrito](features/CART.md) | `CartContext`, `useCart`, `useCartActions`, `useCartDrawer`, tipos, utilidades |
| [Checkout](features/CHECKOUT.md) | `useCheckout`, `checkoutReducer`, validación, descuentos, formularios |
| [Productos](features/PRODUCTS.md) | `useProducts`, `useCategories`, `ProductCard`, `ProductGrid`, búsqueda, scroll infinito |
| [Tema](features/THEME.md) | `ThemeContext`, `themeStorage`, `ThemeSwitcher` |

## Componentes UI

| Documento | Descripción |
|-----------|-------------|
| [UI Kit](components/UI-KIT.md) | Todos los componentes `shared/ui`: Button, Card, Dialog, Sheet, Input, Label, Navbar, Layout, Loader, ErrorBoundary, etc. |

## Patrones

| Documento | Descripción |
|-----------|-------------|
| [Hooks](patterns/HOOKS.md) | Custom hooks: `useDebounce`, `useLogLifecycle`, `useCart`, `useCartActions`, `useProducts`, `useCategories`, `useCheckout`, `useDiscountValidation`, `useProductSearch` |
| [Contextos](patterns/CONTEXTS.md) | Patrones de contexto: `ThemeContext`, `CartContext`, `ProductModalContext` |

## Operaciones

| Documento | Descripción |
|-----------|-------------|
| [Despliegue](operations/DEPLOYMENT.md) | GitHub Actions, pnpm build, GitHub Pages |
| [Solución de Problemas](operations/TROUBLESHOOTING.md) | Errores comunes de lint, tipos, compilación, CORS, CSP, alias |
