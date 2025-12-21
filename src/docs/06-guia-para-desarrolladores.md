# Guía para Desarrolladores (Developer Guide)

Esta guía está diseñada para nuevos desarrolladores que se unen al equipo de **MyProjectAPI12**.

## 1. Instalación y Configuración

### Prerrequisitos

-   Node.js v18.0.0 o superior.
-   Gestor de paquetes `npm` o `pnpm` (recomendado).
-   Git.

### Pasos Iniciales

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-repositorio>
    cd myprojectapi12
    ```
2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
3.  **Iniciar servidor de desarrollo:**
    ```bash
    pnpm dev
    ```
    El servidor iniciará en `http://localhost:5173`.

## 2. Scripts Disponibles

En el `package.json` encontrarás:

| Script    | Comando        | Descripción                                                        |
| :-------- | :------------- | :----------------------------------------------------------------- |
| `dev`     | `vite`         | Inicia el servidor de desarrollo con HMR (Hot Module Replacement). |
| `build`   | `vite build`   | Compila el proyecto para producción en la carpeta `/dist`.         |
| `preview` | `vite preview` | Sirve la versión compilada localmente para probar el build.        |
| `lint`    | `eslint ...`   | Ejecuta el linter para buscar errores de código.                   |

## 3. Convenciones del Proyecto

### Estándares de Código

-   **Estilos:** No usar estilos inline ni CSS puro fuera de `index.css`. Usar clases BEM definidas via `@apply`.
-   **Componentes:** Functional Components con Hooks.
-   **Nombres:**
    -   Componentes: `PascalCase` (Ej: `ProductCard.jsx`).
    -   Funciones/Hooks: `camelCase` (Ej: `useCart.js`).
    -   Clases CSS: `kebab-case` BEM (Ej: `product-card__title`).

### Estructura para Nuevos Módulos

Si vas a crear una nueva feature (ej: `Auth`), sigue esta estructura:

```
src/features/auth/
├── application/     # AuthProvider, useAuth
├── infrastructure/  # authApi (login, register)
└── presentation/    # LoginForm, RegisterPage
```

## 4. Flujo de Trabajo (Git Workflow)

1.  Nunca trabajar directamente en `main`.
2.  Crear rama por feature/fix: `feature/login-page` o `fix/cart-calculation`.
3.  Hacer Pull Request (PR) y solicitar revisión.

## 5. Buenas Prácticas Recomendadas

-   **DRY (Don't Repeat Yourself):** Si copias y pegas código, extráelo a una utilidad o componente común.
-   **KISS (Keep It Simple):** Evita la sobre-ingeniería. No añadas Redux si un Context basta.
-   **Separation of Concerns:** Componentes de vista no deben hacer llamadas `fetch`. Usa hooks.
-   **Validación:** Usa `PropTypes` en todos los componentes que reciban propiedades.
