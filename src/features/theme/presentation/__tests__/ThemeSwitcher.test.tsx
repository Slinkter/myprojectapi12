import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeSwitcher from '../ThemeSwitcher';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';

describe('ThemeSwitcher Component', () => {
  it('alterna el tema al hacer clic', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    // Inicialmente es light, el label dirá "Cambiar a modo oscuro"
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo claro');
  });
});
