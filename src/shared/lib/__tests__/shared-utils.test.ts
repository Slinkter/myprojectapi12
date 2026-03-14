import { describe, it, expect } from 'vitest';
import { formatPrice } from '../formatPrice';
import { getStockStatus } from '../stockUtils';

describe('Shared Utilities', () => {
  describe('formatPrice', () => {
    it('formatea correctamente un número a moneda USD por defecto', () => {
      // Usamos un espacio no rompible (\u00a0) que es lo que Intl.NumberFormat suele devolver en algunos entornos
      const result = formatPrice(1234.56).replace(/\u00a0/g, ' ');
      expect(result).toMatch(/\$1,234.56/);
    });

    it('maneja diferentes locales y monedas', () => {
      const result = formatPrice(1234.56, { currency: 'EUR', locale: 'de-DE' }).replace(/\u00a0/g, ' ');
      // En alemán el formato es 1.234,56 €
      expect(result).toMatch(/1\.234,56/);
      expect(result).toMatch(/€/);
    });
  });

  describe('getStockStatus', () => {
    it('retorna "out" cuando el stock es 0', () => {
      expect(getStockStatus(0)).toBe('out');
    });

    it('retorna "low" cuando el stock es menor o igual a 10', () => {
      expect(getStockStatus(5)).toBe('low');
      expect(getStockStatus(10)).toBe('low');
    });

    it('retorna "ok" cuando el stock es mayor a 10', () => {
      expect(getStockStatus(11)).toBe('ok');
      expect(getStockStatus(100)).toBe('ok');
    });
  });
});
