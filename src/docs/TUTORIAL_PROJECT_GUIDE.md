# 🎓 Guía Tutorial del Proyecto: Construyendo un E-Commerce desde Cero

## Introducción

Este documento no es solo una explicación de los archivos del proyecto, es un tutorial que justifica la existencia y el propósito de cada uno, como si estuviéramos construyendo la aplicación paso a paso. Entender el "porqué" de cada archivo es clave para dominar la arquitectura.

---

## Módulo 1: La Base del Proyecto (Configuración)

Antes de escribir una sola línea de React, necesitamos configurar nuestro entorno de desarrollo.

### 1. `package.json`
-   **Propósito:** Es el manifiesto del proyecto. Define el nombre, la versión y, lo más importante, las **dependencias** (librerías que usa el proyecto) y los **scripts** (comandos para ejecutar, testear y construir la aplicación).
-   **Justificación:** Sin este archivo, no podríamos instalar las librerías necesarias (`react`, `vite`, `tailwindcss`) ni ejecutar comandos como `npm run dev`. Es el punto de partida de cualquier proyecto de Node.js.

### 2. `vite.config.js` y `jsconfig.json`
-   **Propósito:** Estos dos archivos trabajan juntos para la gestión de rutas.
    -   `vite.config.js`: Es el cerebro de **Vite**, nuestra herramienta de construcción. Le dice a Vite cómo compilar el código, qué plugins usar (como el de React) y cómo resolver los alias de ruta (ej. `@/`). También define la URL base para el despliegue (`/myprojectapi12/`).
    -   `jsconfig.json`: Su propósito es darle "superpoderes" a nuestro editor de código (VS Code). Le informa sobre los alias de ruta para que pueda ofrecer autocompletado y navegación de código sin errores.
-   **Justificación:** Usamos alias para evitar importaciones relativas frágiles (`../../...`). Estos archivos son necesarios para que tanto Vite (en la compilación) como el editor (en desarrollo) entiendan qué significa `@/`.

### 3. Archivos de Estilo: `tailwind.config.js`, `postcss.config.js`, `src/index.css`
-   **Propósito:**
    -   `tailwind.config.js`: Configura **Tailwind CSS**. Aquí podemos extender la paleta de colores, definir nuevas fuentes o añadir plugins.
    -   `postcss.config.js`: PostCSS es una herramienta que transforma el CSS. Tailwind la usa bajo el capó. Generalmente, no necesitamos tocar este archivo.
    -   `src/index.css`: Es nuestro archivo CSS global. Aquí importamos los estilos de Tailwind y definimos nuestras propias clases globales o estilos base.
-   **Justificación:** Este conjunto de archivos nos permite tener un sistema de diseño rápido, personalizable y mantenible.

### 4. Archivos de Calidad y Control: `.eslintrc.cjs`, `.eslintignore`, `.gitignore`
-   **Propósito:**
    -   `.eslintrc.cjs`: Configura **ESLint**, una herramienta que analiza nuestro código en busca de errores y malas prácticas, asegurando un estilo consistente.
    -   `.eslintignore`: Lista los archivos y carpetas que ESLint debe ignorar.
    -   `.gitignore`: Le dice a **Git** (nuestro sistema de control de versiones) qué archivos no debe rastrear, como la carpeta `node_modules` o archivos de entorno.
-   **Justificación:** Son esenciales para mantener la calidad del código y para colaborar en equipo de manera ordenada.

---

## Módulo 2: El Corazón de la Aplicación React

### 1. `index.html`
-   **Propósito:** Es la única página HTML real de nuestra aplicación (Single Page Application). Es un cascarón vacío con un `<div id="root"></div>`.
-   **Justificación:** React necesita un punto de anclaje en el DOM para montar toda la aplicación. Este es ese punto.

### 2. `src/main.jsx`
-   **Propósito:** Es el verdadero punto de entrada de nuestra aplicación React. Aquí:
    1.  Localizamos el `<div id="root">` del `index.html`.
    2.  Renderizamos nuestro componente principal (`<App />`).
    3.  Envolvemos la aplicación en **Providers**, que son componentes que proveen datos y funcionalidades a toda la aplicación (como el Router, el `ThemeProvider` y el `CartProvider`).
