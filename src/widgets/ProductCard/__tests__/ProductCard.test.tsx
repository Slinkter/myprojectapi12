import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../ProductCard';
import { makeProduct } from '@/test/factories/productFactory';

// Mock del contexto para evitar problemas de providers
vi.mock('@/features/products/application/useProductModalContext', () => ({
  useProductModalContext: () => ({
    handleOpenModal: vi.fn(),
  }),
}));

describe('ProductCard Component', () => {
  const mockProduct = makeProduct({
    id: 1,
    title: 'Producto de Prueba',
    price: 99.99,
    stock: 50,
  });

  it('se renderiza con los datos del producto', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('50 disponibles')).toBeInTheDocument();
  });

  it('muestra el mensaje "Sin stock" cuando no hay stock', () => {
    const outOfStockProduct = makeProduct({ stock: 0 });
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
