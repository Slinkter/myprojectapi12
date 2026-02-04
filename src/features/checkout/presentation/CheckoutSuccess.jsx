/**
 * @file CheckoutSuccess
 * @architecture Presentation layer - success page after payment
 * @side-effects None - pure UI component
 * @perf No optimization needed - static page
 */
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  return (
    <div className="checkout-success-page">
      <div className="checkout-success-card neumo-card">
        <h2 className="checkout-success-card__title text-4xl font-bold text-green-600 dark:text-green-500 mb-4">
          Payment Successful!
        </h2>
        <p className="checkout-success-card__message text-lg text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your purchase.
        </p>
        <Link to="/">
          <button className="neumo-button-primary px-8 py-3 rounded-xl font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
