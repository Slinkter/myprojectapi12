# 📋 Requerimientos del Sistema

## Requerimientos Funcionales (FR)

### FR-01: Visualización de Catálogo
*   **FR-01.1:** El sistema debe cargar una lista de productos desde la API al iniciar.
*   **FR-01.2:** La lista debe mostrarse en una cuadrícula responsive (Grid).
*   **FR-01.3:** Cada tarjeta de producto debe mostrar: Imagen, Título, Precio y Descripción breve.
*   **FR-01.4:** El usuario debe poder cargar más productos mediante un botón "Load More" (Paginación).

### FR-02: Detalle de Producto
*   **FR-02.1:** Al hacer clic en un producto, se debe abrir un Modal con información detallada.
*   **FR-02.2:** El modal debe permitir seleccionar una cantidad (entre 1 y Stock disponible).
*   **FR-02.3:** Debe existir un botón para agregar la selección al carrito.

### FR-03: Carrito de Compras
*   **FR-03.1:** El carrito debe ser accesible desde cualquier vista (Drawer lateral).
*   **FR-03.2:** El usuario debe poder ver la lista de items agregados con sus subtotales.
*   **FR-03.3:** El usuario debe poder eliminar items individuales del carrito.
*   **FR-03.4:** El usuario debe poder vaciar todo el carrito.
*   **FR-03.5:** El sistema debe calcular el precio total automáticamente.

### FR-04: Checkout
*   **FR-04.1:** Debe existir una página dedicada al checkout.
*   **FR-04.2:** El formulario debe validar visualmente (simulado) los campos.
*   **FR-04.3:** Al confirmar, se debe redirigir a una página de "Éxito".

## Requerimientos Técnicos (TR)

### TR-01: Framework de Estilos (Tailwind CSS 4.1)
*   **Justificación:** Se utiliza la versión 4.1 por su motor de alto rendimiento y arquitectura CSS-first, que reduce drásticamente el tamaño del bundle de JavaScript al eliminar configuraciones pesadas de JS.

### TR-02: Navegación (React Router 7)
*   **Justificación:** Se utiliza la v7 para aprovechar las optimizaciones de carga y la compatibilidad futura con Remix, garantizando un enrutamiento rápido y seguro.

### TR-03: Gestión de Estado de Servidor (TanStack Query v5)
*   **Justificación:** Se utiliza para manejar la caché, revalidación y sincronización asíncrona, eliminando la necesidad de manejar estados `isLoading` y `error` manualmente de forma repetitiva (DRY).

### TR-04: Tipado (TypeScript Strict Mode)
*   **Justificación:** Se requiere tipado estricto para prevenir errores en tiempo de ejecución y documentar implícitamente la forma de los datos del negocio.
