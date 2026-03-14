# 👥 Metodología SCRUM Aplicada

En el desarrollo de este proyecto se ha simulado un entorno de trabajo profesional bajo el framework ágil **SCRUM**, definiendo roles específicos para cada fase del ciclo de vida del software.

## Roles del Equipo

| Rol | Identificador | Responsabilidades Clave |
| :--- | :--- | :--- |
| **Product Owner** | Trabajador 0 | Definición de visión, priorización del backlog (User Stories) y criterios de aceptación. |
| **Scrum Master** | Trabajador 1 | Facilitador de procesos, eliminación de impedimentos y aseguramiento de la metodología. |
| **UX/UI Designer** | Trabajador 2 | Diseño del sistema visual, prototipado y experiencia de usuario (MUI a Tailwind migration). |
| **Programador Frontend** | Trabajador 4 | Implementación técnica de componentes, lógica de negocio y consumo de APIs. |
| **Ingeniero de Software** | **Trabajador 5** | Arquitectura del sistema, justificación técnica, documentación de ingeniería y optimización. |

## Artefactos y Ceremonias

### 1. Product Backlog
Consolidado en `docs/docs/06_USER_STORIES.md`. Contiene todas las funcionalidades deseadas desde el punto de vista del usuario.

### 2. Sprints
El proyecto se ha ejecutado en iteraciones incrementales:
*   **Sprint 1:** Infraestructura base, Routing y Product Catalog.
*   **Sprint 2:** Gestión de Carrito (Context API) y Lógica de Dominio.
*   **Sprint 3:** Checkout, Refactorización a Tailwind 4 y Optimización de Performance.

### 3. DoD (Definition of Done)
Para considerar una funcionalidad como terminada:
1.  **Código:** Debe estar estrictamente tipado en TypeScript.
2.  **Documentación:** Debe incluir JSDoc completo y actualización en `docs/`.
3.  **Calidad:** Debe pasar el linting y no introducir archivos huérfanos.
4.  **Arquitectura:** Debe respetar las capas (Infrastructure, Application, Domain, Presentation).

## Rol del Trabajador 5 (Ingeniero de Software)
Como rol crítico, el Ingeniero de Software ha auditado cada entrega para asegurar que:
*   Las decisiones técnicas (como elegir TanStack Query sobre Redux) tengan una base sólida.
*   La arquitectura sea escalable y no presente acoplamientos innecesarios.
*   El sistema pueda ser mantenido por terceros mediante una documentación de ingeniería exhaustiva.
