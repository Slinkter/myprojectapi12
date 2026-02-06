# Plan de Implementación de CI/CD (GitHub Actions)

Este documento detalla los pasos exactos y los cambios necesarios para automatizar el despliegue de su proyecto `myprojectapi12` utilizando GitHub Actions.

## 🎯 Objetivo

Eliminar la necesidad de ejecutar manual `pnpm run deploy` desde su computadora local. En su lugar, cada vez que haga un `git push` a la rama `main`, GitHub se encargará automáticamente de compilar y actualizar la web.

## 🛠 Cambios Necesarios en el Código

### 1. Archivo de Workflow (NUEVO)

Se creará un nuevo archivo en: `.github/workflows/deploy.yml`

-   **¿Qué hace?** Contiene las instrucciones para el robot de GitHub.
-   **Contenido Técnico:**
    -   **Disparador (`on: push`):** Se activa solo cuando hay cambios en la rama `main`.
    -   **Permisos:** Se otorgan permisos de escritura a `id-token` y `pages`.
    -   **Pasos del Trabajo (`jobs`):**
        1.  `Checkout`: Descarga su código.
        2.  `Setup Node`: Instala Node.js (versión 20).
        3.  `Install`: Ejecuta `pnpm install` (usando cache para velocidad).
        4.  `Build`: Ejecuta `pnpm run build`.
        5.  `Upload Artifact`: Guarda la carpeta `dist/` resultante.
        6.  `Deploy to Pages`: Publica ese artefacto en GitHub Pages.

### 2. Archivo `package.json` (OPCIONAL/LIMPIEZA)

-   Podemos mantener los scripts actuales, pero `deploy` y `predeploy` dejarían de ser necesarios para uso local.
-   Se recomienda dejarlos por ahora como respaldo (fallback).

---

## ⚙️ Cambios Necesarios en GitHub (Web)

Estos pasos no son de código, sino de configuración en la página de su repositorio:

1.  Ir a **Settings** (Configuración) del repositorio.
2.  Click en **Pages** (en el menú lateral izquierdo).
3.  En la sección **Build and deployment**:
    -   Cambiar **Source** de `Deploy from a branch` a **`GitHub Actions`**.
    -   _(Esto es crucial: le dice a GitHub que deje de esperar la rama gh-pages y espere al Workflow)_.

---

## 📋 Resumen del Flujo de Trabajo (Antes vs. Después)

| Acción                 | Método Actual (Manual)                       | Método Nuevo (CI/CD Automático)                   |
| :--------------------- | :------------------------------------------- | :------------------------------------------------ |
| **Verificar errores**  | Tú ejecutas `pnpm run lint` manualmente.     | **GitHub Actions** lo ejecuta antes de construir. |
| **Compilar (`build`)** | Tú ejecutas `pnpm run build`. Tu PC trabaja. | **GitHub Actions** compila en la nube.            |
| **Subir a Web**        | Tú ejecutas `gh-pages` o `deploy`.           | **GitHub Actions** actualiza la web al instante.  |
| **Tiempo requerido**   | ~2-3 minutos de tu tiempo activo.            | **0 minutos**. Haces push y te olvidas.           |

## ⚠️ Riesgos y Rollback

-   **Riesgo:** Si la configuración falla, el despliegue automático dará error y la web no se actualizará.
-   **Rollback (Volver atrás):**
    1.  Borrar el archivo `.github/workflows/deploy.yml`.
    2.  En GitHub Settings -> Pages, volver a poner Source: `Deploy from a branch`.
    3.  Volver a usar `pnpm run deploy` localmente.
    -   _Es totalmente reversible._

---

## ✅ ¿Procedemos?

Si está de acuerdo con este plan, el siguiente paso es que yo cree el archivo `.github/workflows/deploy.yml` por usted.
