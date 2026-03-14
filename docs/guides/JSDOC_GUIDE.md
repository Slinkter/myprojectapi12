# Guía de JSDoc - MyProjectAPI12

## 🎯 Principios

### 1. Sé Conciso

- **Evita:** Explicaciones obvias o redundantes
- **Prefiere:** Información esencial y directa
- **Máximo:** 3-5 líneas por función/componente

### 2. Sé Directo

- **Evita:** "Este componente hace X, Y, Z..."
- **Prefiere:** Descripción directa de la responsabilidad

### 3. Evita Duplicación

- **No repitas** lo que el código ya dice
- **No documentes** implementación obvia

---

## ❌ Ejemplos de JSDoc Verboso (EVITAR)

### Ejemplo 1: Componente

```javascript
/**
 * Componente proveedor del carrito que gestiona el estado y las operaciones del carrito de compras.
 *
 * Características:
 * - Añadir productos al carrito (crea una nueva entrada o aumenta la cantidad)
 * - Eliminar productos del carrito
 * - Vaciar todo el carrito
 * - Calcular el precio total automáticamente
 * - Gestionar la visibilidad del cajón del carrito (abrir/cerrar/alternar)
 * - Mostrar notificaciones toast para las acciones del carrito
 * - Optimizado con useMemo y useCallback para prevenir re-renderizados innecesarios
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto del carrito
 * @returns {JSX.Element} Componente proveedor que envuelve a los hijos
 *
 * @example
 * // Envuelve tu aplicación con CartProvider
 * <CartProvider>
 *   <App />
 * </CartProvider>
 *
 * @example
 * // Usa el contexto del carrito en un componente
 * import { useContext } from 'react';
 * import { CartContext } from '@/features/cart/application/CartContext';
 *
 * function MyComponent() {
 *   const { cart, addToCart, totalPrice } = useContext(CartContext);
 *
 *   return (
 *     <div>
 *       <p>Items: {cart.length}</p>
 *       <p>Total: ${totalPrice.toFixed(2)}</p>
 *       <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
 *     </div>
 *   );
 * }
 */
const CartProvider = ({ children }) => {
    // ...
};
```

**Problemas:**

- 🔴 Demasiado largo (30+ líneas)
- 🔴 Lista de características redundante
- 🔴 Ejemplos innecesarios (van en docs/)
- 🔴 Información obvia ("envuelve a los hijos")

---

## ✅ Ejemplos de JSDoc Conciso (USAR)

### Ejemplo 1: Componente

```javascript
/**
 * Proveedor del contexto del carrito de compras.
 * Gestiona estado global: items, total, y visibilidad del drawer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
const CartProvider = ({ children }) => {
    // ...
};
```

**Ventajas:**

- ✅ Conciso (5 líneas)
- ✅ Información esencial
- ✅ Sin redundancia

---

### Ejemplo 2: Función

#### ❌ Verboso

```javascript
/**
 * Agrega un producto al carrito o aumenta su cantidad si ya está presente.
 * Muestra una notificación toast de éxito y abre el cajón del carrito.
 *
 * @param {Object} product - Objeto de producto a añadir
 * @param {number} product.id - ID del producto
 * @param {string} product.title - Título del producto
 * @param {number} product.price - Precio del producto
 * @param {string} product.thumbnail - URL de la imagen del producto
 * @param {number} product.stock - Stock disponible
 * @param {number} quantity - Cantidad a añadir (predeterminado: 1)
 *
 * @example
 * addToCart(product, 2); // Añade 2 unidades del producto
 */
const addToCart = (product, quantity) => {
    // ...
};
```

#### ✅ Conciso

```javascript
/**
 * Agrega un producto al carrito.
 * Incrementa cantidad si ya existe.
 *
 * @param {Object} product - Producto a agregar
 * @param {number} quantity - Cantidad
 */
const addToCart = (product, quantity) => {
    // ...
};
```

---

### Ejemplo 3: Hook

#### ❌ Verboso

```javascript
/**
 * Hook personalizado para gestionar el estado del carrito de compras.
 *
 * Este hook proporciona acceso al estado del carrito y funciones para manipularlo.
 * Incluye el array de items del carrito, el precio total calculado automáticamente,
 * y todas las funciones necesarias para agregar, eliminar y limpiar el carrito.
 *
 * El hook también gestiona el estado del drawer del carrito, permitiendo abrirlo,
 * cerrarlo y alternarlo según sea necesario.
 *
 * @returns {Object} Objeto con el estado y funciones del carrito
 * @returns {Array} cart - Array de items en el carrito
 * @returns {number} totalPrice - Precio total de todos los items
 * @returns {Function} addToCart - Función para agregar productos
 * @returns {Function} removeFromCart - Función para eliminar productos
 * @returns {Function} clearCart - Función para vaciar el carrito
 * @returns {boolean} isCartOpen - Estado del drawer del carrito
 * @returns {Function} openCart - Función para abrir el drawer
 * @returns {Function} closeCart - Función para cerrar el drawer
 * @returns {Function} toggleCart - Función para alternar el drawer
 *
 * @example
 * const { cart, addToCart, totalPrice } = useCart();
 */
export const useCart = () => {
    // ...
};
```

