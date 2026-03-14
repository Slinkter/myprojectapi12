import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input';

describe('Input Component', () => {
  it('se renderiza correctamente', () => {
    render(<Input placeholder="Nombre de usuario" />);
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
  });

  it('permite escribir texto', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test');
  });

  it('está deshabilitado cuando se pasa la prop disabled', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
