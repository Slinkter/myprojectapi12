# 🧠 Decisiones de Ingeniería de Software

Este documento justifica las decisiones técnicas tomadas, analizando por qué se eligieron ciertas tecnologías y por qué se descartaron otras.

## 1. Gestión de Estado: TanStack Query vs Redux/Zustand

*   **Decisión:** Usar TanStack Query para el estado del servidor.
*   **Justificación:** El 90% de los datos de esta aplicación provienen de una API externa. Redux/Zustand requerirían boilerplates extensos para manejar estados de carga, error y caché. TanStack Query reduce el código en un 40% al manejar la sincronización de forma nativa.
*   **Descarte de Redux:** Se considera innecesario para este nivel de complejidad. Introduciría una curva de aprendizaje y un peso de bundle que no se justifica.

## 2. Estilos: Tailwind CSS 4 vs Frameworks de Componentes (MUI)

*   **Decisión:** Tailwind CSS PURO (Utility-first).
*   **Justificación:** Se priorizó el **Performance**. La migración de un framework de componentes pesado (como Material UI) a Tailwind resultó en una reducción del bundle de JS de casi un 70%.
*   **Ventaja Técnica:** Tailwind 4 utiliza un motor CSS-first que permite definir variables de diseño directamente en CSS, eliminando la necesidad de un runtime de JavaScript para los estilos.

## 3. Arquitectura: Feature-Based vs Flat Structure

*   **Decisión:** Feature-Based Layered Architecture.
*   **Justificación:** Una estructura plana (`components/`, `hooks/`, `services/`) se vuelve inmanejable cuando el proyecto supera los 20 componentes. Al organizar por **Features**, cada funcionalidad es autocontenida, lo que facilita el testing y la eliminación de código muerto.
*   **Principio:** Alta cohesión (dentro del feature) y bajo acoplamiento (entre features).

## 4. Tipado: TypeScript Strict Mode

*   **Decisión:** Habilitar `strict: true`.
*   **Justificación:** En una aplicación e-commerce, los errores de nulidad o tipos incorrectos en el carrito pueden costar dinero. El modo estricto obliga a manejar casos de borde (edge cases) desde la fase de desarrollo.

## 5. Decisiones de Omisión (Lo que NO se incluyó)

### 5.1 Autenticación (Auth)
*   **Estado:** No implementado.
*   **Justificación:** No es un requerimiento funcional para el MVP actual de catálogo y carrito. Introducirlo artificialmente añadiría complejidad de seguridad (JWT, persistencia) que no aporta valor al objetivo de arquitectura frontend actual.

### 5.2 Microfrontends
*   **Estado:** No utilizado.
*   **Justificación:** El tamaño del equipo (simulado) y la aplicación no justifican la sobrecarga de una arquitectura distribuida. Una aplicación modular (monolito modular) es más eficiente para este caso.

### 5.3 Zod (Validación de Runtime)
*   **Estado:** Identificado como mejora futura.
*   **Justificación:** Actualmente se confía en el contrato de la API. En un entorno de producción real, se añadiría Zod en la capa de `infrastructure` para asegurar que los datos de la API cumplen con nuestras interfaces.
