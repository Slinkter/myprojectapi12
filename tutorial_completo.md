# Tutorial Completo: Construyendo un E-commerce Profesional con React

Este tutorial te guiará paso a paso para recrear este proyecto, aprendiendo en el proceso sobre Clean Architecture, BEM y patrones avanzados de React.

## Índice

1. Configuración Inicial
2. Estructura del Proyecto (Feature-Based)
3. Configuración de Estilos (Tailwind + BEM)
4. Implementando la Feature: Productos
5. Implementando la Feature: Carrito (Context API)
6. Feature: Checkout y Enrutamiento
7. Optimizaciones Finales

---

## 1. Configuración Inicial

Comenzaremos creando el proyecto con Vite, una herramienta de construcción ultrarrápida.

```bash
npm create vite@latest myprojectapi12 -- --template react
cd myprojectapi12
npm install
```

Instalamos las dependencias necesarias:

-   `react-router-dom`: Para la navegación.
-   `tailwindcss`, `postcss`, `autoprefixer`: Para estilos.
-   `@material-tailwind/react`: Componentes UI base.
-   `react-icons`: Iconografía.
-   `prop-types`: Validación de tipos en runtime.

```bash
npm install react-router-dom @material-tailwind/react react-icons prop-types
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configura `tailwind.config.js` para incluir tus archivos:

```javascript
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    // ... resto de config
};
```

## 2. Estructura del Proyecto (Feature-Based)

En lugar de agrupar por tipo (todos los componentes juntos), agruparemos por funcionalidad. Crea esta estructura:

```bash
mkdir -p src/features/products/{application,infrastructure,presentation}
mkdir -p src/features/cart/{application,presentation}
mkdir -p src/features/checkout/{application,presentation}
mkdir -p src/components/common
mkdir src/pages src/routes src/context src/utils
```

### ¿Por qué esta estructura?

Permite que cada "feature" sea autónoma. Si borras la carpeta `products`, desaparece toda la lógica relacionada con productos sin dejar código huérfano disperso.

## 3. Configuración de Estilos (Tailwind + BEM)

Para mantener el código limpio, no usaremos clases de utilidad infinitas en el JSX. Usaremos **BEM** en `src/index.css`.

**src/index.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.product-card {
    @apply w-full max-w-sm bg-white rounded-lg shadow-md hover:scale-105 transition-transform;
}
/* ... definir resto de clases aquí */
```

## 4. Implementando la Feature: Productos

### Capa de Infraestructura (`infrastructure/productsApi.js`)

Aquí va la llamada a la API. Separarlo nos permite cambiar la API mañana sin tocar el componente.

```javascript
export const fetchProducts = async (skip = 0) => {
    const res = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${skip}`
    );
    return res.json();
};
```

### Capa de Aplicación (`application/useProducts.js`)

Un Custom Hook que gestiona el estado. El componente no debe saber cómo se cargan los datos, solo pedirlos.

```javascript
const useProducts = () => {
    const [products, setProducts] = useState([]);
    // ... lógica de loading, error y paginación
    return { products, loading, error, loadMore };
};
```

### Capa de Presentación (`presentation/ProductGrid.jsx`)

Solo renderiza datos. "Componente Tonto" (Dumb Component).

## 5. Implementando la Feature: Carrito (Context API)

El estado del carrito debe ser global.

**src/features/cart/application/CartContext.jsx**:
Usamos `createContext` y `useReducer` (o `useState` para empezar).
Es crucial usar `useMemo` para el valor del contexto y `useCallback` para las funciones (`addToCart`) para evitar re-renderizados innecesarios en toda la app.

```javascript
// Lógica para calcular total automáticamente
const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}, [cart]);
```

## 6. Feature: Checkout y Enrutamiento

Configuramos las rutas en `src/AppRouter.jsx`.
Usamos **Lazy Loading** para el Checkout. Esto significa que el código de la página de pago no se descarga hasta que el usuario intenta pagar, haciendo la carga inicial más rápida.

```javascript
const Checkout = lazy(() =>
    import("@/features/checkout/presentation/Checkout")
);

<Suspense fallback={<Loader />}>
    <Routes>
        <Route path="/checkout" element={<Checkout />} />
    </Routes>
</Suspense>;
```

## 7. Errores Comunes y Optimizaciones

-   **Prop Drilling**: Pasar props por 5 niveles. -> **Solución**: Usar Context API o Composición.
-   **Renders Innecesarios**: El carrito se renderiza cuando escribes en un input. -> **Solución**: `React.memo` y `useCallback`.
-   **Estilos Caóticos**: Clases inline kilométricas. -> **Solución**: `@apply` y BEM como implementamos hoy.

¡Felicidades! Tienes una aplicación React profesional, escalable y mantenible.
