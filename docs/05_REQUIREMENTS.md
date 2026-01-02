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

## Requerimientos No Funcionales (NFR)

### NFR-01: Performance
*   El tiempo de carga inicial (FCP) debe ser menor a 1.5 segundos en 4G.
*   Las animaciones de UI deben correr a 60fps constantes.

### NFR-02: Usabilidad
*   La interfaz debe implementar un diseño "Neumórfico" consistente.
*   El diseño debe ser completamente responsivo (Mobile First).

### NFR-03: Código
*   El código debe cumplir con las reglas de ESLint sin warnings bloqueantes.
*   Se debe seguir la arquitectura definida en `03_ARCHITECTURE.md`.
