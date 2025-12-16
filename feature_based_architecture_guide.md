# Guía Maestra: Arquitectura Basada en Features y el Paisaje Moderno
## Fuente Optimizada para Generación de Slides en NotebookML

---

## 1. Conceptos Fundamentales
Antes de entender la arquitectura, es crucial entender los principios de ingeniería de software que la sustentan.

### Cohesión vs. Acoplamiento
*   **Cohesión (Lo que queremos ALTO):** El grado en que los elementos dentro de un módulo pertenecen juntos. En Feature-Based, queremos que todo lo relacionado con "Pagos" (UI, Lógica, Datos) esté junto. Una cohesión alta facilita el mantenimiento.
*   **Acoplamiento (Lo que queremos BAJO):** El grado de interdependencia entre módulos. Si cambias el módulo de "Usuario", no debería romperse el módulo de "Inventario".
*   **Colocation (Colocación Conjunta):** El principio físico de poner archivos relacionados en la misma carpeta. "Las cosas que cambian juntas, deben permanecer juntas".

---

## 2. Árbol Genealógico y Evolución

### Los Ancestros (Arquitecturas Tradicionales)
*   **MVC (Model-View-Controller) / N-Tier / Layered Architecture:**
    *   **Filosofía:** Separación por responsabilidad técnica.
    *   **Estructura:** Carpetas `controllers/`, `views/`, `models/`.
    *   **Problema:** Baja cohesión de negocio. Para una sola feature, tocas 3 capas distintas.

### La Filosofía (El "Por Qué")
*   **Screaming Architecture (Robert C. Martin):**
    *   La arquitectura debe revelar la intención del sistema ("Sistema de Salud"), no las herramientas ("Rails app").
*   **Domain-Driven Design (DDD):**
    *   Enfoque en modelar el software basándose en el dominio del negocio (Bounded Contexts). Es la base teórica de agrupar por "Features".

### Las Implementaciones Contemporáneas
Estas son las formas modernas en las que se aplica el concepto "Feature-Based".

#### A. Vertical Slice Architecture (VSA)
*   **Uso común:** Backend (.NET, Node.js), a veces Frontend.
*   **Concepto:** En lugar de capas horizontales (UI -> Business -> Data), cortamos "rebanadas verticales".
*   **Estructura:** Cada "Slice" (ej: `RegisterUser`) contiene TODO lo necesario para esa acción: API Endpoint, Validación, y consulta SQL.
*   **Diferencia Clave:** VSA es más radical; permite duplicar código entre slices para evitar acoplamiento.

#### B. Modular Monolith (Monolito Modular)
*   **Uso común:** Backend de gran escala.
*   **Concepto:** Un solo ejecutable/deploy, pero internamente el código está tan separado que parecerían microservicios.
*   **Relación:** Usas una estructura de carpetas *Feature-Based* estricta para imponer límites duros entre módulos dentro del mismo repositorio.

#### C. Feature-Sliced Design (FSD)
*   **Uso común:** Frontend Moderno (React, Vue, Angular).
*   **Concepto:** Una metodología estandarizada y jerárquica para evitar el caos en el frontend.
*   **Jerarquía:**
    1.  **Layers (Capas):** `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.
    2.  **Slices (Dominios):** `auth`, `user`, `cart`.
    3.  **Segments (Técnicos):** `ui`, `model` (estado), `api`.

#### D. Microservices (Microservicios)
*   **Relación:** Es el extremo físico de la arquitectura basada en features.
*   **Diferencia:** En lugar de carpetas separadas, son **servidores** separados.
*   **Cuándo escalar:** A menudo se empieza con un *Modular Monolith* (Feature-Based) y solo se extrae una feature a un Microservicio si es estrictamente necesario por escala.

---

## 3. Comparativa de Arquitecturas (Tabla de Estudio)

| Característica | Layered (Tradicional) | Feature-Based / VSA (Moderna) | Microservicios |
| :--- | :--- | :--- | :--- |
| **Organización** | Por tipo técnico (Controller, View) | Por dominio (User, Auth, Payment) | Por servicio desplegable |
| **Navegación** | Saltos constantes entre carpetas | Todo en una carpeta | Repositorios separados |
| **Acoplamiento** | Alto (Capas dependen de capas) | Bajo (Features independientes) | Nulo (Red) pero complejo |
| **Escalabilidad** | Difícil (Spaghetti code) | Media/Alta (Módulos claros) | Muy Alta (Infraestructura) |
| **Curva de Aprendizaje** | Baja (Fácil de entender al inicio) | Media (Requiere disciplina) | Muy Alta (DevOps, Redes) |

---

## 4. Detalle Profundo: Feature-Sliced Design (FSD)
Ideal para slides sobre "Estandarización Frontend".

### Las Capas (Layers) - De arriba a abajo
Solo puedes importar de capas inferiores.
1.  **App:** Configuración global, providers, entry point.
2.  **Pages:** Composición de widgets para formar rutas completas.
3.  **Widgets:** Bloques de UI autónomos (ej: `Header`, `Feed`).
4.  **Features:** Acciones del usuario con valor de negocio (ej: `AddToCard`, `LikePost`).
5.  **Entities:** Modelos de negocio y visualización de datos (ej: `UserCard`, `ProductRow`).
6.  **Shared:** Utilidades puras, UI Kit sin lógica de negocio (ej: `Button`, `axios`, `dateFormatter`).

---

## 5. Resumen Ejecutivo para Presentaciones
*   La **Feature-Based Architecture** no es una "invención", es la aplicación de **Cohesión** y **DDD**.
*   Resuelve el problema de la **navegación dispersa** en proyectos grandes.
*   Tiene "primos" cercanos: **Vertical Slice** (Backend) y **Feature-Sliced Design** (Frontend).
*   Es el paso previo natural antes de mover a **Microservicios** (o la mejor alternativa para evitarlos mediante un **Monolito Modular**).
