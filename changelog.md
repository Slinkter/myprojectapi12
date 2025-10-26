# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-25

### Added

-   **Modo Oscuro (Dark Mode)**
    -   Se configuró Tailwind CSS para soportar un modo oscuro basado en clases (`darkMode: 'class'`).
    -   Se creó un `ThemeContext` para gestionar el estado del tema (claro/oscuro) de forma global.
    -   Se implementó un `ThemeProvider` que envuelve la aplicación y provee el contexto del tema.
    -   Se añadió un componente `ThemeSwitcher` con un botón para alternar entre los modos.
    -   Se aplicaron estilos de modo oscuro a todos los componentes relevantes (`App`, `Product`, `Layout`, etc.) usando las clases `dark:`.

-   **Skeleton Loading (Carga Esqueleto)**
    -   Se creó un componente `SkeletonCard` que imita la estructura de una tarjeta de producto con animaciones de pulso.
    -   Se creó un componente `SkeletonGrid` que renderiza una cuadrícula de `SkeletonCard`s.
    -   En `App.jsx`, se reemplazó el spinner de carga inicial por el `SkeletonGrid`, mejorando la percepción de velocidad de carga.

-   **Carrito de Compras (Shopping Cart)**
    -   Se creó un `CartContext` para manejar el estado del carrito (añadir, eliminar, limpiar).
    -   Se implementó un `ProductDetailModal` que se abre al hacer clic en "Details", mostrando la información completa del producto y un selector de cantidad.
    -   Se actualizó `Product.jsx` para manejar la apertura del modal.
    -   Se crearon los componentes `CartIcon` (con un contador de ítems) y `Cart` (un panel lateral que muestra los productos del carrito, el total y opciones de gestión).
    -   Se integró el `CartIcon` en el `Layout` y el `Cart` en `App.jsx`.

-   **Gestión de Stock con `localStorage`**
    -   En el hook `useProducts`, se inicializó el stock de cada producto a 100 y se guardó en `localStorage` la primera vez que se cargan los datos.
    -   El `CartContext` fue modificado para descontar el stock del `localStorage` al añadir productos al carrito y restaurarlo al eliminarlos o limpiar el carrito.
    -   En `Product.jsx`, el botón "Details" se deshabilita y se muestra un mensaje "Out of stock" si el stock del producto es cero.

-   **Página de Checkout y Routing**
    -   Se instaló `react-router-dom` para manejar la navegación.
    -   Se crearon las páginas `Home`, `Checkout` y `CheckoutSuccess`.
    -   Se configuró un `AppRouter` para definir las rutas (`/`, `/checkout`, `/checkout-success`).
    -   `App.jsx` fue refactorizado para usar el `AppRouter`, mostrando la página correspondiente a la ruta.
    -   El botón "Checkout" en el carrito ahora navega a la página de pago.

-   **Formulario de Pago Avanzado**
    -   En la página `Checkout`, se añadió un formulario de tarjeta de crédito que aparece al seleccionar "Visa" o "Mastercard".
    -   Se implementó validación en tiempo real para los campos de la tarjeta:
        -   **Número de Tarjeta:** Formateo automático con espacios y validación con el algoritmo de Luhn.
        -   **Fecha de Vencimiento:** Formateo `MM/AA` y validación para asegurar que la fecha sea futura.
        -   **CVC:** Validación de longitud.
        -   **Nombre:** Validación de que no esté vacío.
    -   Se añadieron mensajes de error claros debajo de cada campo inválido.
    -   Se incluyó un indicador visual para el tipo de tarjeta (Visa/Mastercard).

### Changed

-   **Arquitectura y Refactorización**
    -   Se creó un componente `Layout` para encapsular la estructura general de la página (incluyendo el `ThemeSwitcher` y el `CartIcon`), simplificando `App.jsx`.
    -   Se extrajo la lógica de la cuadrícula de productos a un componente `ProductGrid`, haciendo `Products.jsx` más limpio y reutilizable.
    -   Se configuraron importaciones absolutas (`@/`) en `vite.config.js` y `jsconfig.json` para mejorar la legibilidad y mantenibilidad del código. Se actualizaron todas las rutas de importación.

-   **Corrección de Errores de Linting**
    -   Se añadieron `PropTypes` a todos los componentes nuevos para validar las props (`Layout`, `ProductGrid`, `ThemeContext`, `Cart`, etc.).
    -   Se eliminaron importaciones no utilizadas.

-   **Formato de Precios**
    -   En el componente `Cart`, se formatearon los precios de los productos y el precio total para que siempre muestren dos decimales usando `toFixed(2)`.

## [1.1.0] - 2025-10-25

### Changed

-   **Mejora de la Experiencia de Usuario (UX) en la Carga de Productos**

    Se optimizó la forma en que la aplicación maneja la carga de productos para que la experiencia del usuario sea más fluida y no se interrumpa la vista al cargar más elementos.

    #### 1. `src/hooks/useProducts.js`

    Se modificó el hook `useProducts` para diferenciar entre la carga inicial y las cargas subsecuentes.

    -   **Antes:** El hook solo tenía un estado `loading`, que se activaba tanto en la carga inicial como al presionar "Ver más".

    -   **Después:** Se introdujo un nuevo estado `initialLoading` para la carga inicial y se reutilizó `loading` para las cargas adicionales.

        ```javascript
        // src/hooks/useProducts.js

        export const useProducts = () => {
            const [products, setProducts] = useState([]);
            const [initialLoading, setInitialLoading] = useState(true); // Nuevo estado
            const [loading, setLoading] = useState(false); // Modificado para cargas secundarias
            // ...

            const getProducts = useCallback(async () => {
                // Diferenciar qué estado de carga activar
                if (page === 0) {
                    setInitialLoading(true);
                } else {
                    setLoading(true);
                }
                // ...
                // Lógica para desactivar el estado de carga correspondiente
            }, [page]);

            return { products, initialLoading, loading, error, loadMore, hasMore };
        };
        ```

    #### 2. `src/App.jsx`

    El componente principal se actualizó para consumir los nuevos estados del hook y renderizar la UI de forma condicional.

    -   **Antes:** El spinner principal se mostraba siempre que `loading` era `true`.

    -   **Después:**
        -   El spinner principal y el mensaje "Loading..." solo aparecen durante la carga inicial (`initialLoading`).
        -   El botón "Ver más" ahora muestra un spinner pequeño en su interior y se deshabilita mientras se cargan más productos (`loading`).

        ```jsx
        // src/App.jsx

        const App = () => {
            const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts();

            return (
                <div className="...">
                    {/* Solo se muestra en la carga inicial */}
                    {initialLoading && (
                        <>
                            <Spinner className="h-12 w-12" />
                            <p>Loading ...</p>
                        </>
                    )}

                    {/* El contenido principal no se oculta en cargas secundarias */}
                    {!initialLoading && !error && (
                        <div className="...">
                            {/* ... */}
                            <Products products={products} />
                            {hasMore && (
                                <Button
                                    // ...
                                    disabled={loading} // Se deshabilita durante la carga
                                >
                                    {/* Muestra un spinner pequeño o el texto */}
                                    {loading ? <Spinner className="h-4 w-4" /> : "Ver más"}
                                </Button>
                            )}
                            {/* ... */}
                        </div>
                    )}
                </div>
            );
        };
        ```

## [1.0.0] - 2025-10-25

### Added

-   Initial version of the project.
-   Refactored the project to use a custom hook (`useProducts`) and a service layer to fetch products from the API.
-   Added JSDoc comments to all components and functions.
-   Updated the `README.md` file with the new architecture and instructions.
-   Added linting and fixed all linting errors.
