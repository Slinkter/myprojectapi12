# Guía Definitiva de Arquitecturas y Conceptos Web Modernos

Este documento resume y expande todos los conceptos técnicos discutidos, organizados como una guía de referencia para entender dónde se sitúa tu proyecto y hacia dónde puede evolucionar.

---

## 1. Arquitecturas de Aplicación (Macro)

Define cómo se estructura la aplicación de cara al usuario y al servidor.

### 🏠 SPA (Single Page Application) - _Tu Proyecto_

-   **Analogía:** Una casa inteligente donde las habitaciones cambian a tu alrededor sin que tú te muevas.
-   **Funcionamiento:** Carga un solo archivo HTML (`index.html`) una vez. JavaScript manipula el DOM para mostrar diferentes "páginas".
-   **Ventajas:** Experiencia de usuario fluida (sin parpadeos), transiciones rápidas, fácil de transformar en app móvil.
-   **Desventajas:** Carga inicial más lenta, SEO más difícil de configurar.

### 🏨 MPA (Multi Page Application) - _Lo Tradicional_

-   **Analogía:** Un hotel donde debes pasillear y abrir puertas para ir a cada habitación.
-   **Funcionamiento:** Cada clic en un enlace solicita un nuevo archivo HTML al servidor. El navegador recarga todo.
-   **Ventajas:** SEO natural perfecto, carga inicial rápida.
-   **Desventajas:** Navegación lenta (parpadeos blancos), experiencia menos "app".

### 📱 PWA (Progressive Web App) - _La Evolución_

-   **Concepto:** Una SPA con esteroides. Usa tecnologías modernas (Service Workers) para funcionar offline, enviar notificaciones push y ser instalable en el móvil como una app nativa.
-   **¿Es para ti?** Sí, es el siguiente paso lógico para tu proyecto si quieres presencia en móviles.

---

## 2. Estrategias de Renderizado (El Motor)

Define quién construye lo que el usuario ve: ¿Tu navegador o el servidor?

| Estrategia        | Significado              | ¿Quién cocina?   | ¿Cuándo?                       | Ideal para...                    |
| :---------------- | :----------------------- | :--------------- | :----------------------------- | :------------------------------- |
| **CSR** (Tu caso) | Client-Side Rendering    | Tu Navegador     | Al momento de visitar          | Paneles de admin, Apps privadas. |
| **SSR**           | Server-Side Rendering    | El Servidor      | En cada petición ("On demand") | Tiendas, Noticias (SEO crítico). |
| **SSG**           | Static Site Generation   | El Desarrollador | Al compilar (`npm run build`)  | Blogs, Landing pages, Docs.      |
| **ISR**           | Incremental Static Regen | Híbrido          | Se regenera cada X tiempo      | Sitios grandes que cambian poco. |

---

## 3. Arquitectura de Código (Micro)

Define cómo organizas tus archivos dentro de la carpeta `src/`.

### 📂 Layer-Based (Por Capas) - _La Vieja Escuela_

Agrupa por **tipo de archivo**.

-   `src/components/`
-   `src/hooks/`
-   `src/pages/`
-   **Problema:** Para editar una funcionalidad, tocas 5 carpetas distintas. Difícil de escalar.

### 📦 Feature-Based (Por Funcionalidad) - _La Recomendación_

Agrupa por **negocio/funcionalidad**.

-   `src/features/auth/` (Login, Register, Hooks, API)
-   `src/features/cart/` (Lista, Botones, Calculos)
-   **Ventaja:** Código modular, fácil de mantener y borrar. Si borras la carpeta `cart`, desaparece el carrito limpiamente.

### 🧱 Atomic Design (Diseño Atómico)

Una metodología para organizar solo los **componentes visuales** (UI), complementaria a Feature-Based.

1.  **Átomos:** Botones, Inputs, Etiquetas (Indivisibles).
2.  **Moléculas:** Buscador (Input + Botón).
3.  **Organismos:** Navbar (Logo + Buscador + Menú).
4.  **Plantillas:** La estructura vacía de la página.
5.  **Páginas:** La plantilla con datos reales.

---

## 4. Herramientas de Control y Calidad

### 🚔 ESLint (.eslintrc, .eslintignore)

-   **Rol:** El Policía.
-   **Función:** Busca errores de lógica y malas prácticas en tu código JS/React.
-   **Config:** `.eslintignore` le dice qué archivos ignorar (como `dist` o configs) para que no pierda tiempo.

### 🧹 Prettier

-   **Rol:** El Decorador.
-   **Función:** Se asegura de que todo el código tenga el mismo formato (espacios, punto y coma, comillas). No busca errores, solo arregla la estética.

### 🙈 Git (.gitignore)

-   **Rol:** El Filtro de Basura.
-   **Función:** Le dice a Git qué archivos **NO** subir al repositorio (claves secretas, carpetas pesadas como `node_modules`, archivos temporales del sistema).

### ⚙️ VS Code (.vscode/settings.json)

-   **Rol:** Las Gafas del Editor.
-   **Función:** Configuraciones específicas para que tu editor de texto entienda tu proyecto (ej: ignorar advertencias falsas de CSS, configurar el formateo automático).
