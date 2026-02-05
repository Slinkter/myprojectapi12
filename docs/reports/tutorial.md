# Tutorial: Creación del Proyecto MyProjectApi12 desde Cero

Este tutorial te guiará paso a paso para construir esta aplicación web moderna utilizando **React**, **Vite**, y **Tailwind CSS**, implementando una arquitectura basada en *features* y buenas prácticas.

## 1. Configuración Inicial del Proyecto

### Requisitos Previos
- Node.js instalado (v18+ recomendado).
- Gestor de paquetes `pnpm` (o npm/yarn).

### Creación del Proyecto con Vite
Ejecuta el siguiente comando en tu terminal para crear el andamiaje del proyecto:

```bash
pnpm create vite myprojectapi12 --template react
cd myprojectapi12
pnpm install
```

## 2. Instalación de Dependencias

Instalaremos las librerías necesarias agrupadas por su función.

### Estilos y Diseño
```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
pnpm add react-icons framer-motion clsx tailwind-merge
```

### Enrutamiento y Navegación
```bash
pnpm add react-router-dom
```

### Gestión de Estado y Datos
```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
pnpm add react-hot-toast
```

### Utilidades y Tipos
```bash
pnpm add prop-types
```

### Testing y Calidad de Código
```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @vitejs/plugin-react
pnpm add -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Despliegue
```bash
pnpm add -D gh-pages
```

## 3. Configuración del Entorno

### Configuración de Tailwind CSS
Edita `tailwind.config.js` para indicar dónde están tus archivos fuente:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Añade las directivas de Tailwind en `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configuración de Vite (Alias)
Edita `vite.config.js` para permitir imports absolutos con `@`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
})
```

## 4. Estructura del Proyecto

Organizamos el código por **features** (funcionalidades) para mantener el proyecto escalable.

```
src/
├── app/                # Configuración global de la app
│   ├── config/         # Variables de entorno, clientes
│   └── api/            # Clientes HTTP
├── assets/             # Imágenes y recursos estáticos
├── components/         # Componentes compartidos/ui genéricos
│   └── common/         # Botones, Loaders, Layouts
├── features/           # Módulos principales de negocio
│   ├── cart/           # Lógica y UI del Carrito
│   ├── products/       # Lógica y UI de Productos
│   ├── theme/          # Lógica del Tema (Dark/Light)
│   └── checkout/       # Proceso de compra
├── pages/              # Vistas principales (Rutas)
└── test/               # Configuración de tests
```

## 5. Implementación de Features Clave

### A. Contexto de Tema (Dark Mode)
Crear `src/features/theme/application/ThemeContext.jsx` para manejar el estado global del tema, persistiendo la preferencia en `localStorage`.

### B. Cliente de API y React Query
Configurar `QueryClient` en `src/app/config/queryClient.js` y envolver la app en `main.jsx` con `<QueryClientProvider>`.

### C. Carrito de Compras
Implementar `CartContext` en `src/features/cart/application/CartContext.jsx`. Debe manejar:
- Agregar productos (controlando duplicados incrementando cantidad).
- Eliminar productos.
- Calcular totales.
- Persistencia en `localStorage`.

### D. Lista de Productos
Crear componentes para visualizar productos:
- `ProductGrid.jsx`: Contenedor de la grilla.
- `ProductCard.jsx`: Tarjeta individual con imagen, precio y botón de compra.
- `SkeletonGrid.jsx`: Estado de carga (Loading skeleton).

Usa `useQuery` de TanStack Query para hacer fetch a la API (ej: Fake Store API).

## 6. Enrutamiento (React Router)

En `src/App.jsx`, configura tus rutas y layouts:

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="checkout" element={<Checkout />} />
    {/* Otras rutas */}
  </Route>
</Routes>
```

## 7. Testing

Configura `vitest` creando `src/test/setup.js`:
```javascript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});
```

Escribe tests unitarios para tus contextos (ej: `CartContext.test.jsx`) o componentes visuales.

## 8. Scripts y Despliegue

Añade los scripts necesarios en `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx",
  "test": "vitest",
  "predeploy": "pnpm run build",
  "deploy": "gh-pages -d dist"
}
```

### Para desplegar en GitHub Pages:
1. Asegúrate de configurar `base` en `vite.config.js` si es necesario (generalmente `./` o el nombre del repo).
2. Ejecuta `pnpm run deploy`.

---
¡Felicidades! Has creado una aplicación profesional con React, escalable y lista para producción.
