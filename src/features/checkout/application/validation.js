/**
 * @file validation
 * @architecture Capa de lógica de negocio - utilidades de validación de tarjetas (algoritmo de Luhn)
 * @side-effects Ninguno - funciones puras
 * @perf El algoritmo de Luhn se ejecuta en O(n) donde n es la longitud del número de tarjeta
 */

/**
 * Determina el tipo de tarjeta de crédito a partir de su número.
 * @param {string} cardNumber - El número de tarjeta.
 * @returns {string} 'visa', 'mastercard', o ''.
 */
export const getCardType = (cardNumber) => {
    if (cardNumber.startsWith('4')) {
        return 'visa';
    } else if (cardNumber.startsWith('5')) {
        return 'mastercard';
    }
    return '';
};

/**
 * Valida la información de la tarjeta de crédito.
 * @param {object} cardInfo - El objeto con la información de la tarjeta.
 * @param {string} cardInfo.number - El número de tarjeta.
 * @param {string} cardInfo.name - El nombre del titular de la tarjeta.
 * @param {string} cardInfo.expiry - La fecha de caducidad en formato MM/AA.
 * @param {string} cardInfo.cvc - El código CVC.
 * @returns {object} Un objeto que contiene mensajes de error para cada campo.
 */
export const validateCardInfo = (cardInfo) => {
    const { number, name, expiry, cvc } = cardInfo;
    const errors = {};
    const sanitizedCardNumber = number.replace(/\s/g, '');

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
        errors.number = 'Invalid card number';
    } else if (sanitizedCardNumber.length === 0) {
        errors.number = 'Card number is required';
    }


    // Name validation
    if (!name) {
        errors.name = 'Name is required';
    }

    // Expiry validation
    if (!expiry) {
        errors.expiry = 'Expiry date is required';
    } else {
        const [month, year] = expiry.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) {
            errors.expiry = 'Invalid date format (MM/YY)';
        } else {
            const expiryDate = new Date(`20${year}`, month - 1);
            const now = new Date();
            // Set hours to 0 to compare dates only
            expiryDate.setHours(23, 59, 59, 999);
            now.setHours(0, 0, 0, 0);
            if (expiryDate < now) {
                errors.expiry = 'Card has expired';
            }
        }
    }

    // CVC validation
    if (!cvc) {
        errors.cvc = 'CVC is required';
    } else if (cvc.length < 3) {
        errors.cvc = 'CVC must be at least 3 digits';
    }

    return errors;
};
