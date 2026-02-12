/**
 * @file formatters.ts
 * @description Funciones de dominio para el formateo de datos de tarjetas de crédito.
 * @architecture Domain Layer - Checkout Feature
 */

/**
 * Formatea el número de tarjeta añadiendo espacios cada 4 dígitos.
 * @param {string} value - El valor sin formato.
 * @returns {string} Número formateado (ej. "1234 5678").
 */
export const formatCardNumber = (value: string): string => {
    return value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
};

/**
 * Formatea la fecha de expiración añadiendo una barra.
 * @param {string} value - El valor sin formato.
 * @returns {string} Fecha formateada (MM/YY).
 */
export const formatExpiryDate = (value: string): string => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})$/, "$1/")
        .replace(/^(\d{2})\/(\d{2}).*$/, "$1/$2")
        .substring(0, 5);
};

/**
 * Determina el tipo de tarjeta (Visa/Mastercard) basado en el prefijo.
 * @param {string} cardNumber - El número de tarjeta.
 * @returns {'visa' | 'mastercard' | ''} El tipo de tarjeta detectado.
 */
export const getCardType = (cardNumber: string): "visa" | "mastercard" | "" => {
    if (cardNumber.startsWith("4")) {
        return "visa";
    } else if (cardNumber.startsWith("5")) {
        return "mastercard";
    }
    return "";
};
