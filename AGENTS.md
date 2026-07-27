# AGENTS.md — Guía rápida para agentes

## Stack y comandos
- Node ≥ 18, **pnpm ≥ 8** (recomendado 11). El repo está pensado para pnpm: hay `pnpm-lock.yaml`, CI usa `pnpm/action-setup@v3` y `.gitignore` excluye `.pnpm-store`.
- **No uses npm.** El repo funcionaba con npm por accidente; la suite de tests fue removida (commit `2de1bbc`) y `deploy`/`py` invocan `pnpm` directamente. Si vienes de npm: borra `node_modules` y `package-lock.json` antes de hacer `pnpm install --frozen-lockfile`.
- En Windows, si `pnpm` no está en PATH tras instalar, el binario queda en `C:\Users\<user>\AppData\Local\pnpm\bin\pnpm.cmd`. Tras `pnpm install` puede aparecer el aviso `ERR_PNPM_IGNORED_BUILDS`; ejecútalo una vez: `pnpm approve-builds` (esbuild necesita su postinstall).
- Scripts (`package.json`):
  - `pnpm dev` — servidor Vite (puerto 5173).
  - `pnpm build` — `vite build` → `dist/`.
  - `pnpm preview` — previsualiza `dist/`.
  - `pnpm lint` — ESLint con `--max-warnings 2`. No acumules warnings.
  - `pnpm type-check` — `tsc --noEmit`.
  - `pnpm deploy` — `gh-pages -d dist` (corre `predeploy: pnpm build` antes).
  - `pnpm py` — sirve `dist/` en :5001 vía Python (requiere `python` en PATH; **no funciona en Windows sin Python**).
- **No existe `pnpm test`.** Ignora los badges y secciones de testing del `README.md`.
- Pre-commit (`.husky/pre-commit`) corre `pnpm lint && pnpm type-check`. CI (`.github/workflows/deploy.yml`) corre `lint` + `build`. Mantén ese orden localmente.

## Arquitectura
- Entrada: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Orden de providers en `src/App.tsx` (no reordenar sin razón): `QueryClientProvider → ThemeProvider → CartProvider → BrowserRouter → LazyMotion → ErrorBoundary → Layout → AppRouter`.
- Enrutamiento: `src/app/routing/AppRouter.tsx`. Rutas con `lazy()`: `Home`, `Checkout`, `CheckoutSuccess`. La ruta comodín `*` también renderiza `Home`.
- Estructura por feature (FSD-like): `src/features/<feature>/{domain,application,infrastructure,presentation}` — ver `docs/architecture/OVERVIEW.md`.
- Aliases (deben coincidir en `vite.config.js` y `tsconfig.json`): `@/`, `@shared/`, `@features/`, `@pages/`, `@entities/`, `@widgets/`. **Ojo:** `@entities/` y `@widgets/` están configurados pero las carpetas no existen todavía.

## Gotchas (cosas que se rompen en silencio)
- **GitHub Pages:** `vite.config.js` define `base: "/myprojectapi12/"` y `BrowserRouter` usa `basename="/myprojectapi12/"` en `App.tsx`. **Ambos deben coincidir** o las rutas devuelven 404 / los assets no cargan.
- **Variable de entorno de la API inconsistente:** `src/app/config/env.ts` lee `VITE_API_BASE_URL`; `src/shared/api/httpClient.ts` lee `VITE_API_URL`. Son dos clientes distintos — revisa cuál usa tu código antes de añadir env vars.
- **CSP** en `index.html` restringe `connect-src` a `https://dummyjson.com`. Si cambias la API base, actualiza también la meta CSP o el navegador bloqueará las peticiones.
- **Sin `tailwind.config.js` ni `postcss.config.js`:** Tailwind v4 se configura vía `@tailwindcss/vite` y directivas en `src/index.css`. **No crees esos archivos** — están en `.eslintignore` precisamente para que no aparezcan.
- **Inconsistencia de ruta de éxito:** `ROUTES.CHECKOUT_SUCCESS` en `shared/constants/routes.ts` es `/checkout/success`, pero `AppRouter.tsx` tiene la ruta en `/checkout-success`. Si navegas con `ROUTES.CHECKOUT_SUCCESS`, la página de éxito no se encuentra.
- **`react-refresh/only-export-components` (`warn`)** con `allowConstantExport: true`: en archivos `.tsx` exporta solo componentes (o constantes sueltas). No exportes hooks/utils desde un `.tsx` de componente.
- **ESLint** falla con `--max-warnings 2`: limpia warnings antes de commitear o el pre-commit te bloquea.
- **`.gitignore`** excluye `.env*`, `.playwright-mcp/`, `dist`, `coverage/` — no commitees nada de eso.

## Documentación
- Índice general: `docs/README.md` (arquitectura, features, componentes, patrones, operaciones).
- Onboarding paso a paso: `docs/study/01-INICIO-RAPIDO.md` y siguientes.
- Despliegue: `docs/operations/DEPLOYMENT.md`.
- Troubleshooting: `docs/operations/TROUBLESHOOTING.md`.

## Estilo
- JSDoc en español (proyecto 100% documentado; conserva el estilo `@file`/`@description` ya presente).
- Sin commits automáticos. Sin emojis en código o mensajes salvo que el usuario lo pida.
- No crear `AGENTS.md` duplicados en subcarpetas — este archivo es la única fuente.
