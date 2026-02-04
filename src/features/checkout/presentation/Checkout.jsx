/**
 * @file Checkout
 * @architecture Presentation layer - payment form with card validation
 * @side-effects Form validation, payment method selection, navigation to success page
 * @perf Validation runs on every input change via useCheckout hook
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
        (Object.values(errors).some(e => e) ||
            !cardInfo.number ||
            !cardInfo.name ||
            !cardInfo.expiry ||
            !cardInfo.cvc);

    return (
        <div className="checkout-page">
            <div className="neumo-card checkout-card">
                <h4 className="checkout-card__title text-2xl font-bold">
                    Choose a payment method
                </h4>
                <div className="checkout-card__payment-methods">
                    {/* Custom Radio Buttons */}
                    <div className="flex items-center">
                        <input id="visa" type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === "visa"} onChange={() => setPaymentMethod("visa")} />
                        <label htmlFor="visa" className={`neumo-button w-full text-center p-3 cursor-pointer ${paymentMethod === 'visa' ? 'neumo-button--pressed' : ''}`}>Visa</label>
                    </div>
                    <div className="flex items-center">
                        <input id="mastercard" type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === "mastercard"} onChange={() => setPaymentMethod("mastercard")} />
                        <label htmlFor="mastercard" className={`neumo-button w-full text-center p-3 cursor-pointer ${paymentMethod === 'mastercard' ? 'neumo-button--pressed' : ''}`}>Mastercard</label>
                    </div>
                    <div className="flex items-center">
                        <input id="bitcoin" type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === "bitcoin"} onChange={() => setPaymentMethod("bitcoin")} />
                        <label htmlFor="bitcoin" className={`neumo-button w-full text-center p-3 cursor-pointer ${paymentMethod === 'bitcoin' ? 'neumo-button--pressed' : ''}`}>Bitcoin</label>
                    </div>
                </div>

                {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
                    <div className="checkout-card__form">
                        <div className="relative">
                            <input
                                placeholder="Card Number"
                                className="neumo-input p-3"
                                name="number"
                                value={cardInfo.number}
                                onChange={handleCardInfoChange}
                                maxLength={19}
                            />
                            <i className={`absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${cardType === "visa" ? "fab fa-cc-visa" : cardType === "mastercard" ? "fab fa-cc-mastercard" : ""}`} />
                            {errors.number && (
                                <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                            )}
                        </div>
                        <div>
                            <input
                                placeholder="Cardholder Name"
                                className="neumo-input p-3"
                                name="name"
                                value={cardInfo.name}
                                onChange={handleCardInfoChange}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div className="checkout-card__form-row">
                            <div className="checkout-card__form-col--half">
                                <input
                                    placeholder="Expiry (MM/YY)"
                                    className="neumo-input p-3"
                                    name="expiry"
                                    value={cardInfo.expiry}
                                    onChange={handleCardInfoChange}
                                    maxLength={5}
                                />
                                {errors.expiry && (
                                    <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                                )}
                            </div>
                            <div className="checkout-card__form-col--half">
                                <input
                                    placeholder="CVC"
                                    className="neumo-input p-3"
                                    name="cvc"
                                    value={cardInfo.cvc}
                                    onChange={handleCardInfoChange}
                                    maxLength={4}
                                />
                                {errors.cvc && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={handlePayment}
                    className="neumo-button checkout-card__pay-button bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPaymentDisabled}
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default Checkout;
