# MyProjectAPI12 - E-commerce Profesional con React

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## 🏢 Visión del Proyecto

**MyProjectAPI12** es una Single-Page Application (SPA) de e-commerce diseñada para demostrar la implementación de una **arquitectura de software limpia y escalable** en el frontend. El proyecto prioriza la mantenibilidad, el rendimiento y la aplicación rigurosa de patrones de diseño y buenas prácticas sobre la simple funcionalidad.

## 🏗️ Arquitectura Aplicada

La base del proyecto es una **Arquitectura Limpia (Clean Architecture)** adaptada al frontend, organizada por **Features** (módulos funcionales). Esta estructura garantiza una estricta separación de responsabilidades, facilitando el desarrollo, la depuración y las pruebas.

### Estructura de Directorios

```
src/
├── features/           # Módulos de negocio (ej. Carrito, Productos, Checkout)
│   ├── product/
│   │   ├── application/  # Lógica y estado (Custom Hooks - Casos de Uso)
│   │   ├── infrastructure/ # Conexión a servicios externos (API, localStorage)
│   │   └── presentation/   # Componentes de React (UI pura)
│   └── ...
├── components/         # Componentes UI reutilizables y agnósticos al dominio
├── context/            # Contextos globales de React (ej. Theme)
├── pages/              # Ensamblaje de features para construir las vistas
├── utils/              # Funciones de utilidad puras y genéricas
└── index.css           # Estilos globales y clases BEM componibles
```

### Metodología de Estilos: BEM con `@apply` y Neumorfismo

Para mantener el código JSX limpio y semántico, se ha adoptado la metodología **BEM (Block, Element, Modifier)**. Las clases de utilidad de Tailwind CSS se componen en `index.css` utilizando la directiva `@apply`.

Además, se ha implementado un sistema de **Neumorfismo** para el diseño de componentes como las tarjetas de esqueleto (`SkeletonCard`). Este estilo se integra de manera nativa con el sistema de temas (claro/oscuro), asegurando que los fondos y los colores del texto se adapten automáticamente al tema seleccionado.

**Ejemplo de implementación:**

```jsx
// CÓDIGO JSX: Limpio y declarativo
<article className="product-card">
    <div className="product-card__body">
        <h3 className="product-card__title">Producto</h3>
    </div>
</article>
```

```css
/* index.css: Centralización de la lógica de estilos */
.product-card {
    @apply neumo-card overflow-hidden; /* 'neumo-card' es otra clase BEM */
}

.product-card__body {
    @apply p-5;
}

.product-card__title {
    @apply font-normal text-base mb-2 truncate;
}
```

Esta estrategia prohíbe el uso de largas cadenas de utilidades de Tailwind en los componentes, favoreciendo clases semánticas que describen el rol del elemento en la UI.

## 📄 Documentación

Para una comprensión más profunda del proyecto, consulta los siguientes documentos:

-   **[Guía de Estilos (`styles-guidelines.md`)]**: Normas y convenciones para CSS, BEM y Neumorfismo.
-   **[Arquitectura del Sistema (`02-arquitectura.md`)]**: Detalles sobre la arquitectura por features y la separación de capas.
-   **[Glosario Técnico (`GLOSARIO_TECNICO.md`)]**: Un diccionario con la definición de los principales términos y tecnologías usadas.

## 🛠️ Instalación y Ejecución

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/myprojectapi12.git
    cd myprojectapi12
    ```

2.  **Instalar dependencias**: Se recomienda `pnpm` para una gestión eficiente de los paquetes.
    ```bash
    pnpm install
    ```

3.  **Ejecutar en modo desarrollo**:
    ```bash
    pnpm dev
    ```
    El servidor de desarrollo se iniciará en `http://localhost:5173` (o un puerto superior si está ocupado).

4.  **Construir para producción**:
    ```bash
    pnpm build
    ```
    Los archivos optimizados se generarán en la carpeta `dist/`.

## ✅ Próximos Pasos (Roadmap)

-   [ ] Implementar persistencia del estado del carrito en `localStorage`.
-   [ ] Desarrollar un conjunto de tests unitarios y de integración con **Vitest**.
-   [ ] Añadir un sistema de notificaciones de usuario más robusto.

---

*Este proyecto es un testimonio de cómo las prácticas de código limpio y una arquitectura sólida pueden transformar un desarrollo de software en un activo mantenible y escalable.*