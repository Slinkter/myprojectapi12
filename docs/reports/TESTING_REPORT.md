# Documentación del Proceso de Testing

Este documento detalla el proceso de testing implementado en el proyecto, incluyendo la justificación, las herramientas utilizadas, la configuración y la estructura de los tests.

## 1. Justificación del Testing

El testing es una práctica fundamental en el desarrollo de software que asegura la calidad, fiabilidad y estabilidad de la aplicación. Para este proyecto, el testing es crucial por las siguientes razones:

*   **Detección temprana de errores:** Permite identificar y corregir bugs en etapas tempranas del ciclo de desarrollo, reduciendo costos y tiempo de corrección.
*   **Fiabilidad del código:** Asegura que las funcionalidades clave del carrito de compras, la navegación y la interacción con la API funcionen como se espera.
*   **Mantenibilidad:** Facilita la refactorización y la adición de nuevas características con la confianza de que los cambios no romperán funcionalidades existentes (regresiones).
*   **Colaboración:** Proporciona una base común de entendimiento sobre el comportamiento esperado de cada componente y característica, mejorando la comunicación entre desarrolladores.
*   **Experiencia del usuario:** Garantiza que la aplicación ofrezca una experiencia consistente y libre de errores al usuario final.

## 2. Plan de Testing (Estrategia General)

La estrategia de testing en este proyecto se centra principalmente en:

*   **Tests Unitarios:** Para verificar el correcto funcionamiento de unidades de código aisladas, como componentes individuales de React, funciones utilitarias o lógica de contexto.
*   **Tests de Integración:** Para asegurar que diferentes unidades de código (por ejemplo, un componente y su contexto, o un componente que interactúa con la API) funcionan correctamente juntas.
*   **Tests de Componentes (End-to-End simulado):** Utilizando `@testing-library/react`, se simulan interacciones de usuario en los componentes, asegurando que la interfaz de usuario responde correctamente a eventos y que los datos se muestran adecuadamente.

El enfoque es escribir tests que se centren en el comportamiento del usuario más que en los detalles de implementación interna.

## 3. Librerías y Herramientas Utilizadas

Las siguientes librerías y herramientas son el pilar del proceso de testing:

*   **Vitest (`vitest`)**:
    *   **Propósito:** Framework de testing rápido y moderno, optimizado para proyectos Vite. Es el corredor de tests principal.
    *   **Características clave:** Integración sencilla con Vite, velocidad de ejecución, soporte para TypeScript, JSDOM para entornos de navegador simulados.
*   **React Testing Library (`@testing-library/react`)**:
    *   **Propósito:** Proporciona utilidades para testear componentes de React de una manera que se asemeja a cómo interactuaría un usuario con ellos.
    *   **Filosofía:** Enfatiza testear el comportamiento del usuario y la accesibilidad, en lugar de los detalles de implementación interna del componente.
*   **`@testing-library/jest-dom`**:
    *   **Propósito:** Extiende las capacidades de `expect` de Vitest con matchers personalizados para aserciones de DOM.
    *   **Ejemplos:** `.toBeInTheDocument()`, `.toHaveTextContent()`, `.toBeDisabled()`.
*   **JSDOM (`jsdom`)**:
    *   **Propósito:** Proporciona una implementación del Modelo de Objeto de Documento (DOM) estándar web que se ejecuta en Node.js, permitiendo testear componentes de UI sin un navegador real.
    *   **Configuración:** Se especifica en `vitest.config.js`.
*   **`@testing-library/user-event`**:
    *   **Propósito:** Simula eventos de usuario de forma más realista que `fireEvent` (por ejemplo, `userEvent.click()` simula todos los eventos del navegador que ocurren con un clic real).
*   **`eslint-plugin-vitest`**:
    *   **Propósito:** Plugin de ESLint para asegurar las mejores prácticas y la consistencia en la escritura de tests con Vitest.

## 4. Archivos de Testing Clave y Estructura

La organización de los archivos de testing sigue una convención para mantener la claridad y la capacidad de descubrimiento:

*   **`vitest.config.js`**:
    *   **Ubicación:** Raíz del proyecto.
    *   **Descripción:** Archivo de configuración principal para Vitest. Define el entorno de ejecución (`jsdom`), la disponibilidad global de utilidades, los archivos de setup y los alias de ruta.
    *   **Configuración relevante:**
        ```javascript
        export default defineConfig({
            plugins: [react()],
            test: {
                environment: 'jsdom',
                globals: true,
                setupFiles: './src/test/setup.js',
                css: true,
            },
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                },
            },
        });
        ```
