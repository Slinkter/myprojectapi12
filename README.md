# Project API 12

## Descripción

Este proyecto es una aplicación web simple que muestra una lista de productos de la API [DummyJSON](https://dummyjson.com/). La aplicación está construida con React, Vite y Tailwind CSS, y fue refactorizada para seguir los principios de Clean Architecture y Clean Code.

## Arquitectura

La arquitectura del proyecto fue refactorizada para mejorar la separación de preocupaciones, la reutilización de código y la mantenibilidad.

### Estructura de Carpetas

```
src/
├── components/      # Componentes de React
│   ├── Product.jsx
│   └── Products.jsx
├── hooks/           # Custom Hooks de React
│   └── useProducts.js
├── services/        # Servicios para interactuar con APIs externas
│   └── products.js
├── App.jsx          # Componente principal de la aplicación
└── main.jsx         # Punto de entrada de la aplicación
```

### Custom Hooks

-   `useProducts`: Este hook encapsula la lógica para obtener y administrar los productos de la API. Se encarga del estado de carga, los errores y la paginación.

### Servicios

-   `products.js`: Este servicio abstrae la comunicación con la API `dummyjson.com`, proporcionando una función `getProducts` para obtener los productos.

## Instalación y Ejecución

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd myprojectapi12
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar la aplicación:**

    ```bash
    npm run dev
    ```

## Despliegue en GitHub Pages

Para desplegar la aplicación en GitHub Pages, sigue estos pasos:

1.  **Instalar `gh-pages`:**

    ```bash
    npm i --save-dev gh-pages
    ```

2.  **Configurar `package.json`:**

    Asegúrate de que tu `package.json` tenga los siguientes scripts:

    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    },
    ```

3.  **Configurar `vite.config.js`:**

    Añade la propiedad `base` a tu `vite.config.js`:

    ```javascript
    export default {
      base: "/<NOMBRE_DEL_REPOSITORIO>/",
      // ...
    };
    ```

4.  **Ejecutar el deploy:**

    ```bash
    npm run deploy
    ```

## Vista Previa

![alt text](./api12.png)