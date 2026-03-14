import { describe, it, expect } from 'vitest';
import { formatCardNumber, formatExpiryDate, getCardType } from '../formatters';

describe('Checkout Domain Formatters', () => {
  describe('formatCardNumber', () => {
    it('añade espacios cada 4 dígitos', () => {
      expect(formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
    });

    it('elimina caracteres no numéricos', () => {
      expect(formatCardNumber('1234-abcd-5678')).toBe('1234 5678');
    });
  });

  describe('formatExpiryDate', () => {
    it('añade una barra después del mes', () => {
      // Nota: según la implementación actual, solo añade la barra si hay exactamente 2 dígitos
      // "123" -> "12/3"
      expect(formatExpiryDate('1234')).toBe('12/34');
    });

    it('limita la longitud a 5 caracteres (MM/YY)', () => {
      expect(formatExpiryDate('123456')).toBe('12/34');
    });
  });

  describe('getCardType', () => {
    it('detecta Visa si empieza con 4', () => {
      expect(getCardType('4123')).toBe('visa');
    });

    it('detecta Mastercard si empieza con 5', () => {
      expect(getCardType('5123')).toBe('mastercard');
    });

    it('retorna vacío para otros números', () => {
      expect(getCardType('3123')).toBe('');
    });
  });
});
