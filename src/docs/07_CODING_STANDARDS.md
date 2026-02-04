# 📏 Estándares de Código y Convenciones

## Naming Conventions
*   **PascalCase:** Componentes React (`ProductCard.jsx`), Contextos (`CartContext.jsx`), Pages (`Home.jsx`).
*   **camelCase:** Hooks (`useProducts.js`), funciones utilitarias (`formatCurrency.js`), variables, instancias.
*   **kebab-case:** Nombres de carpetas de css/assets si aplica, aunque preferimos camelCase o PascalCase para carpetas de componentes para coincidir con el componente principal.

### Estructura de Archivos
*   Componentes deben tener su propio archivo `.jsx`.
*   Hooks deben tener prefix `use`.
*   Si un componente tiene sub-componentes exclusivos, agrupar en carpeta:
    ```
    ProductCard/
    ├── ProductCard.jsx
    ├── ProductCardImage.jsx
    └── index.js (Barrel file opcional)
    ```

## JSDoc y Comentarios
Es **obligatorio** documentar funciones públicas, hooks complejos y componentes compartidos.

### Estándar para Componentes
```javascript
/**
 * Componente de tarjeta para mostrar resumen de producto.
 * 
 * @param {Object} props
 * @param {string} props.title - Título del producto
 * @param {number} props.price - Precio unitario
 * @returns {JSX.Element}
 */
const ProductCard = ({ title, price }) => { ... }
```

### Estándar para Hooks
```javascript
/**
 * Hook para manejar la lógica de carrito.
 * 
 * @returns {{
 *   cart: Array, 
 *   addToCart: Function, 
 *   total: number
 * }}
 */
```

## Estilos (Tailwind CSS)
*   Evitar `@apply` masivo en `index.css`.
*   Preferir composición de componentes React pequeños (`<Button variant="primary">`) sobre clases CSS complejas (`.btn-primary`).
*   Mantener orden lógico de clases: layout (`flex`, `grid`) -> spacing (`m-4`, `p-4`) -> visual (`bg-red-500`, `rounded`).

## Commits
Formato: `TIPO: Descripción breve`
*   `FEAT`: Nueva funcionalidad.
*   `FIX`: Corrección de bug.
*   `REFACTOR`: Cambio de código sin cambio de funcionalidad.
*   `DOCS`: Cambios en documentación.
*   `STYLE`: Cambios de formato/espaciado (no CSS de funcionalidad).
