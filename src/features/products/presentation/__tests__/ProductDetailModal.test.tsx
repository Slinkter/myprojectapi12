import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductDetailModal from '../ProductDetailModal';
import { makeProduct } from '@/test/factories/productFactory';
import { CartProvider } from '@/features/cart/application/CartContext';

// Mock de framer-motion para evitar problemas con las animaciones en el test
vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ProductDetailModal Component', () => {
  const mockProduct = makeProduct({
    id: 1,
    title: 'Reloj Premium',
    description: 'Un reloj de lujo',
    price: 500,
    stock: 10,
    brand: 'Rolex',
    category: 'Relojes'
  });

  const defaultProps = {
    product: mockProduct,
    open: true,
    onClose: vi.fn(),
  };

  it('renderiza los detalles del producto cuando está abierto', () => {
    render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} />
      </CartProvider>
    );

    expect(screen.getByText('Reloj Premium')).toBeInTheDocument();
    expect(screen.getByText('Un reloj de lujo')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('llama a onClose al hacer clic en el botón de cierre', () => {
    const onClose = vi.fn();
    render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} onClose={onClose} />
      </CartProvider>
    );

    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('no renderiza nada si open es false', () => {
    const { container } = render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} open={false} />
      </CartProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
