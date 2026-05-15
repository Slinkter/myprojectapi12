import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary Component', () => {
  it('renderiza el contenido hijo si no hay errores', () => {
    render(
      <ErrorBoundary>
        <div>Contenido Seguro</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenido Seguro')).toBeInTheDocument();
  });

  it('muestra la UI de fallback cuando ocurre un error', () => {
    // Silenciar el error en consola para este test específico
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // ErrorFallback muestra un mensaje de error genérico o específico
    expect(screen.getByText(/¡Oops! Algo salió mal/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Test Error/i).length).toBeGreaterThan(0);
    
    consoleSpy.mockRestore();
  });
});
