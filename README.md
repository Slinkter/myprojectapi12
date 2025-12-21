# MyProjectAPI12 - E-commerce Profesional con React

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)

## 🏢 Visión del Proyecto

Este es un proyecto de demostración de un E-commerce (SPA) construido siguiendo los más altos estándares de la industria. El objetivo no es solo la funcionalidad, sino la excelencia arquitectónica, la mantenibilidad y el rendimiento.

Utiliza una **Arquitectura basada en Features** y **Clean Architecture** en el frontend, separando claramente las responsabilidades.

## 🚀 Tecnologías Principales

-   **Frontend Core**: React 18, Vite.
-   **Estilos**: Tailwind CSS con metodología **BEM** (vía `@apply`).
-   **UI Components**: Material Tailwind.
-   **Rutas**: React Router 6 (con Lazy Loading).
-   **Iconografía**: React Icons.
-   **API**: DummyJSON.

## 🏗 Arquitectura del Sistema

El proyecto sigue una estructura de directorios escalable:

```
src/
├── features/           # Módulos funcionales (Carrito, Productos, Checkout)
├── components/         # Componentes UI compartidos
├── context/            # Estado global (Theme)
├── pages/              # Páginas principales (Layouts de features)
├── routes/             # Configuración de navegación
└── utils/              # Ayudantes puros
```

Cada feature (`src/features/products`) se subdivide en capas:

-   **Presentation**: UI pura (Componentes React).
-   **Application**: Estado, Hooks y Casos de Uso.
-   **Infrastructure**: Comunicación con APIs externas.

## 🛠 Instalación y Ejecución

1. **Clonar el repositorio**:

    ```bash
    git clone https://github.com/tu-usuario/myprojectapi12.git
    cd myprojectapi12
    ```

2. **Instalar dependencias**:

    ```bash
    pnpm install  # o npm install
    ```

3. **Ejecutar en desarrollo**:

    ```bash
    pnpm dev
    ```

4. **Construir para producción**:
    ```bash
    pnpm build
    ```

## 🎨 Guía de Estilos (BEM)

Hemos evitado el desorden de clases de utilidad en el JSX. Consulta [`doc/styles-guidelines.md`](doc/styles-guidelines.md) para ver las convenciones.

Ejemplo:

```jsx
// ✅ Correcto (Clase semántica definida en index.css)
<div className="product-card">...</div>

// ❌ Incorrecto (Utility soup)
<div className="w-full bg-white shadow-lg rounded-xl p-4...">...</div>
```

## 📚 Documentación Adicional

-   [Documentación Técnica Detallada (`DOCUMENTATION.md`)](DOCUMENTATION.md)
-   [Tutorial de Construcción (`tutorial_completo.md`)](tutorial_completo.md)
-   [Guía de Estilos (`doc/styles-guidelines.md`)](doc/styles-guidelines.md)

## ✨ Roadmap

-   [x] Refactorización a Feature-Based Architecture.
-   [x] Migración de estilos inline a BEM.
-   [x] Optimización con Lazy Loading.
-   [ ] Implementar persistencia en localStorage para el carrito.
-   [ ] Añadir Tests Unitarios (Vitest).

---

Desarrollado con ❤️ y Clean Code.
