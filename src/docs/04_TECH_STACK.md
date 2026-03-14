# 💻 Tech Stack & Decisiones Técnicas

## Core
*   **Lenguaje:** **TypeScript 5.9**. Se utiliza tipado estricto para garantizar la robustez del código y mejorar la experiencia de desarrollo.
*   **Framework:** **React 18.3**. Utilizando Hooks, Functional Components y Concurrent Features (como `Suspense`).
*   **Routing:** **React Router 7**. Implementado para la navegación entre páginas, aprovechando la carga diferida (Lazy Loading).
*   **Build Tool:** **Vite 5.4**. Configurado con el plugin de React y soporte nativo para Tailwind 4.

## Estilos & UI
*   **Motor CSS:** **Tailwind CSS v4.1**.
    *   *Justificación:* Framework CSS-first que permite configurar el diseño directamente en el CSS mediante `@theme`. Elimina la necesidad de archivos de configuración JS extensos.
    *   *Estrategia:* Uso de variables CSS para el sistema de diseño (tokens) y utilidades de Tailwind para el layout.
*   **UI Kit:** **Shadcn/UI**.
    *   *Justificación:* Basado en Radix UI para accesibilidad y Tailwind CSS para personalización total. Proporciona componentes de alta calidad sin dependencias de estilo pesadas.
*   **Iconografía:** `react-icons` (hi2 - Heroicons v2, io5 - Ionicons v5).
*   **Animaciones:** `framer-motion 12`.

## Gestión de Estado
*   **Local State:** `useState`, `useReducer` para lógica interna de componentes.
*   **Global UI State:** **React Context API**. Utilizado para estados compartidos de la interfaz como el Carrito y el Tema.
*   **Server State:** **TanStack Query v5 (React Query)**.
    *   *Justificación:* Proporciona almacenamiento en caché automático, revalidación en segundo plano y manejo simplificado de estados de carga y error.

## Infraestructura & Red
*   **Cliente HTTP:** `fetch` nativo integrado con TanStack Query para fetching asíncrono.
*   **API Externa:** [DummyJSON](https://dummyjson.com/).

## Herramientas de Desarrollo
*   **Linter:** ESLint 8.
*   **Testing:** **Vitest** + **React Testing Library**.
*   **Gestor de Paquetes:** **pnpm**. Elegido por su eficiencia y velocidad.
