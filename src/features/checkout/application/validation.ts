/**
 * @file validation.ts
 * @description Funciones de utilidad para validación de formularios de checkout.
 * Incluye lógica de negocio para validación de tarjetas de crédito y detección de tipo.
 * @architecture Application Layer - Checkout Validation Logic
 */

import { CardInfo, ValidationErrors } from "./types";

/**
 * Determina el tipo de tarjeta de crédito a partir de su número.
 * @param {string} cardNumber - El número de tarjeta.
 * @returns {'visa' | 'mastercard' | ''} 'visa', 'mastercard', o ''.
 */
export const getCardType = (cardNumber: string): "visa" | "mastercard" | "" => {
    if (cardNumber.startsWith("4")) {
        return "visa";
    } else if (cardNumber.startsWith("5")) {
        return "mastercard";
    }
    return "";
};

/**
 * Valida la información de la tarjeta de crédito.
 * @param {CardInfo} cardInfo - El objeto con la información de la tarjeta.
 * @returns {ValidationErrors} Un objeto que contiene mensajes de error para cada campo.
 */
export const validateCardInfo = (cardInfo: CardInfo): ValidationErrors => {
    const { number, name, expiry, cvc } = cardInfo;
    const errors: ValidationErrors = {};
    const sanitizedCardNumber = number.replace(/\s/g, "");

    // Card number validation (Luhn algorithm)
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedCardNumber.charAt(i));

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    if (sanitizedCardNumber.length > 0 && sum % 10 !== 0) {
        errors.number = "Invalid card number";
    } else if (sanitizedCardNumber.length === 0) {
        errors.number = "Card number is required";
    }

    // Name validation
    if (!name) {
        errors.name = "Name is required";
    }

    // Expiry validation
    if (!expiry) {
        errors.expiry = "Expiry date is required";
    } else {
        const [monthStr, yearStr] = expiry.split("/");
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

        if (
            isNaN(month) ||
            isNaN(year) ||
            month < 1 ||
            month > 12 ||
            yearStr.length !== 2
        ) {
            errors.expiry = "Invalid date format (MM/YY)";
        } else {
            // const currentYear = new Date().getFullYear() % 100; // Removed unused variable
            // const currentMonth = new Date().getMonth() + 1; // Removed unused variable

            // Adjust year for 2-digit format (e.g., 23 -> 2023)
            const fullYear = 2000 + year;
            const expiryDate = new Date(fullYear, month - 1); // month - 1 for 0-indexed month in Date constructor
            const now = new Date();

            // Set current date to the first day of the current month to correctly compare expiry
            now.setDate(1);
            now.setHours(0, 0, 0, 0);

            // Set expiry date to the last day of its month to consider the entire month valid
            expiryDate.setMonth(expiryDate.getMonth() + 1, 0);
            expiryDate.setHours(23, 59, 59, 999);

            if (expiryDate < now) {
                errors.expiry = "Card has expired";
            }
        }
    }

    // CVC validation
    if (!cvc) {
        errors.cvc = "CVC is required";
    } else if (cvc.length < 3) {
        errors.cvc = "CVC must be at least 3 digits";
    }

    return errors;
};
