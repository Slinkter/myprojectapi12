/**
 * Determines the type of credit card from its number.
 * @param {string} cardNumber - The card number.
 * @returns {string} 'visa', 'mastercard', or ''.
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
 * Validates credit card information.
 * @param {object} cardInfo - The card information object.
 * @param {string} cardInfo.number - The card number.
 * @param {string} cardInfo.name - The cardholder's name.
 * @param {string} cardInfo.expiry - The expiry date in MM/YY format.
 * @param {string} cardInfo.cvc - The CVC code.
 * @returns {object} An object containing error messages for each field.
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
