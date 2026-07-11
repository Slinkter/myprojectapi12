# Despliegue a GitHub Pages

El proyecto se despliega automáticamente a GitHub Pages mediante GitHub Actions.

---

## Workflow (`deploy.yml`)

El archivo `.github/workflows/deploy.yml` define el pipeline de CI/CD.

### Eventos de Disparo

```yaml
on:
  push:
    branches: [main]    # Se ejecuta en cada push a main
  workflow_dispatch:     # Permite ejecución manual
```

### Permisos

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true
```

### Jobs

1. **build** — Compila el proyecto en `dist/`
2. **deploy** — Sube el artefacto a GitHub Pages

#### Job: build

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: pnpm/action-setup@v3         # pnpm v8
  - uses: actions/setup-node@v4         # Node 20
  - run: pnpm install --no-frozen-lockfile
  - run: pnpm run lint                   # Falla si hay errores
  - run: pnpm run build                  # Genera dist/
  - uses: actions/upload-pages-artifact@v3
    with:
      path: ./dist
```

#### Job: deploy

```yaml
needs: build
steps:
  - uses: actions/deploy-pages@v4
```

## Configuración Local

### package.json

```json
{
  "homepage": "https://slinkter.github.io/myprojectapi12",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### vite.config.js

```js
export default defineConfig({
  base: "/myprojectapi12/",
  plugins: [react(), tailwindcss()],
  // ...
});
```

## Despliegue Manual

```bash
pnpm run deploy
```

Esto ejecuta `predeploy` (build) y luego sube `dist/` a la rama `gh-pages`.

## BrowserRouter

El enrutador usa `basename` para que las rutas funcionen en GitHub Pages:

```tsx
<BrowserRouter basename="/myprojectapi12/">
  <AppRouter />
</BrowserRouter>
```

## CSP y CORS

El archivo `index.html` incluye una política de seguridad (CSP) que permite:

- **scripts**: `'self' 'unsafe-inline' 'unsafe-eval'`
- **styles**: `'self' 'unsafe-inline' https://fonts.googleapis.com`
- **fonts**: `'self' https://fonts.gstatic.com`
- **images**: `'self' data: https:`
- **connect-src**: `'self' https://dummyjson.com`
- **Referrer-Policy**: `strict-origin-when-cross-origin`

## Notas Importantes

1. Vite **base** debe coincidir con el nombre del repositorio (`/myprojectapi12/`)
2. BrowserRouter **basename** debe coincidir con Vite base
3. Los enlaces de ErrorFallback a la home usan `window.location.href = "/myprojectapi12/"`
4. El workflow cancela ejecuciones en progreso si se hace push rápido
5. No hay secrets ni API keys; DummyJSON es una API pública
