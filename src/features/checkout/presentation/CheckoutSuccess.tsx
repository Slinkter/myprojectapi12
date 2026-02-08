/**
 * @file CheckoutSuccess.tsx
 * @description Página de confirmación de compra exitosa.
 * @architecture Presentation Layer - Checkout Feature
 */
import { Link } from "react-router-dom";
import React from "react";

/**
 * Componente de página de éxito.
 * Se muestra tras un pago validado correctamente.
 *
 * @component
 */
const CheckoutSuccess: React.FC = () => {
    return (
        <div className="checkout-success-page">
            <div className="checkout-success-card checkout-success-card">
                <h2 className="checkout-success-card__title text-4xl font-bold text-green-600 dark:text-green-500 mb-4">
                    Payment Successful!
                </h2>
                <p className="checkout-success-card__message text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Thank you for your purchase.
                </p>
                <Link to="/">
                    <button className="checkout-success-continue-button px-8 py-3 rounded-xl font-semibold">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
