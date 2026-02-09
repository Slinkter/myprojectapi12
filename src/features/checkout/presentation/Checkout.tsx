/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Orquesta la selección del método de pago y el formulario de tarjeta.
 * @architecture Presentation Layer - Checkout Feature
 */
import { useCheckout } from "../application/useCheckout";
import PaymentMethodRadio from "./components/PaymentMethodRadio";
import CardForm from "./components/CardForm";
import clsx from 'clsx';

/**
 * Componente contenedor para la vista de Checkout.
 * Utiliza el hook useCheckout para manejar la lógica de negocio.
 *
 * @component
 */
const Checkout = () => {
    const {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handleCardInfoChange,
        setPaymentMethod,
        isPaymentDisabled,
    } = useCheckout();

    const showCardForm =
        paymentMethod === "visa" || paymentMethod === "mastercard";

    return (
        <main
            className={clsx("checkout-page")}
            role="main"
            aria-labelledby="checkout-title"
        >
            <div className={clsx("checkout-card")}>
                <h4
                    id="checkout-title"
                    className={clsx("checkout-card__title text-2xl font-bold")}
                >
                    Choose a payment method
                </h4>

                <fieldset className={clsx("checkout-card__payment-methods")}>
                    <legend className={clsx("sr-only")}>
                        Payment method selection
                    </legend>

                    <PaymentMethodRadio
                        id="visa"
                        label="Visa"
                        checked={paymentMethod === "visa"}
                        onChange={() => setPaymentMethod("visa")}
                    />

                    <PaymentMethodRadio
                        id="mastercard"
                        label="Mastercard"
                        checked={paymentMethod === "mastercard"}
                        onChange={() => setPaymentMethod("mastercard")}
                    />

                    <PaymentMethodRadio
                        id="bitcoin"
                        label="Bitcoin"
                        checked={paymentMethod === "bitcoin"}
                        onChange={() => setPaymentMethod("bitcoin")}
                    />
                </fieldset>

                {showCardForm && (
                    <CardForm
                        cardInfo={cardInfo}
                        errors={errors}
                        cardType={cardType}
                        onChange={handleCardInfoChange}
                    />
                )}

                <button
                    onClick={handlePayment}
                    className={clsx(
                        "checkout-pay-button checkout-card__pay-button bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                        {
                            "disabled:opacity-50 disabled:cursor-not-allowed": isPaymentDisabled
                        }
                    )}
                    disabled={isPaymentDisabled}
                    aria-label={`Pay now with ${paymentMethod}`}
                    aria-disabled={isPaymentDisabled}
                >
                    Pay Now
                </button>
            </div>
        </main>
    );
};

export default Checkout;
