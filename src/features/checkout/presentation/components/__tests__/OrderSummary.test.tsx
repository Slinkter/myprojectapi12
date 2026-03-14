import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderSummary } from '../OrderSummary';
import { makeCartItem } from '@/test/factories/productFactory';

describe('OrderSummary Component', () => {
  const mockItems = [
    makeCartItem({ id: 1, title: 'Producto A', price: 20, quantity: 2 }),
  ];
  const totalPrice = 40;

  it('calcula y muestra el subtotal correctamente', () => {
    render(<OrderSummary items={mockItems} totalPrice={totalPrice} />);
    
    expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
    // Usamos getAllByText y verificamos que al menos uno exista, para ser más robustos ante duplicados visuales
    expect(screen.getAllByText('$40.00').length).toBeGreaterThan(0);
  });

  it('muestra costo de envío cuando el total es menor a 50', () => {
    render(<OrderSummary items={mockItems} totalPrice={40} />);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getAllByText(/Total/i).length).toBeGreaterThan(0);
    // Total: 40 + 9.99 = 49.99
    expect(screen.getAllByText('$49.99').length).toBeGreaterThan(0);
  });

  it('muestra envío GRATIS cuando el total es mayor o igual a 50', () => {
    render(<OrderSummary items={mockItems} totalPrice={60} />);
    expect(screen.getByText('GRATIS')).toBeInTheDocument();
    expect(screen.getAllByText('$60.00').length).toBeGreaterThan(0);
  });

  it('permite aplicar un código de descuento válido (WELCOME10)', async () => {
    render(<OrderSummary items={mockItems} totalPrice={100} />);
    
    const input = screen.getByPlaceholderText(/Ingresa tu código/i);
    const button = screen.getByText('Aplicar');
    
    fireEvent.change(input, { target: { value: 'WELCOME10' } });
    fireEvent.click(button);
    
    // Esperar al setTimeout del componente (500ms) y verificar el descuento
    // El texto del descuento puede ser "-$10.00" o similar, lo buscamos de forma flexible
    await waitFor(() => {
      expect(screen.getByText(/WELCOME10/i)).toBeInTheDocument();
      expect(screen.getByText(/10\.00/)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Total con envío gratis (100 >= 50): 100 - 10 = 90
    expect(screen.getAllByText('$90.00').length).toBeGreaterThan(0);
  });
});
