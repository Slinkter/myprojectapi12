/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';
import { CartProvider } from '@/features/cart/application/CartContext';
import PropTypes from 'prop-types';

/**
 * Custom render function that wraps components with all necessary providers for testing.
 *
 * @remarks
 * This utility automatically wraps the UI component with:
 * - `BrowserRouter`: For React Router navigation logic.
 * - `ThemeProvider`: For theme-related state (dark/light mode).
 * - `CartProvider`: For shopping cart state management.
 *
 * Use this instead of `@testing-library/react`'s `render` whenever testing components
 * that depend on global state or routing.
 *
 * @param {React.ReactElement} ui - The component to render.
 * @param {Object} [options={}] - Additional options for the testing-library render.
 * @returns {import('@testing-library/react').RenderResult} Result containing queries and utilities.
 *
 * @example
 * ```jsx
 * import { render } from '@/test/utils';
 *
 * test('renders a link', () => {
 *   render(<Navbar />);
 *   expect(screen.getByRole('navigation')).toBeInTheDocument();
 * });
 * ```
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
