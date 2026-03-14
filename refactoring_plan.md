# Plan de Refactorización para MyProjectAPI12 - Adaptación a Junior-Friendly

## 🎯 Objetivo General
Transformar el código base de MyProjectAPI12 para que sea más legible, predecible y fácil de mantener por un desarrollador Junior, aplicando principios de Clean Code, estandarización de nomenclatura y modularización.

---

## 📅 Fecha de Creación: 2026-03-14 09:55:13

---

## 🚀 Fases del Plan

### Fase 1: Nomenclatura y Tipos
- **Timestamp de inicio:** [Timestamp de inicio de la fase 1]
- **Objetivo:** Estandarizar la nomenclatura de interfaces y variables booleanas para mejorar la legibilidad y mantenimiento del código.
- **Acciones:**
    1.  **Interfaces (`I` prefix):**
        -   **Identificación:** En el directorio `src/`, localizar todas las interfaces de TypeScript que NO comiencen con la letra `I`.
        -   **Renombrado:** Renombrar estas interfaces para que SI comiencen con `I` (ej: `Product` -> `IProduct`, `CartItem` -> `ICartItem`).
        -   **Actualización de Referencias:** Actualizar todas las referencias (importaciones y usos) a estas interfaces renombradas en todo el proyecto.
        -   **Prioridad:** Aplicar en los directorios: `src/features`, `src/app`, `src/components`, `src/shared`, `src/entities`.
    2.  **Variables Booleanas (`is`/`has`/`should`/`can` prefixes):**
        -   **Identificación:** Localizar variables booleanas dentro de funciones, hooks y componentes (principalmente en `src/features`, `src/app`, `src/components`, `src/shared`).
        -   **Renombrado:** Renombrarlas para reflejar su estado booleano de forma semántica (ej: `loading` -> `isLoading`, `open` -> `isOpen`, `error` -> `hasError`, `visible` -> `isVisible`).
        -   **Actualización de Referencias:** Actualizar todas las referencias a estas variables renombradas.
- **Validación al finalizar la fase:**
    -   `pnpm type-check`: Asegurar que no haya errores de TypeScript.
    -   `pnpm lint`: Verificar que no se introdujeron errores de linting.
    -   `pnpm test`: Ejecutar tests unitarios y de integración para asegurar la funcionalidad.
- **Timestamp de finalización:** [Timestamp de finalización de la fase 1]

---

### Fase 2: Hooks y Lógica
- **Timestamp de inicio:** [Timestamp de inicio de la fase 2]
- **Objetivo:** Simplificar y estandarizar la estructura y nomenclatura de funciones dentro de los custom hooks y la lógica de aplicación.
- **Acciones:**
    1.  **Renombrado de Funciones:**
        -   En los directorios `src/features/**/application/` y `src/shared/hooks/`, identificar funciones con nombres genéricos o comprimidos.
        -   Renombrarlas siguiendo convenciones claras (ej: `add` -> `handleAddToCart`, `fetch` -> `fetchProducts`).
    2.  **Modularización de Lógica:**
        -   Identificar bloques de lógica complejos o repetitivos dentro de los hooks.
        -   Extraer esta lógica a funciones auxiliares más pequeñas y bien nombradas, idealmente dentro del mismo archivo o en archivos `utils` si son reutilizables.
    3.  **Documentación JSDoc:**
        -   Asegurarse de que cada custom hook y sus funciones exportadas tengan comentarios JSDoc claros, describiendo su propósito, parámetros (`@param`) y valores de retorno (`@returns`).
- **Validación al finalizar la fase:**
    -   `pnpm type-check`, `pnpm lint`, `pnpm test`.
    -   Revisión manual de los hooks modificados para asegurar claridad y adherencia a las nuevas convenciones.
- **Timestamp de finalización:** [Timestamp de finalización de la fase 2]

---

### Fase 3: UI y Componentes
- **Timestamp de inicio:** [Timestamp de inicio de la fase 3]
- **Objetivo:** Descomponer componentes de UI grandes y complejos en sub-componentes más pequeños y gestionables, siguiendo el principio de responsabilidad única.
- **Acciones:**
    1.  **Refactorización de `src/widgets/CartDrawer/CartDrawer.tsx`:**
        -   Dividir este componente en sub-componentes como:
            -   `<CartDrawerHeader />`: Encargado del título y botón de cerrar.
            -   `<CartItemList />`: Encargado de listar los `ICartItem`s, con `<CartItemCard />` para cada item.
            -   `<CartSummary />`: Para el resumen de precios.
            -   `<CartActions />`: Para botones de acción (ej. proceder al pago).
    2.  **Refactorización de `src/features/checkout/presentation/components/CardForm.tsx`:**
        -   Utilizar inputs genéricos y reutilizables.
        -   Extraer la lógica de validación y manejo de errores.
        -   Considerar sub-componentes específicos para campos de tarjeta de crédito si la complejidad lo justifica.
    3.  **Refactorización de Otros Componentes Grandes:**
        -   Aplicar la misma estrategia a `src/features/checkout/presentation/components/OrderSummary.tsx`, `src/features/products/presentation/ProductDetailModal.tsx`, `src/features/cart/presentation/Cart.tsx`, `src/features/checkout/presentation/Checkout.tsx`.
        -   Identificar y extraer secciones lógicas a sub-componentes dedicados.
- **Validación al finalizar la fase:**
    -   `pnpm type-check`, `pnpm lint`, `pnpm test`.
    -   Verificación visual de la UI en el navegador (`pnpm dev`) para asegurar que todos los componentes se renderizan correctamente y la interactividad funciona como se espera.
- **Timestamp de finalización:** [Timestamp de finalización de la fase 3]