# 💻 Tech Stack & Decisiones Técnicas

## Core
*   **Lenguaje:** JavaScript (ES6+). Se prioriza el uso de características modernas (Async/Await, Destructuring, Modules).
*   **Framework:** **React 18**. Utilizando Hooks y Functional Components exclusivamente.
*   **Build Tool:** **Vite**. Elegido por su velocidad de Hot Module Replacement (HMR) y build optimizado con Rollup.

## Estilos & UI
*   **Motor CSS:** **Tailwind CSS v3** + **@material-tailwind/react**.
    *   *Justificación:* Combinación de la flexibilidad de Tailwind para layout con la robustez y accesibilidad de componentes pre-construidos (Material Design) para elementos interactivos.
    *   *Estrategia:* Uso de componentes semánticos (`<Card>`, `<Button>`, `<Navbar>`) para reducir la deuda técnica de clases CSS mantenidas manualmente.
*   **Iconografía:** `react-icons`.
*   **Animaciones:** `framer-motion` (para transiciones modales y feedback visual).

## Gestión de Estado
*   **Local State:** `useState`, `useReducer` para lógica compleja local.
*   **Global State:** **React Context API**. Suficiente para el alcance actual (Carrito y Tema). No se requiere Redux/Zustand por ahora.
*   **Server State:** Gestión manual vía `useEffect` + `fetch` (Refactorizado para evitar race conditions).
    *   *Nota:* En una fase futura se podría evaluar `TanStack Query` para caché y revalidación.

## Infraestructura & Red
*   **Cliente HTTP:** `fetch` nativo encapsulado en un `apiClient` personalizado.
*   **API Externa:** [DummyJSON](https://dummyjson.com/).

## Herramientas de Desarrollo
*   **Linter:** ESLint (Configuración recomendada de Vite + React).
*   **Gestor de Paquetes:** **pnpm**. Elegido por su eficiencia en espacio de disco y velocidad de instalación.
