import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from '../Loader';

describe('Loader Component', () => {
  it('se renderiza correctamente con el texto de carga', () => {
    render(<Loader text="Cargando..." />);
    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });

  it('tiene el contenedor overlay visible', () => {
    const { container } = render(<Loader />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed', 'inset-0');
  });
});
