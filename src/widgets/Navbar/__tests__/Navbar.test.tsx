import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Mock del contexto del carrito para controlar el estado en el test
vi.mock('@/features/cart/application/useCart', () => ({
  useCart: () => ({
    toggleCart: vi.fn(),
    totalItems: 3,
    cart: [
      { id: 1, title: 'Test', price: 10, quantity: 3, stock: 10, thumbnail: 'img.jpg' }
    ],
  }),
}));

describe('Navbar Widget', () => {
  it('renderiza el nombre del proyecto y el logo', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <Navbar />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/My Project API/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('muestra el contador correcto de items en el carrito', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <Navbar />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
    // 3 items según nuestro mock
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
