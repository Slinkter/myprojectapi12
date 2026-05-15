import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from '../Layout';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';
import { CartProvider } from '@/features/cart/application/CartContext';

// Mock de react-hot-toast (usado en Layout)
vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />
}));

describe('Layout Component', () => {
  it('renderiza el contenido hijo dentro del main', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CartProvider>
            <Layout>
              <div data-testid="child-content">Contenido de prueba</div>
            </Layout>
          </CartProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
