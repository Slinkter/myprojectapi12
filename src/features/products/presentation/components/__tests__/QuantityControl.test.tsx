import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuantityControl from '../QuantityControl';

describe('QuantityControl Component', () => {
  const defaultProps = {
    quantity: 1,
    stock: 5,
    onIncrement: vi.fn(),
    onDecrement: vi.fn(),
  };

  it('renderiza la cantidad actual', () => {
    render(<QuantityControl {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('deshabilita el botón de decremento cuando la cantidad es 1', () => {
    render(<QuantityControl {...defaultProps} quantity={1} />);
    const buttons = screen.getAllByRole('button');
    // El primero es el de decremento (-)
    expect(buttons[0]).toBeDisabled();
  });

  it('deshabilita el botón de incremento cuando se alcanza el stock', () => {
    render(<QuantityControl {...defaultProps} quantity={5} stock={5} />);
    const buttons = screen.getAllByRole('button');
    // El segundo es el de incremento (+)
    expect(buttons[1]).toBeDisabled();
  });

  it('llama a onIncrement y onDecrement al hacer clic', () => {
    const onIncrement = vi.fn();
    const onDecrement = vi.fn();
    render(<QuantityControl {...defaultProps} quantity={2} onIncrement={onIncrement} onDecrement={onDecrement} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // +
    expect(onIncrement).toHaveBeenCalled();
    
    fireEvent.click(buttons[0]); // -
    expect(onDecrement).toHaveBeenCalled();
  });
});
