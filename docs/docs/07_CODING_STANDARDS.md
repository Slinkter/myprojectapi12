# 📏 Estándares de Código y Convenciones

Este documento define las reglas de ingeniería de software que garantizan la mantenibilidad, escalabilidad y calidad del proyecto MyProjectAPI12.

---

## 🏛️ Principios de Ingeniería (SOLID & DRY)

El proyecto se rige por principios de diseño de software robustos para evitar el acoplamiento y facilitar el testeo.

### 1. DRY (Don't Repeat Yourself)
*   **Centralización de Lógica:** No se permite la duplicación de lógica de negocio o de red.
*   **Abstracción de Servicios:** El `apiClient.ts` centraliza toda la lógica de `fetch`, manejo de cabeceras y errores.
*   **Hooks de Aplicación:** La lógica de estado (Carrito, Productos) se encapsula en Custom Hooks reutilizables para que la UI sea puramente presentacional.

### 2. SOLID
*   **S - Single Responsibility:** Cada archivo tiene una única razón para cambiar. Las utilidades de dominio (`domain/`) son puras y no conocen la UI; los componentes de presentación no conocen la infraestructura de red.
*   **O - Open/Closed:** Los componentes base (UI Kit) están diseñados para ser extendidos mediante props o variantes (CVA), pero cerrados a modificaciones internas que alteren su contrato original.
*   **L - Liskov Substitution:** Las interfaces de TypeScript aseguran que cualquier componente que extienda otro sea compatible con el comportamiento esperado (ej. `ButtonProps` extiende los atributos nativos de HTML).
*   **I - Interface Segregation:** Se definen interfaces de TypeScript granulares para evitar que los componentes dependan de propiedades que no utilizan.
*   **D - Dependency Inversion:** Los componentes dependen de abstracciones (Hooks/Context) y no de implementaciones concretas. La inyección de dependencias se realiza mediante el árbol de Providers en `App.tsx`.

---

## 🚀 Estándares de ECMAScript Moderno

El código debe seguir las mejores prácticas de ES6+ para garantizar eficiencia y legibilidad:

*   **Inmutabilidad:** Preferir el uso del operador Spread (`...`) y métodos inmutables de Array (`map`, `filter`, `reduce`) sobre la mutación directa de variables.
*   **Asincronía:** Uso exclusivo de `async/await` para el manejo de promesas, evitando el "callback hell" o encadenamientos complejos de `.then()`.
*   **Modern Syntax:** Uso extensivo de *Optional Chaining* (`?.`), *Nullish Coalescing* (`??`) y *Destructuring* para mantener el código conciso y seguro ante valores nulos.
*   **Modularidad:** Uso de ECMAScript Modules (ESM) nativos para facilitar el *tree-shaking* y la optimización del bundle.

---

## 📝 Documentación JSDoc (Skill Standard)

Es obligatorio documentar todos los archivos públicos siguiendo el estándar `jsdoc-typescript-docs`.

*   **@remarks:** Para proporcionar contexto técnico profundo o notas de arquitectura.
*   **@example:** Siempre incluir un ejemplo de uso en bloques de código.
*   **@typeParam / @param / @returns:** Especificar tipos y retornos claramente para facilitar el soporte del IDE.

---

## 🏗️ Convenciones de Naming

*   **PascalCase:** Componentes React, Interfaces, Contextos.
*   **camelCase:** Funciones, Hooks, Variables, Instancias de API.
*   **kebab-case:** Rutas de assets y nombres de archivos de configuración.

---

## 🎨 Estilos y Diseño (Tailwind CSS 4)

*   **Tokens de Diseño:** Definir variables CSS en `index.css` bajo el bloque `@theme` para garantizar consistencia.
*   **Composición:** Priorizar la creación de pequeños componentes de UI sobre la creación de clases CSS personalizadas complejas.
*   **Accesibilidad:** Todo componente interactivo debe utilizar primitivas de Shadcn/UI (Radix) para garantizar el cumplimiento de estándares WAI-ARIA.

---

## 🧪 Estrategia de Testing

*   **Pruebas Unitarias:** Cobertura del 100% en la capa de Dominio (funciones puras).
*   **Pruebas de Integración:** Verificación de Hooks de Aplicación mediante `renderWithProviders`.
*   **Cleanup:** Obligatorio el uso de `afterEach(cleanup)` en la configuración de Vitest para evitar contaminación de estado entre pruebas.

---

_Última actualización: 12 de febrero de 2026_
