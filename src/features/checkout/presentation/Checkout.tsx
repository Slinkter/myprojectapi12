import { useCheckout } from "../application/useCheckout";
import PaymentMethodRadio from "./components/PaymentMethodRadio";
import CardForm from "./components/CardForm";

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

  const showCardForm = paymentMethod === "visa" || paymentMethod === "mastercard";

  return (
    <main className="checkout-page" role="main" aria-labelledby="checkout-title">
      <div className="checkout-card">
        <h4 id="checkout-title" className="checkout-card__title text-2xl font-bold">
          Choose a payment method
        </h4>

        <fieldset className="checkout-card__payment-methods">
          <legend className="sr-only">Payment method selection</legend>

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
