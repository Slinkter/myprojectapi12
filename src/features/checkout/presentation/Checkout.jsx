/**
 * @file Checkout
 * @architecture Capa de presentación - formulario de pago con validación de tarjeta
 * @side-effects Validación de formulario, selección de método de pago, navegación a la página de éxito
 * @perf La validación se ejecuta en cada cambio de entrada a través del hook useCheckout
 */
import { useCheckout } from "../application/useCheckout";

const Checkout = () => {
    const {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handleCardInfoChange,
        setPaymentMethod,
    } = useCheckout();

    // The 'Pay Now' button is disabled if a card payment is selected and there are validation errors.
    const isPaymentDisabled =
        paymentMethod !== "bitcoin" &&
        (Object.values(errors).some((e) => e) ||
            !cardInfo.number ||
            !cardInfo.name ||
            !cardInfo.expiry ||
            !cardInfo.cvc);

    return (
        <main
            className="checkout-page"
            role="main"
            aria-labelledby="checkout-title"
        >
            <div className="checkout-card">
                <h4
                    id="checkout-title"
                    className="checkout-card__title text-2xl font-bold"
                >
                    Choose a payment method
                </h4>
                <fieldset className="checkout-card__payment-methods">
                    <legend className="sr-only">
                        Payment method selection
                    </legend>
                    {/* Custom Radio Buttons */}
                    <div className="flex items-center">
                        <input
                            id="visa"
                            type="radio"
                            name="paymentMethod"
                            className="hidden"
                            checked={paymentMethod === "visa"}
                            onChange={() => setPaymentMethod("visa")}
                            aria-label="Pay with Visa"
                        />
                        <label
                            htmlFor="visa"
                            className={`checkout-payment-method-button w-full text-center p-3 cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 ${paymentMethod === "visa" ? "checkout-payment-method-button--pressed" : ""}`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setPaymentMethod("visa");
                                }
                            }}
                        >
                            Visa
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="mastercard"
                            type="radio"
                            name="paymentMethod"
                            className="hidden"
                            checked={paymentMethod === "mastercard"}
                            onChange={() => setPaymentMethod("mastercard")}
                            aria-label="Pay with Mastercard"
                        />
                        <label
                            htmlFor="mastercard"
                            className={`checkout-payment-method-button w-full text-center p-3 cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 ${paymentMethod === "mastercard" ? "checkout-payment-method-button--pressed" : ""}`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setPaymentMethod("mastercard");
                                }
                            }}
                        >
                            Mastercard
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="bitcoin"
                            type="radio"
                            name="paymentMethod"
                            className="hidden"
                            checked={paymentMethod === "bitcoin"}
                            onChange={() => setPaymentMethod("bitcoin")}
                            aria-label="Pay with Bitcoin"
                        />
                        <label
                            htmlFor="bitcoin"
                            className={`checkout-payment-method-button w-full text-center p-3 cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 ${paymentMethod === "bitcoin" ? "checkout-payment-method-button--pressed" : ""}`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setPaymentMethod("bitcoin");
                                }
                            }}
                        >
                            Bitcoin
                        </label>
                    </div>
                </fieldset>

                {(paymentMethod === "visa" ||
                    paymentMethod === "mastercard") && (
                    <form
                        className="checkout-card__form"
                        aria-label="Credit card information"
                    >
                        <div className="relative">
                            <label htmlFor="card-number" className="sr-only">
                                Card Number
                            </label>
                            <input
                                id="card-number"
                                placeholder="Card Number"
                                className="checkout-form-input p-3"
                                name="number"
                                value={cardInfo.number}
                                onChange={handleCardInfoChange}
                                maxLength={19}
                                aria-invalid={!!errors.number}
                                aria-describedby={
                                    errors.number
                                        ? "card-number-error"
                                        : undefined
                                }
                                autoComplete="cc-number"
                            />
                            <i
                                className={`absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${cardType === "visa" ? "fab fa-cc-visa" : cardType === "mastercard" ? "fab fa-cc-mastercard" : ""}`}
                                aria-hidden="true"
                            />
                            {errors.number && (
                                <p
                                    id="card-number-error"
                                    className="text-red-500 text-xs mt-1"
                                    role="alert"
                                >
                                    {errors.number}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="cardholder-name"
                                className="sr-only"
                            >
                                Cardholder Name
                            </label>
                            <input
                                id="cardholder-name"
                                placeholder="Cardholder Name"
                                className="checkout-form-input p-3"
                                name="name"
                                value={cardInfo.name}
                                onChange={handleCardInfoChange}
                                aria-invalid={!!errors.name}
                                aria-describedby={
                                    errors.name
                                        ? "cardholder-name-error"
                                        : undefined
                                }
                                autoComplete="cc-name"
                            />
                            {errors.name && (
                                <p
                                    id="cardholder-name-error"
                                    className="text-red-500 text-xs mt-1"
                                    role="alert"
                                >
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="checkout-card__form-row">
                            <div className="checkout-card__form-col--half">
                                <label
                                    htmlFor="card-expiry"
                                    className="sr-only"
                                >
                                    Expiry Date (MM/YY)
                                </label>
                                <input
                                    id="card-expiry"
                                    placeholder="Expiry (MM/YY)"
                                    className="checkout-form-input p-3"
                                    name="expiry"
                                    value={cardInfo.expiry}
                                    onChange={handleCardInfoChange}
                                    maxLength={5}
                                    aria-invalid={!!errors.expiry}
                                    aria-describedby={
                                        errors.expiry
                                            ? "card-expiry-error"
                                            : undefined
                                    }
                                    autoComplete="cc-exp"
                                />
                                {errors.expiry && (
                                    <p
                                        id="card-expiry-error"
                                        className="text-red-500 text-xs mt-1"
                                        role="alert"
                                    >
                                        {errors.expiry}
                                    </p>
                                )}
                            </div>
                            <div className="checkout-card__form-col--half">
                                <label htmlFor="card-cvc" className="sr-only">
                                    CVC Security Code
                                </label>
                                <input
                                    id="card-cvc"
                                    placeholder="CVC"
                                    className="checkout-form-input p-3"
                                    name="cvc"
                                    value={cardInfo.cvc}
                                    onChange={handleCardInfoChange}
                                    maxLength={4}
                                    aria-invalid={!!errors.cvc}
                                    aria-describedby={
                                        errors.cvc
                                            ? "card-cvc-error"
                                            : undefined
                                    }
                                    autoComplete="cc-csc"
                                />
                                {errors.cvc && (
                                    <p
                                        id="card-cvc-error"
                                        className="text-red-500 text-xs mt-1"
                                        role="alert"
                                    >
                                        {errors.cvc}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                )}
                <button
                    onClick={handlePayment}
                    className="checkout-pay-button checkout-card__pay-button bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
