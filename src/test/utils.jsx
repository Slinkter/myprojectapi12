import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';
import { CartProvider } from '@/features/cart/application/CartContext';
import PropTypes from 'prop-types';

/**
 * Custom render function that wraps components with all necessary providers for testing.
 * Automatically wraps components with BrowserRouter, ThemeProvider, and CartProvider.
 * 
 * This ensures that components being tested have access to:
 * - React Router navigation (useNavigate, useLocation, etc.)
 * - Theme context (theme state and toggleTheme function)
 * - Cart context (cart state and cart manipulation functions)
 * 
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} [options={}] - Additional render options from @testing-library/react
 * @returns {Object} Render result from @testing-library/react with all queries and utilities
 * 
 * @example
 * // Basic usage
 * import { renderWithProviders } from '@/test/utils';
 * 
 * test('renders component', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 * 
 * @example
 * // With custom options
 * renderWithProviders(<MyComponent />, {
 *   initialEntries: ['/products'],
 * });
 */
export function renderWithProviders(ui, options = {}) {
    /**
     * Wrapper component that provides all necessary contexts for testing.
     * @param {Object} props
     * @param {React.ReactNode} props.children - Components to wrap with providers
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

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render with our custom version
export { renderWithProviders as render };
