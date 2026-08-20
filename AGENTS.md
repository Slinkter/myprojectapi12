# AGENTS.md — Guía rápida para agentes

## Stack y comandos
- Node ≥ 18, **pnpm ≥ 11** (CI usa `pnpm/action-setup@v4`). El repo está pensado para pnpm: hay `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.gitignore` excluye `.pnpm-store`.
- **No uses npm.** El repo funcionaba con npm por accidente; la suite de tests fue removida (commit `2de1bbc`) y `deploy`/`py` invocan `pnpm` directamente. Si vienes de npm: borra `node_modules` y `package-lock.json` antes de hacer `pnpm install --no-frozen-lockfile`.
- En Windows, `pnpm-workspace.yaml` ya preconfigura `allowBuilds` para esbuild, `@firebase/util` y `protobufjs`. Si persiste algún problema de postinstall, puedes ejecutar `pnpm approve-builds`.
- Scripts (`package.json`):
  - `pnpm dev` — servidor Vite (puerto 5173). Corre localmente en el root `/`.
  - `pnpm build` — `vite build` → `dist/`.
  - `pnpm preview` — previsualiza `dist/`.
  - `pnpm lint` — ESLint con `--max-warnings 2`. No acumules warnings.
  - `pnpm type-check` — `tsc --noEmit`.
  - `pnpm deploy` — `gh-pages -d dist` (corre `predeploy: pnpm build` antes).
  - `pnpm deploy:firebase` — compila y despliega en Firebase Hosting (proyecto `myprojectapi12-39aa6`).
  - `pnpm py` — compila, valida tipos y sirve `dist/` en :5001 vía Python (requiere `python` en PATH).
- **No existe `pnpm test`.** Ignora los badges y secciones de testing del `README.md`.
- Pre-commit (`.husky/pre-commit`) corre `pnpm lint && pnpm type-check`. CI (`.github/workflows/deploy.yml`) corre `lint` + `build`. Mantén ese orden localmente.

## Arquitectura
- Entrada: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Orden de providers en `src/App.tsx` (no reordenar sin razón): `QueryClientProvider → ThemeProvider → AuthProvider → CartProvider → BrowserRouter → LazyMotion → ErrorBoundary → Layout → AppRouter` (+ `ReactQueryDevtools` al final).
- Enrutamiento: `src/app/routing/AppRouter.tsx`. Rutas con `lazy()`: `Home`, `Checkout` (CheckoutPage), `CheckoutSuccess` (CheckoutSuccessPage), `Orders`, `FAQ`, `AdminDashboard`. La ruta comodín `*` también renderiza `Home`.
- Estructura por feature (FSD-like): `src/features/<feature>/{domain,application,infrastructure,presentation}` — ver `docs/architecture/OVERVIEW.md`.
  - Características implementadas: `auth`, `cart`, `checkout`, `orders`, `products`, `theme`, `users`.
- Capa de dominio puro (`src/entities/`): **SÍ existe** y contiene los tipos y utilidades de `product`, `cart-item` y `order`.
- Aliases (coinciden en `vite.config.js` y `tsconfig.json`): `@/`, `@shared/`, `@features/`, `@pages/`, `@entities/`, `@widgets/`.
- **Navbar** está en `src/widgets/Navbar.tsx` porque necesita imports de features. `Layout.tsx` (en `src/shared/ui/Layout.tsx`) lo importa desde `@widgets/Navbar`.

## Gotchas (cosas que se rompen en silencio)
- **Base URL & BrowserRouter:** `vite.config.js` define `base` dinámicamente mediante `VITE_BASE_PATH || (DEPLOY_TARGET === "gh-pages" ? "/myprojectapi12/" : "/")`, y `BrowserRouter` usa `basename={import.meta.env.BASE_URL}`. Esto sincroniza de manera automática el entorno local (corriendo en `/`) con producción (GitHub Pages). No alteres esta lógica.
- **Variables de entorno:** Existen múltiples variables esenciales descritas en `.env.example`. Además de `VITE_API_URL` (para DummyJSON), se requieren las variables de Firebase (`VITE_FIREBASE_*`) para la autenticación y persistencia de órdenes. El archivo local `.env` está en `.gitignore`.
- **CSP (Content Security Policy):** En `index.html` restringe `connect-src` a `https://dummyjson.com` junto a múltiples subdominios de Google y Firebase (`*.googleapis.com`, `*.firebaseapp.com`, `*.firebase.io`, etc.). Si se cambia la API base o se agregan servicios externos, se debe actualizar la meta etiqueta CSP.
- **Sin `tailwind.config.js` ni `postcss.config.js`:** Tailwind v4 se configura vía `@tailwindcss/vite` y directivas en `src/index.css`. **No crees esos archivos** — están en `.eslintignore` precisamente para que no aparezcan.
- **`react-refresh/only-export-components` (`warn`)** con `allowConstantExport: true`: en archivos `.tsx` exporta solo componentes (o constantes sueltas). No exportes hooks/utils desde un `.tsx` de componente.
- **ESLint** falla con `--max-warnings 2`: limpia warnings antes de commitear o el pre-commit te bloquea.
- **`.gitignore`** excluye `.env*`, `.playwright-mcp/`, `dist`, `coverage/`, `.agents/`, `.claude/` — no commitees nada de eso.

## Documentación
- Índice general: `docs/README.md` (arquitectura, features, componentes, patrones, operaciones).
- Onboarding paso a paso: `docs/study/01-INICIO-RAPIDO.md` y siguientes.
- Despliegue: `docs/operations/DEPLOYMENT.md`.
- Troubleshooting: `docs/operations/TROUBLESHOOTING.md`.

## Estilo
- JSDoc en español (proyecto 100% documentado; conserva el estilo `@file`/`@description` ya presente).
- Sin commits automáticos. Sin emojis en código o mensajes salvo que el usuario lo pida.
- No crear `AGENTS.md` duplicados en subcarpetas — este archivo es la única fuente.

## Agent skills
- Los skills están consolidados en el archivo `.agent` de la raíz del proyecto.
- Usa `@project-agent` para invocar el agente con todos los skills inline (JSDoc, diseño frontend, hooks React, UI/UX, descubrimiento de skills).
- El directorio `.claude/skills/` y `.agents/skills/` junto con `skills-lock.json` coexisten de manera segura en el proyecto.
