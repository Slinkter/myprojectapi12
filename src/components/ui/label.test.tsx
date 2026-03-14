import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './label';

describe('Label Component', () => {
  it('se renderiza con el texto correcto', () => {
    render(<Label>Nombre Completo</Label>);
    expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
  });

  it('aplica clases personalizadas', () => {
    render(<Label className="custom-class">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveClass('custom-class');
  });
});
