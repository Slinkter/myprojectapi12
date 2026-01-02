# 🚀 Despliegue y Build

## Scripts Disponibles

*   `pnpm dev`: Inicia servidor de desarrollo (HMR activo).
*   `pnpm build`: Genera bundle de producción en `/dist`.
*   `pnpm preview`: Sirve localmente la carpeta `/dist` para verificar el build.
*   `pnpm lint`: Ejecuta auditoría de código estático.

## Variables de Entorno
El proyecto utiliza archivos `.env` (soportados nativamente por Vite).

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API REST | `https://dummyjson.com` |

## Proceso de Build (CI/CD Pipeline Simulado)

1.  **Checkout:** Clonar repositorio.
2.  **Install:** `pnpm install --frozen-lockfile` (Asegurar versiones exactas).
3.  **Lint:** `pnpm lint` (Falla si hay errores).
4.  **Test:** (Pendiente) `pnpm test`.
5.  **Build:** `pnpm build`.
6.  **Deploy:** Subir contenido de `/dist` al hosting (Vercel/Netlify/GitHub Pages).

## Configuración de Hosting
*   Para **GitHub Pages**, asegurar que `base` en `vite.config.js` coincida con el nombre del repo si no es dominio raíz.
*   Para SPAs, configurar el servidor web para redirigir todas las rutas (`/*`) a `index.html` (Rewrite Rules) para que funcione React Router.
