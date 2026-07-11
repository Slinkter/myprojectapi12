# Stack Tecnológico

## Dependencias de Producción

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `react` | ^18.3.1 | Librería principal de UI |
| `react-dom` | ^18.3.1 | Renderizado DOM |
| `react-router-dom` | ^7.15.1 | Enrutamiento SPA |
| `@tanstack/react-query` | ^5.100.10 | Gestión de estado asíncrono |
| `framer-motion` | ^12.38.0 | Animaciones declarativas |
| `tailwind-merge` | ^3.6.0 | Fusión inteligente de clases Tailwind |
| `clsx` | ^2.1.1 | Construcción condicional de clases |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes |
| `lucide-react` | ^0.577.0 | Iconos SVG |
| `react-icons` | ^5.6.0 | Iconos adicionales (HiOutlineMoon, FaBitcoin) |
| `react-hot-toast` | ^2.6.0 | Notificaciones toast |
| `@tailwindcss/vite` | ^4.3.0 | Plugin de Tailwind para Vite |
| `playwright-core` | ^1.61.1 | Core de Playwright |

## Dependencias de Desarrollo

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `typescript` | ^5.9.3 | Compilador TypeScript |
| `vite` | ^5.4.21 | Bundler y dev server |
| `@vitejs/plugin-react` | ^4.7.0 | Plugin de React para Vite |
| `tailwindcss` | ^4.3.0 | Framework CSS utility-first |
| `@types/react` | ^18.3.28 | Tipos de React |
| `@types/react-dom` | ^18.3.7 | Tipos de React DOM |
| `@types/node` | ^25.8.0 | Tipos de Node.js |
| `eslint` | ^8.57.1 | Linter |
| `@typescript-eslint/eslint-plugin` | ^8.59.3 | Reglas ESLint para TypeScript |
| `@typescript-eslint/parser` | ^8.59.3 | Parser TypeScript para ESLint |
| `eslint-plugin-react` | ^7.37.5 | Reglas específicas de React |
| `eslint-plugin-react-hooks` | ^4.6.2 | Reglas de hooks |
| `eslint-plugin-react-refresh` | ^0.4.26 | Reglas de React Refresh |
| `gh-pages` | ^6.3.0 | Despliegue a GitHub Pages |
| `husky` | ^9.1.7 | Git hooks |
| `@tanstack/react-query-devtools` | ^5.100.10 | Devtools de React Query |

## Scripts Disponibles

```bash
pnpm dev          # Inicia servidor de desarrollo
pnpm build        # Compila a producción (Vite)
pnpm preview      # Vista previa de producción
pnpm lint         # ESLint con max-warnings 2
pnpm type-check   # tsc --noEmit
pnpm deploy       # gh-pages -d dist
pnpm predeploy    # pnpm run build (automático antes de deploy)
```

## Configuración de Vite

- **Base**: `/myprojectapi12/` (para GitHub Pages)
- **Plugins**: `react()`, `tailwindcss()`
- **Alias**:
  - `@` → `./src`
  - `@shared` → `./src/shared`
  - `@features` → `./src/features`
  - `@entities` → `./src/entities`
  - `@widgets` → `./src/widgets`
  - `@pages` → `./src/pages`

## TypeScript

- **Target**: ES2020
- **JSX**: react-jsx
- **Strict mode**: habilitado
- **Module resolution**: bundler
- **noUnusedLocals/noUnusedParameters**: true
- **noImplicitReturns**: true

## Variables de Entorno

| Variable | Valor por Defecto | Propósito |
|----------|--------------------|-----------|
| `VITE_API_URL` | `https://dummyjson.com` | URL base de la API (usada por httpClient) |
| `VITE_API_BASE_URL` | `https://dummyjson.com` | URL base de la API (usada por apiClient) |

## DummyJSON API

El proyecto consume la API pública de DummyJSON (`https://dummyjson.com/`) para:

- Listado paginado de productos
- Búsqueda por texto
- Categorías disponibles
- Productos por categoría

No requiere autenticación ni API key.
