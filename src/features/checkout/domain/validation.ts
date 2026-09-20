/**
 * @file validation.ts
 * @description Funciones puras de validación de negocio para tarjetas de crédito y expiración.
 * @architecture Domain Layer - Card Validation
 */

import type {
  ICardInfo,
  IValidationErrors,
} from "@/features/checkout/domain/types";

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn simplificado.
 * @param {string} cardNumber - Número de tarjeta limpio (sin espacios).
 * @returns {boolean} True si es válido.
 */
export const isValidLuhn = (cardNumber: string): boolean => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return cardNumber.length > 0 && sum % 10 === 0;
};

/**
 * Valida la fecha de expiración (formato MM/YY y que no haya expirado).
 * @param {string} expiry - Fecha en formato MM/YY.
 * @returns {string | null} Mensaje de error o null si es válida.
 */
export const validateExpiry = (expiry: string): string | null => {
  if (!expiry) return "La fecha de expiración es requerida";

  const [monthStr, yearStr] = expiry.split("/");
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);

  if (
    isNaN(month) ||
    isNaN(year) ||
    month < 1 ||
    month > 12 ||
    !yearStr ||
    yearStr.length !== 2
  ) {
    return "Formato de fecha inválido (MM/YY)";
  }

  const fullYear = 2000 + year;
  const expiryDate = new Date(fullYear, month, 0);
  expiryDate.setHours(23, 59, 59, 999);

  const now = new Date();

  if (expiryDate < now) {
    return "La tarjeta ha expirado";
  }

  return null;
};

/**
 * Valida toda la información de la tarjeta de crédito.
 * @param {ICardInfo} cardInfo - El objeto con la información de la tarjeta.
 * @returns {IValidationErrors} Un objeto que contiene mensajes de error para cada campo inválido.
 */
export const validateCardInfo = (cardInfo: ICardInfo): IValidationErrors => {
  const { number, name, expiry, cvc } = cardInfo;
  const errors: IValidationErrors = {};
  const sanitizedCardNumber = number.replace(/\s/g, "");

  if (!sanitizedCardNumber) {
    errors.number = "El número de tarjeta es requerido";
  } else if (!isValidLuhn(sanitizedCardNumber)) {
    errors.number = "Número de tarjeta inválido";
  }

  if (!name.trim()) {
    errors.name = "El nombre es requerido";
  }

  const expiryError = validateExpiry(expiry);
  if (expiryError) {
    errors.expiry = expiryError;
  }

  if (!cvc) {
    errors.cvc = "El CVC es requerido";
  } else if (cvc.length < 3) {
    errors.cvc = "El CVC debe tener al menos 3 dígitos";
  }

  return errors;
};
