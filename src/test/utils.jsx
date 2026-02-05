/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';
import { CartProvider } from '@/features/cart/application/CartContext';
import PropTypes from 'prop-types';

/**
 * Función de renderizado personalizada que envuelve componentes con todos los proveedores necesarios para las pruebas.
 * Envuelve automáticamente los componentes con BrowserRouter, ThemeProvider y CartProvider.
 *
 * Esto asegura que los componentes que se están probando tengan acceso a:
 * - Navegación de React Router (useNavigate, useLocation, etc.)
 * - Contexto del tema (estado del tema y función toggleTheme)
 * - Contexto del carrito (estado del carrito y funciones de manipulación del carrito)
 *
 * @param {React.ReactElement} ui - Componente a renderizar
 * @param {Object} [options={}] - Opciones de renderizado adicionales de @testing-library/react
 * @returns {Object} Resultado de renderizado de @testing-library/react con todas las consultas y utilidades
 *
 * @example
 * // Uso básico
 * import { renderWithProviders } from '@/test/utils';
 *
 * test('renders component', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 *
 * @example
 * // Con opciones personalizadas
 * renderWithProviders(<MyComponent />, {
 *   initialEntries: ['/products'],
 * });
 */
export function renderWithProviders(ui, options = {}) {
    /**
     * Componente envoltorio que proporciona todos los contextos necesarios para las pruebas.
     * @param {Object} props
     * @param {React.ReactNode} props.children - Componentes a envolver con proveedores
     */
    const AllProviders = ({ children }) => {
        return (
            <BrowserRouter>
                <ThemeProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ThemeProvider>
            </BrowserRouter>
        );
    };

    AllProviders.propTypes = {
        children: PropTypes.node.isRequired,
    };

    return render(ui, { wrapper: AllProviders, ...options });
}

// Re-exporta todo desde @testing-library/react
export * from '@testing-library/react';

// Sobrescribe render con nuestra versión personalizada
export { renderWithProviders as render };
