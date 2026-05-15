import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardForm from '../CardForm';

describe('CardForm Component', () => {
  const defaultProps = {
    cardInfo: { number: '', name: '', expiry: '', cvc: '' },
    errors: {},
    cardType: '',
    onChange: vi.fn(),
  };

  it('se renderiza con todos los campos vacíos', () => {
    render(<CardForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/Número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del titular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vencimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument();
  });

  it('muestra mensajes de error cuando existen fallos de validación', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: { number: 'Número inválido', name: 'Nombre requerido' }
    };
    render(<CardForm {...propsWithErrors} />);
    
    expect(screen.getByText('Número inválido')).toBeInTheDocument();
    expect(screen.getByText('Nombre requerido')).toBeInTheDocument();
  });

  it('llama a onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    render(<CardForm {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText(/Nombre del titular/i);
    fireEvent.change(input, { target: { value: 'LUIS CUEVA' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('muestra el indicador de VISA cuando el cardType es visa', () => {
    render(<CardForm {...defaultProps} cardType="visa" />);
    expect(screen.getByText('VISA')).toBeInTheDocument();
  });
});