#### ✅ Conciso

```javascript
/**
 * Hook para acceder al contexto del carrito.
 *
 * @returns {Object} Estado y acciones del carrito
 */
export const useCart = () => {
    // ...
};
```

---

### Ejemplo 4: Función Pura

#### ❌ Verboso

```javascript
/**
 * Calcula el precio total de todos los elementos en el carrito de compras.
 *
 * Esta función recorre todos los items del carrito y suma el precio de cada uno
 * multiplicado por su cantidad. Es una función pura que no modifica el estado
 * y siempre retorna el mismo resultado para el mismo input.
 *
 * @param {Array<Object>} cart - Array de items del carrito
 * @param {number} cart[].price - Precio unitario del item
 * @param {number} cart[].quantity - Cantidad del item
 * @returns {number} El precio total de todos los items
 *
 * @example
 * const cart = [
 *   { price: 10, quantity: 2 },
 *   { price: 5, quantity: 3 }
 * ];
 * const total = calculateTotal(cart); // 35
 */
export const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
```

#### ✅ Conciso

```javascript
/**
 * Calcula el precio total del carrito.
 *
 * @param {Array} cart - Items del carrito
 * @returns {number} Precio total
 */
export const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
```

---

## 📏 Reglas de JSDoc

### Para Componentes React

```javascript
/**
 * [Descripción breve en 1 línea]
 * [Detalles adicionales si es necesario - máx 2 líneas]
 *
 * @param {Object} props
 * @param {Type} props.propName - Descripción breve
 */
```

### Para Hooks

```javascript
/**
 * [Descripción breve del propósito del hook]
 *
 * @param {Type} paramName - Descripción breve
 * @returns {Type} Descripción breve del retorno
 */
```

### Para Funciones Puras

```javascript
/**
 * [Descripción breve de qué hace]
 *
 * @param {Type} paramName - Descripción
 * @returns {Type} Descripción
 */
```

### Para Archivos

```javascript
/**
 * [Descripción del propósito del archivo en 1-2 líneas]
 */
```

---

## 🚫 Qué NO Documentar

### 1. Implementación Obvia

```javascript
// ❌ NO HACER
/**
 * Retorna verdadero si el carrito está vacío.
 *
 * @returns {boolean} true si el carrito no tiene items, false en caso contrario
 */
const isEmpty = () => cart.length === 0;

// ✅ HACER (sin JSDoc, el código es claro)
const isEmpty = () => cart.length === 0;
```

### 2. Getters/Setters Simples

```javascript
// ❌ NO HACER
/**
 * Establece el estado del carrito.
 *
 * @param {Array} newCart - Nuevo estado del carrito
 */
const setCart = (newCart) => {
    // ...
};

// ✅ HACER (sin JSDoc)
const setCart = (newCart) => {
    // ...
};
```

### 3. Código Auto-explicativo

```javascript
// ❌ NO HACER
/**
 * Filtra los items del carrito que tienen stock disponible.
 */
const itemsInStock = cart.filter((item) => item.stock > 0);

// ✅ HACER (sin JSDoc, el nombre es claro)
const itemsInStock = cart.filter((item) => item.stock > 0);
```

---

## ✅ Qué SÍ Documentar

### 1. Componentes Públicos

```javascript
/**
 * Tarjeta de producto con imagen, título, precio y botón de compra.
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto
 */
```

### 2. Hooks Personalizados

```javascript
/**
 * Hook para gestionar el estado de autenticación.
 *
 * @returns {Object} Usuario actual y funciones de auth
 */
```

### 3. Funciones con Lógica Compleja

```javascript
/**
 * Calcula el descuento aplicable según reglas de negocio.
 * Aplica descuentos por cantidad, cupones y promociones.
 *
 * @param {Object} cart - Carrito de compras
 * @param {string} couponCode - Código de cupón (opcional)
 * @returns {number} Monto del descuento
 */
```

### 4. APIs Públicas

```javascript
/**
 * Obtiene productos de la API con paginación.
 *
 * @param {number} page - Número de página
 * @param {number} limit - Items por página
 * @returns {Promise<Object>} Productos y metadata
 */
```

---

## 📊 Comparación de Longitud

| Tipo           | Antes     | Después  | Reducción |
| -------------- | --------- | -------- | --------- |
| **Componente** | 30 líneas | 5 líneas | 83%       |
| **Función**    | 15 líneas | 5 líneas | 67%       |
| **Hook**       | 20 líneas | 4 líneas | 80%       |
| **Archivo**    | 10 líneas | 2 líneas | 80%       |

---

## 🎯 Objetivo

**Reducir JSDoc en 50-70% manteniendo información esencial.**

---

_Última actualización: Febrero 5, 2026_
