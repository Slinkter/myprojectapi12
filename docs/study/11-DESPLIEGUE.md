# 11 — Despliegue (CI/CD con GitHub Actions)

---

## Pipeline: GitHub Actions

**Archivo:** `.github/workflows/deploy.yml`

El pipeline se ejecuta automáticamente en cada `push` a la rama `main`, o manualmente desde la pestaña Actions.

---

## Diagrama del pipeline

```
Push a main (o workflow_dispatch)
           │
           v
    ┌──────────────┐
    │   Checkout   │  actions/checkout@v4
    └──────┬───────┘
           v
    ┌──────────────┐
    │   pnpm       │  pnpm/action-setup@v3 (v8)
    └──────┬───────┘
           v
    ┌──────────────┐
    │   Node 20    │  actions/setup-node@v4 (cache: pnpm)
    └──────┬───────┘
           v
    ┌──────────────┐
    │  pnpm install│  --no-frozen-lockfile
    └──────┬───────┘
           v
    ┌──────────────┐
    │  pnpm lint   │  ESLint (max-warnings 2)
    └──────┬───────┘
           │
        ¿Falla? ──SI──→ Pipeline detenido ❌
           │
           NO
           v
    ┌──────────────┐
    │ pnpm build   │  vite build → dist/
    └──────┬───────┘
           v
    ┌──────────────────────┐
    │ upload-pages-artifact│  sube dist/ como artefacto
    └──────┬───────────────┘
           │
           v
    ┌──────────────┐
    │ Deploy Pages │  actions/deploy-pages@v4
    └──────┬───────┘
           v
    ✅ URL: https://slinkter.github.io/myprojectapi12
```

---

## Jobs

### Job 1: `build`

```yaml
build:
    runs-on: ubuntu-latest
    steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v3
          with:
              version: 8
        - uses: actions/setup-node@v4
          with:
              node-version: 20
              cache: "pnpm"
        - run: pnpm install --no-frozen-lockfile
        - run: pnpm run lint        # Falla si hay errores
        - run: pnpm run build       # Genera dist/
        - uses: actions/upload-pages-artifact@v3
          with:
              path: ./dist
```

### Job 2: `deploy`

```yaml
deploy:
    environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build  # Espera al build
    steps:
        - uses: actions/deploy-pages@v4
```

---

## Configuración de Vite para Pages

`vite.config.js`:

```javascript
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/myprojectapi12/",        // 🔴 Importante: coincide con el repo name
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            // ...
        },
    },
});
```

El `base` debe coincidir con el nombre del repositorio para que las rutas funcionen en GitHub Pages.

---

## Configuración de TypeScript

`tsconfig.json`:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "paths": {
            "@/*": ["./src/*"],
            "@features/*": ["./src/features/*"],
            "@shared/*": ["./src/shared/*"]
        }
    }
}
```

---

## Despliegue manual

```bash
pnpm run deploy
# Ejecuta: predeploy → pnpm run build
# Luego: gh-pages -d dist
```

---

## Verificaciones pre-deploy

El proyecto incluye un hook de `husky` pre-commit que ejecuta el lint. Adicionalmente, se recomienda ejecutar localmente:

```bash
pnpm lint          # 0 errores, ≤ 2 warnings
pnpm type-check    # 0 errores
pnpm build         # Build exitoso
```

---

## Enlaces relacionados

- [01-INICIO-RAPIDO.md](./01-INICIO-RAPIDO.md) — Comandos de build y dev
- [GLOSARIO.md](./GLOSARIO.md) — Términos: CI/CD, bundle, tree-shaking
