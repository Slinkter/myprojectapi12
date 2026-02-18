# 🎯 Alcance y Visión del Producto

## 1. Visión del Producto
**MyProjectAPI12** es una plataforma de comercio electrónico de demostración técnica ("Tech Demo"), diseñada para exhibir la implementación de una arquitectura de software robusta, escalable y mantenible en el ecosistema React.

A diferencia de un e-commerce convencional centrado en ventas, el valor principal de este producto reside en su **calidad de ingeniería**: separación de responsabilidades, patrones de diseño limpios y una experiencia de usuario (UX) pulida mediante una interfaz Neumórfica.

## 2. Alcance (Scope)

### ✅ Incluido (MVP)
*   **Catálogo de Productos:** Visualización de una lista paginada de productos traídos de una API externa (DummyJSON).
*   **Detalle de Producto:** Modal interactiva con información extendida y selectores de cantidad.
*   **Carrito de Compras:** Gestión de estado global (persistencia volátil), adición/eliminación de items y cálculo de subtotales.
*   **Proceso de Checkout:** Simulación de flujo de pago y pantalla de éxito.
*   **Tema:** Sistema de cambio de tema Claro/Oscuro persistente.
*   **Diseño:** Interfaz de usuario **Clean & Minimalist** reforzada con la librería de componentes **@material-tailwind/react**. Se prioriza la legibilidad, espacios en blanco y jerarquía visual sobre efectos estéticos complejos.

### ❌ Excluido (Out of Scope)
*   **Backend Propio:** No se desarrollará una API propia; se depende 100% de `dummyjson.com`.
*   **Autenticación:** No habrá login ni registro de usuarios en esta fase.
*   **Pasarela de Pagos Real:** El checkout es meramente visual/funcional a nivel de UI.
*   **Persistencia en Venta:** No se guardará historial de órdenes en base de datos.

## 3. Objetivos de Ingeniería
1.  **Desacoplamiento:** La lógica de negocio no debe depender de la librería de UI (React) más de lo estrictamente necesario.
2.  **Mantenibilidad:** Código auto-documentado y estructurado por módulos (features).
3.  **Performance:** Minimizar re-renders en el carrito y uso eficiente de recursos de red.
