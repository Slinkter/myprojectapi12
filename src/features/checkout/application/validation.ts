/**
 * @file validation.ts
 * @description Funciones de utilidad para validación de formularios de checkout.
 * Incluye lógica de negocio para validación de tarjetas de crédito y fechas.
 * @architecture Capa de Aplicación - Lógica de Validación de Checkout
 */

import { CardInfo, ValidationErrors } from "./types";

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn simplificado.
 * @param {string} cardNumber - Número de tarjeta limpio (sin espacios).
 * @returns {boolean} True si es válido.
 */
const isValidLuhn = (cardNumber: string): boolean => {
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
const validateExpiry = (expiry: string): string | null => {
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

    // Calcular fecha de expiración (último día del mes indicado)
    const fullYear = 2000 + year;
    const expiryDate = new Date(fullYear, month, 0); // Día 0 del siguiente mes es el último del actual
    expiryDate.setHours(23, 59, 59, 999);

    const now = new Date();
    
    if (expiryDate < now) {
        return "La tarjeta ha expirado";
    }

    return null;
};

/**
 * Valida toda la información de la tarjeta de crédito.
 * @param {CardInfo} cardInfo - El objeto con la información de la tarjeta.
 * @returns {ValidationErrors} Un objeto que contiene mensajes de error para cada campo inválido.
 */
export const validateCardInfo = (cardInfo: CardInfo): ValidationErrors => {
    const { number, name, expiry, cvc } = cardInfo;
    const errors: ValidationErrors = {};
    const sanitizedCardNumber = number.replace(/\s/g, "");

    // 1. Validar Número
    if (!sanitizedCardNumber) {
        errors.number = "El número de tarjeta es requerido";
    } else if (!isValidLuhn(sanitizedCardNumber)) {
        errors.number = "Número de tarjeta inválido";
    }

    // 2. Validar Nombre
    if (!name.trim()) {
        errors.name = "El nombre es requerido";
    }

    // 3. Validar Expiración
    const expiryError = validateExpiry(expiry);
    if (expiryError) {
        errors.expiry = expiryError;
    }

    // 4. Validar CVC
    if (!cvc) {
        errors.cvc = "El CVC es requerido";
    } else if (cvc.length < 3) {
        errors.cvc = "El CVC debe tener al menos 3 dígitos";
    }

    return errors;
};