-   **Justificación:** Es el archivo que "enciende" React y conecta la lógica de la aplicación con el navegador.

### 3. `src/App.jsx`
-   **Propósito:** Es el componente raíz de la aplicación. Su principal responsabilidad es definir la estructura o layout general.
-   **Justificación:** Actúa como el contenedor principal donde vivirán todas nuestras páginas y componentes.

### 4. `src/AppRouter.jsx`
-   **Propósito:** Define todas las rutas (URLs) de la aplicación y qué componente de página se debe renderizar para cada una. Utiliza `React.lazy` para implementar **code-splitting**.
-   **Justificación:** Separa la lógica de enrutamiento de la lógica de la aplicación, manteniendo `App.jsx` limpio. El code-splitting es crucial para el rendimiento, ya que solo carga el código de la página que el usuario está visitando.

---

## Módulo 3: Construyendo las Funcionalidades (*Features*)

Esta es la parte más importante de nuestra arquitectura. En lugar de tener carpetas genéricas como `/components` o `/hooks`, organizamos el código por funcionalidades.

### Funcionalidad 1: Productos (`src/features/products/`)
-   **Propósito:** Contiene todo lo relacionado con la visualización y carga de productos.
-   **Archivos Clave:**
    -   `pages/Home.jsx`: La página principal que el usuario ve, responsable de orquestar la visualización de los productos.
    -   `hooks/useProducts.js`: **La lógica de negocio**. Se encarga de hacer el `fetch` a la API, manejar los estados de carga y error, y gestionar la paginación.
    -   `components/`: Contiene todos los componentes de UI para esta funcionalidad: `ProductGrid.jsx`, `Product.jsx`, `SkeletonCard.jsx`, etc. Son componentes "tontos" que solo reciben datos y los muestran.
    -   `services/products.js`: Define funciones para comunicarse con la API. Aunque en `useProducts` se hace el fetch directamente, este servicio existe para demostrar una capa de abstracción que podría ser reutilizada o expandida.
-   **Justificación:** Agrupar por funcionalidad hace que el código sea increíblemente fácil de encontrar, mantener y escalar. Si hay un bug con los productos, sabemos que la solución está en esta carpeta.

### Funcionalidad 2: Carrito (`src/features/cart/`)
-   **Propósito:** Gestiona el estado y la UI del carrito de compras.
-   **Archivos Clave:**
    -   `context/CartContext.jsx`: **La fuente de verdad del carrito**. Es un estado global que permite a cualquier componente añadir, eliminar o leer productos del carrito sin necesidad de pasar `props` a través de múltiples niveles (*prop drilling*).
    -   `components/`: `CartIcon.jsx` (el ícono en la barra de navegación) y `Cart.jsx` (el panel que muestra los productos del carrito).
-   **Justificación:** El estado del carrito necesita ser accesible desde muchos lugares (la lista de productos, la cabecera, la página de checkout). Un Context de React es la solución perfecta para este tipo de estado global.

### Funcionalidad 3: Checkout (`src/features/checkout/`)
-   **Propósito:** Maneja el proceso de pago final.
-   **Archivos Clave:**
    -   `pages/Checkout.jsx`: La página con el formulario de pago.
    -   `hooks/useCheckout.js`: **Lógica de alta complejidad**. Gestiona el estado de todos los campos del formulario, las validaciones en tiempo real y la lógica de "pago" simulado. Usa `useReducer` porque el estado del formulario es demasiado complejo para manejarlo con múltiples `useState`.
    -   `utils/validation.js`: Un módulo de utilidad con funciones puras para validar la información (ej. formato de tarjeta de crédito).
    -   `pages/CheckoutSuccess.jsx`: La página de agradecimiento que se muestra tras un pago exitoso.
-   **Justificación:** El checkout es una funcionalidad compleja. Extraer toda su lógica al hook `useCheckout` mantiene el componente de la página limpio y centrado en la UI, mientras que las funciones de validación se aíslan en `utils` para poder ser reutilizadas y probadas de forma independiente.
