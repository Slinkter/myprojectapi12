import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import * as themeStorage from '@/features/theme/infrastructure/themeStorage';
import type { ReactNode } from 'react';

// Mock themeStorage
vi.mock('@/features/theme/infrastructure/themeStorage', () => ({
  getStoredTheme: vi.fn(() => 'light'),
  saveTheme: vi.fn(),
  applyThemeToDocument: vi.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe iniciar con el tema guardado en storage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');
    expect(themeStorage.getStoredTheme).toHaveBeenCalled();
  });

  it('debe alternar entre light y dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.theme).toBe('dark');
    expect(themeStorage.saveTheme).toHaveBeenCalledWith('dark');
    expect(themeStorage.applyThemeToDocument).toHaveBeenCalledWith('dark');

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.theme).toBe('light');
    expect(themeStorage.saveTheme).toHaveBeenCalledWith('light');
  });

  it('debe lanzar un error si se usa fuera de ThemeProvider', () => {
    // Evitar que el error se imprima en la consola del test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme debe usarse dentro de un ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