*   **`package.json`**:
    *   **Ubicación:** Raíz del proyecto.
    *   **Descripción:** Contiene los scripts para ejecutar los tests (`pnpm test`, `pnpm test:ui`, `pnpm test:coverage`) y lista todas las dependencias de testing en `devDependencies`.
*   **`src/test/setup.js`**:
    *   **Ubicación:** Directorio de `src/test/`.
    *   **Descripción:** Se ejecuta una vez antes de todos los tests. Configura el entorno de testing global:
        *   Importa `@testing-library/jest-dom` para extender las aserciones de Vitest.
        *   Configura `cleanup()` de `@testing-library/react` para ejecutarse después de cada test, limpiando el DOM.
        *   Mocquea `window.matchMedia`, esencial para testear componentes que dependen de media queries.
*   **`src/test/utils.jsx`**:
    *   **Ubicación:** Directorio de `src/test/`.
    *   **Descripción:** Proporciona una función `renderWithProviders` personalizada. Esta función envuelve los componentes a testear con los proveedores de contexto necesarios (`BrowserRouter`, `ThemeProvider`, `CartProvider`), replicando el entorno de la aplicación real. Esto evita la duplicación de código en los tests y asegura que los componentes se prueben con su contexto esperado. También re-exporta las utilidades de `@testing-library/react`.
*   **Archivos de Test Específicos (`__tests__/*.test.jsx`)**:
    *   **Ubicación:** Dentro de las carpetas de las características (`src/features/.../__tests__`) o de los componentes.
    *   **Convención de Nomenclatura:** Los archivos de test terminan con `.test.jsx`.
    *   **Descripción:** Contienen los tests unitarios y de integración para las funcionalidades específicas. Por ejemplo, `src/features/cart/application/__tests__/CartContext.test.jsx` contiene tests para el contexto del carrito.

## 5. Implementación de Testing (Ejemplo y Estructura)

Los tests se escriben utilizando la API de Vitest (similar a Jest) y las utilidades de React Testing Library.

**Ejemplo de Test (Basado en `CartContext.test.jsx`):**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@/test/utils'; // Usando el render customizado
import { useContext } from 'react';
import { CartProvider, CartContext } from '../CartContext';

// Un componente de prueba para interactuar con el CartContext
const TestComponent = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div>
      <div data-testid="cart-items">{cart.length}</div>
      <button onClick={() => addToCart({ id: 1, name: 'Item 1' })}>Add Item 1</button>
      <button onClick={() => removeFromCart(1)}>Remove Item 1</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  it('should provide an empty cart initially', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
  });

  it('should add an item to the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const addButton = screen.getByText('Add Item 1');
    act(() => {
      addButton.click();
    });
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
  });

  it('should remove an item from the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const addButton = screen.getByText('Add Item 1');
    act(() => {
      addButton.click();
    });
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1');

    const removeButton = screen.getByText('Remove Item 1');
    act(() => {
      removeButton.click();
    });
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
  });

  it('should clear the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const addButton = screen.getByText('Add Item 1');
    act(() => {
      addButton.click();
    });
    act(() => {
      addButton.click();
    });
    expect(screen.getByTestId('cart-items')).toHaveTextContent('2');

    const clearButton = screen.getByText('Clear Cart');
    act(() => {
      clearButton.click();
    });
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
  });
});
```

**Estructura Típica de un Test:**

1.  **Importaciones:** Se importan las funciones de testing (`describe`, `it`, `expect`), las utilidades de React Testing Library (`render`, `screen`, `act`), y el componente/contexto a testear. Es común importar `render` desde `src/test/utils` para usar el renderizador personalizado con proveedores.
2.  **`describe` Block:** Agrupa tests relacionados bajo una descripción común (ej. "CartContext").
3.  **Mocks (si es necesario):** Se definen mocks para dependencias externas (ej. API calls, funciones de utilidad, `window` objetos) para asegurar el aislamiento del test.
4.  **`beforeEach`/`afterEach` (si es necesario):** Hooks para configurar o limpiar el estado antes/después de cada test. `src/test/setup.js` ya maneja `cleanup()` globalmente.
5.  **`it` (o `test`) Block:** Define un caso de test individual con una descripción clara del comportamiento esperado.
    *   **Renderizado:** Se renderiza el componente o el proveedor de contexto utilizando `render` (generalmente `renderWithProviders`).
    *   **Interacciones:** Se simulan interacciones de usuario usando `userEvent` o `act` para envolver actualizaciones de estado que pueden afectar el DOM.
    *   **Aserciones:** Se verifica el estado del DOM o el comportamiento del componente utilizando `expect` junto con los matchers de `@testing-library/jest-dom`.

Este enfoque garantiza que el código sea probado de manera efectiva y que los tests sean legibles, mantenibles y cercanos a la experiencia del usuario final.
