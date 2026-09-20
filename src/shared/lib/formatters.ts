/**
 * @file formatters.ts
 * @description Utilidades de formateo para moneda y valores financieros.
 * @architecture Shared Layer - Financial Formatters
 */

/**
 * Formatea un valor numérico como moneda en formato USD ($X.XX).
 *
 * @param {number} amount - Monto numérico.
 * @returns {string} Cadena formateada como moneda.
 */
export const formatPrice = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
