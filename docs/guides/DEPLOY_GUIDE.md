# 🚀 Guía de Despliegue a GitHub Pages

Este documento explica paso a paso cómo funciona y cómo ejecutar el despliegue automático de **MyProjectAPI12** utilizando GitHub Actions.

---

## 🏗️ Cómo funciona el sistema

El proyecto utiliza **GitHub Actions** para el CI/CD (Integración y Despliegue Continuo). Cada vez que realizas un `push` a la rama `main`, ocurre lo siguiente:

1.  **Validación:** Se revisa el código con ESLint para asegurar que no hay errores.
2.  **Construcción:** Se ejecuta el comando `build` para generar la versión de producción en la carpeta `dist/`.
3.  **Despliegue:** Se sube el contenido de `dist/` a los servidores de GitHub Pages de forma segura.

---

## 🛠️ Configuración Inicial (Solo una vez)

Antes de que el despliegue automático funcione por primera vez, debes configurar tu repositorio en GitHub:

1.  Ve a tu repositorio en GitHub.
2.  Haz clic en la pestaña **Settings** (Configuración).
3.  En el menú lateral izquierdo, selecciona **Pages**.
4.  En la sección **Build and deployment** -> **Source**, asegúrate de seleccionar:
    *   **GitHub Actions** (en lugar de "Deploy from a branch").

---

## 🚀 Cómo realizar un Despliegue

### 1. Despliegue Automático (Recomendado)

Simplemente sube tus cambios a la rama principal:

```bash
git add .
git commit -m "feat: descripción de mis cambios"
git push origin main
```

GitHub detectará el cambio y disparará el workflow definido en `.github/workflows/deploy.yml`.

### 2. Despliegue Manual

Si deseas forzar el despliegue sin hacer un nuevo commit:

1.  Ve a la pestaña **Actions** en tu repositorio de GitHub.
2.  En el menú de la izquierda, selecciona **Deploy to GitHub Pages**.
3.  Haz clic en el botón desplegable **Run workflow**.
4.  Selecciona la rama `main` y presiona el botón verde **Run workflow**.

---

## 🔍 Monitoreo del Estado

Puedes ver el progreso de tu despliegue en tiempo real:

1.  En la pestaña **Actions**, verás una lista de ejecuciones.
2.  Un círculo **naranja** significa que está en proceso.
3.  Un check **verde** significa que el despliegue fue exitoso.
4.  Una **X roja** significa que falló (normalmente por errores de Lint o de compilación). Puedes hacer clic en la ejecución para ver los logs detallados del error.

---

## 🔗 Ver el Sitio en Vivo

Una vez finalizado (check verde), tu sitio estará disponible en:
`https://slinkter.github.io/myprojectapi12/`

---

## ⚠️ Notas Importantes

*   **Ruta Base:** El proyecto está configurado para servirse desde la subcarpeta `/myprojectapi12/`. Esto se gestiona automáticamente en `vite.config.js` y `BrowserRouter` mediante el valor de `basename`.
*   **Errores de Lint:** Si tienes advertencias de ESLint configuradas como errores, el despliegue fallará. Asegúrate de ejecutar `pnpm run lint` localmente antes de subir tus cambios.

---
_Documentación generada el 12 de febrero de 2026_
