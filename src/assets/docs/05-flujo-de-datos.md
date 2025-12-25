# Flujo de Datos y Gestión del Estado

## 1. Modelo de Datos Principal

El sistema maneja dos tipos de datos principales:

1.  **Datos Efímeros (UI State):** Estado de carga (`loading`), errores, formularios abiertos, filtros.
2.  **Datos de Dominio:** Productos, Carrito de Compras, Orden de Pago.

### Entidades Core

#### Producto (Product)

```typescript
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number };
}
```

#### Item de Carrito (CartItem)

Extiende de `Product` añadiendo cantidad.

```typescript
interface CartItem extends Product {
    quantity: number;
}
```

## 2. Gestión del Estado (State Management)

### A. Estado Global (Context API)

Utilizamos `Context API` para datos que deben ser accesibles por componentes distantes en el árbol.

-   **`CartContext`:** Almacena el array de ítems del carrito y las funciones modificadoras (`addToCart`, `removeFromCart`).
    -   _Justificación:_ Evita pasar props desde `App` hasta `CartDrawer` o `ProductCard`.
-   **`ThemeContext`:** (Si implementado) Controla el tema visual (light/dark).

### B. Estado Local (Hooks)

Utilizamos `useState` y `useReducer` para lógica encapsulada en features.

-   **`useProducts` (Hook de Aplicación):**
    -   Maneja: `products` (data), `loading` (boolean), `error` (string).
    -   Lógica: Fetching de datos al montar el componente.

### C. Estado de Formularios

-   **CheckoutForm:** Maneja el estado de los inputs (tarjeta, nombre) de forma local controlada.

## 3. Diagrama de Flujo de Datos (Data Flow)

El flujo de datos sigue el patrón **Unidireccional** de React.

```mermaid
flowchart TD
    API[API Externa]
    Infrastructure[Layer: Infrastructure]
    Application[Layer: Application (Hooks)]
    Context[Global Store (Context)]
    UI[Layer: Presentation]

    %% Fetching Data
    API -->|JSON Response| Infrastructure
    Infrastructure -->|Normalized Data| Application
    Application -->|State Update| UI

    %% User Action (Add to Cart)
    UI -->|Event: onClick| Context
    Context -->|Action: dispatch| Context
    Context -->|New State| UI
```

## 4. Servicios y APIs

### `productsApi.js`

Capa de abstracción para `fetch`.

-   **Entrada:** Parámetros de paginación (`limit`, `skip`).
-   **Salida:** Promesa con datos JSON crudos.
-   **Transformación:** Actualmente directa, pero punto de extensión para Mappers.

### Estrategia de Carga (Fetching Strategy)

-   **Fetch-on-render:** Los datos se solicitan cuando el componente (`Home`) se monta.
-   **Pagination:** Carga incremental (Load More) concatenando resultados al estado existente.
