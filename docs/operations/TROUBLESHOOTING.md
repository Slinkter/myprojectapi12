# Solución de Problemas Comunes

## Errores de Lint

### ESLint con max-warnings

El script `lint` tiene `--max-warnings 2`:

```json
"lint": "eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 2"
```

**Solución**: Revisa advertencias con `pnpm lint`. Comunes:

- `react-refresh/only-export-components` — agregar `/* eslint-disable react-refresh/only-export-components */` en archivos que exportan contexto + hook
- `@typescript-eslint/no-unused-vars` — eliminar variables no usadas
- `no-unused-labels`, `no-unused-expressions`

### Regla react-refresh

El plugin `eslint-plugin-react-refresh` espera que los archivos exporten solo componentes. Cuando exportas contexto y hook en el mismo archivo (como `CartContext.tsx`), debes deshabilitarlo con:

```typescript
/* eslint-disable react-refresh/only-export-components */
```

---

## Errores de TypeScript

### strict mode

`tsconfig.json` tiene `"strict": true`. Errores comunes:

| Error | Causa | Solución |
|-------|-------|----------|
| `noUnusedLocals` | Variable local no usada | Eliminar o prefix con `_` |
| `noUnusedParameters` | Parámetro no usado | Prefix con `_` o eliminar |
| `noImplicitReturns` | Función sin return en todos los caminos | Asegurar return en todos los branches |
| `strictNullChecks` | Posible null/undefined | Usar optional chaining o guardas |

### Aliases de Path

Los imports deben usar los alias definidos en `vite.config.js` y `tsconfig.json`:

```typescript
// Correcto
import { Button } from '@/shared/ui/Button';
import { useProducts } from '@features/products/application/useProducts';

// Incorrecto
import { Button } from '../../shared/ui/Button';
```

**Problema**: `tsc --noEmit` no resuelve los mismos paths si no coinciden en ambos archivos.

**Solución**: Sincronizar `paths` en `tsconfig.json` con `resolve.alias` en `vite.config.js`.

---

## Errores de Compilación (Build)

### Base URL incorrecta

Si el build genera rutas absolutas (ej. `/assets/index.js`) pero se despliega en un subdirectorio:

```js
// vite.config.js
export default defineConfig({
  base: "/myprojectapi12/", // Debe coincidir con el nombre del repo
});
```

### Error: No se encuentra el elemento raíz

```typescript
// main.tsx
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se pudo encontrar el elemento raíz");
```

**Causa**: El `<div id="root">` en `index.html` no existe o está mal escrito.

### Error: Module not found

**Causa**: Import de un archivo que no existe o ruta incorrecta.

**Solución**: Verificar que el archivo existe y que la extensión está especificada (si es necesario).

---

## Problemas de CORS

La aplicación consume `https://dummyjson.com`. El CSP en `index.html` permite `connect-src 'self' https://dummyjson.com`.

Si en el futuro cambias la API:

```html
<meta http-equiv="Content-Security-Policy" content="... connect-src 'self' https://nueva-api.com;">
```

---

## Problemas de CSP (Content Security Policy)

El CSP actual permite estilos y fuentes de Google. Si agregas nuevos recursos externos (CDN, iframes, etc.):

1. Agregar origen a la política en `index.html`
2. Usar valores seguros (`https:`, `data:`, `blob:`)

Errores comunes en consola:

```
Refused to load the script '...' because it violates the Content Security Policy
```

**Solución**: Agregar el origen al CSP en `index.html`.

---

## Path Alias no Funciona en Time de Compilación

### Síntoma

```typescript
// Este import funciona en Vite
import { Button } from '@/shared/ui/Button';
// Pero tsc --noEmit reporta: Cannot find module '@shared/ui/Button'
```

### Causa

Los paths en `tsconfig.json` y `vite.config.js` no coinciden exactamente.

### Solución

Verificar que ambos archivos tengan los mismos alias:

```js
// vite.config.js
alias: {
  '@': path.resolve(__dirname, './src'),
  '@shared': path.resolve(__dirname, './src/shared'),
}
```

```json
// tsconfig.json
"paths": {
  "@/*": ["./src/*"],
  "@shared/*": ["./src/shared/*"]
}
```

---

## HMR no Funciona (Hot Module Replacement)

- Verificar que `@vitejs/plugin-react` está en plugins
- La regla `react-refresh` de ESLint no debe causar falsos positivos
- Usar `pnpm dev` en lugar de abrir directamente `index.html`

---

## El Drawer del Carrito no se Cierra

El drawer usa `createPortal`. Verificar:

1. El estado `isCartOpen` se actualiza correctamente
2. El evento `Escape` está correctamente escuchado
3. El clic en backdrop ejecuta `closeCart()`

---

## Paginación Infinita no Carga Más Productos

1. Verificar que `hasMore` sea `true` (depende de `lastPage.total`)
2. Verificar que `fetchNextPage` se llama correctamente
3. Verificar que `getNextPageParam` calcula bien el total

```typescript
getNextPageParam: (lastPage, allPages) => {
  const totalFetched = allPages.length * PRODUCTS_PER_PAGE;
  return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
};
```
