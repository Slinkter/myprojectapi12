# 01 — Inicio Rápido

Clona, instala dependencias, ejecuta el servidor de desarrollo y genera el build de producción.

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12
```

---

## 2. Instalar dependencias

```bash
pnpm install
```

Esto lee `pnpm-lock.yaml` e instala las dependencias exactas definidas en `package.json`.

---

## 3. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre **http://localhost:5173** en tu navegador. Vite recarga en caliente (HMR) al modificar archivos.

---

## 4. Construir para producción

```bash
pnpm build
```

Genera la carpeta `dist/` con el bundle optimizado (minificado, tree-shaken, con hash en nombres).

---

## 5. Previsualizar el build

```bash
pnpm preview
```

Sirve localmente el contenido de `dist/` para verificar antes del despliegue.

---

## 6. Verificar calidad

```bash
pnpm lint        # ESLint: errores y warnings
pnpm type-check  # TypeScript: errores de tipos (tsc --noEmit)
```

Ambos comandos deben pasar con 0 errores.

---

## Scripts disponibles (`package.json`)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Servidor de desarrollo con HMR |
| `build` | `vite build` | Build de producción |
| `preview` | `vite preview` | Vista previa del build |
| `lint` | `eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 2` | Linting |
| `type-check` | `tsc --noEmit` | Verificación de tipos |
| `deploy` | `gh-pages -d dist` | Despliegue manual a GitHub Pages |
| `predeploy` | `pnpm run build` | Se ejecuta automáticamente antes de `deploy` |
| `py` | `build + type-check + python http.server` | Script de utilidad |

---

## Variables de entorno

El proyecto usa `VITE_API_URL` (definida en `src/app/config/env.ts`). Por defecto apunta a `https://dummyjson.com`.

```bash
# .env (opcional)
VITE_API_URL=https://dummyjson.com
```

---

## Estructura de archivos clave

```
myprojectapi12/
├── index.html          # Entry point HTML (CSP, fuentes, meta tags)
├── vite.config.js      # Configuración de Vite + plugins
├── tsconfig.json       # Configuración de TypeScript
├── .eslintrc.cjs       # Configuración de ESLint
├── src/
│   ├── main.tsx        # Punto de entrada React
│   ├── App.tsx         # Componente raíz con providers
│   └── index.css       # Estilos globales + Tailwind v4 @theme
└── .github/
    └── workflows/
        └── deploy.yml  # Pipeline CI/CD
```

---

## Enlaces relacionados

- [00-PRERREQUISITOS.md](./00-PRERREQUISITOS.md) — Herramientas necesarias
- [02-ESTRUCTURA.md](./02-ESTRUCTURA.md) — Arquitectura del proyecto
