# Visión General del Sistema (Overview)

## 1. Propósito del Proyecto

**MyProjectAPI12** es una plataforma de **Comercio Electrónico (E-commerce)** diseñada para ofrecer una experiencia de compra fluida, rápida y moderna. Su objetivo principal es demostrar la implementación de arquitecturas de software avanzadas en el desarrollo Frontend con React, sirviendo como base escalable para aplicaciones comerciales reales.

El sistema permite a los usuarios:

-   Explorar un catálogo de productos paginado y optimizado.
-   Consultar detalles específicos de cada artículo.
-   Gestionar un carrito de compras dinámico (agregar, eliminar, vaciar).
-   Simular un proceso de pago (Checkout) con validaciones en tiempo real.

## 2. Alcance Funcional

El alcance actual del sistema (Versión MVP - Producto Mínimo Viable) incluye:

-   **Módulo de Catálogo (Products):** Listado dinámico consumiendo API externa, paginación, modales de detalle y control de stock visual.
-   **Módulo de Compras (Cart):** Gestión de estado global, cálculo automático de totales y drawer (panel lateral) interactivo.
-   **Módulo de Pago (Checkout):** Formulario con validaciones de tarjeta de crédito, selección de métodos de pago y simulación de éxito.
-   **Gestión de Preferencias:** Cambio de tema (Claro/Oscuro) en tiempo real.

## 3. Tecnologías Utilizadas

| Categoría         | Tecnología            | Versión | Propósito                                          |
| :---------------- | :-------------------- | :------ | :------------------------------------------------- |
| **Core**          | **React**             | 18.x    | Biblioteca principal de UI.                        |
| **Build Tool**    | **Vite**              | 5.x     | Empaquetado y servidor de desarrollo ultrarrápido. |
| **Lenguaje**      | **JavaScript**        | ES6+    | Lógica del cliente.                                |
| **Estilos**       | **Tailwind CSS**      | 3.x     | Framework de utilidades CSS.                       |
| **Metodología**   | **BEM**               | -       | Convención de nombres para mantenibilidad CSS.     |
| **Metodología**   | **Neumorfismo**       | -       | Sistema de diseño principal para la estética de la UI. |
| **Routing**       | **React Router**      | 6.x     | Navegación SPA (Single Page Application).          |
| **UI Components** | **Material Tailwind** | 2.x     | Componentes base accesibles.                       |
| **Iconografía**   | **React Icons**       | 5.x     | Iconos vectoriales optimizados.                    |

## 4. Arquitectura General

El sistema sigue una **Arquitectura Híbrida** que combina:

1.  **Feature-Based Architecture:** Organización vertical por módulos de negocio.
2.  **Clean Architecture (Capas):** Separación horizontal (Presentación, Aplicación, Infraestructura) dentro de cada feature.

### Diagrama de Arquitectura de Alto Nivel

```mermaid
graph TD
    subgraph "Cliente (Navegador)"
        UI[Interfaz de Usuario React]
        Store[Context API (Estado Global)]
        Router[React Router DOM]
    end

    subgraph "Servicios Externos"
        API[DummyJSON API]
    end

    UI --> Store
    UI --> Router
    Store --> API : Fetch Data
    Router --> UI : Render Page
```

## 5. Flujo Principal de la Aplicación

1.  **Inicio (Home):** El usuario aterriza en la página principal. El sistema solicita productos a la capa de infraestructura.
2.  **Interacción (Catálogo):** El usuario ve productos. Los componentes de presentación (`ProductCard`) renderizan la información.
3.  **Acción (Agregar al Carrito):** Al hacer clic, se dispara una acción en la capa de aplicación (`useCart` / `CartContext`).
4.  **Estado Global:** El contexto actualiza el carrito y recalcula totales. La UI del Drawer se actualiza reactivamente.
5.  **Navegación (Checkout):** El usuario procede al pago. El Router carga el módulo de Checkout bajo demanda (Lazy Loading).
6.  **Finalización:** Tras validar el formulario, se muestra la confirmación y se reinicia el flujo.
