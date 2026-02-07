import { ChangeEvent } from "react";
import { CardInfo, ValidationErrors } from "../../application/types";

interface CardFormProps {
    cardInfo: CardInfo;
    errors: ValidationErrors;
    cardType: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CardForm = ({ cardInfo, errors, cardType, onChange }: CardFormProps) => {
    return (
        <form className="checkout-card__form" aria-label="Credit card information">
            {/* Card Number */}
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
                    onChange={onChange}
                    maxLength={19}
                    aria-invalid={!!errors.number}
                    aria-describedby={errors.number ? "card-number-error" : undefined}
                    autoComplete="cc-number"
                />
                <i
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-2xl ${cardType === "visa"
                            ? "fab fa-cc-visa"
                            : cardType === "mastercard"
                                ? "fab fa-cc-mastercard"
                                : ""
                        }`}
                    aria-hidden="true"
                />
                {errors.number && (
                    <p id="card-number-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.number}
                    </p>
                )}
            </div>

            {/* Cardholder Name */}
            <div>
                <label htmlFor="cardholder-name" className="sr-only">
                    Cardholder Name
                </label>
                <input
                    id="cardholder-name"
                    placeholder="Cardholder Name"
                    className="checkout-form-input p-3"
                    name="name"
                    value={cardInfo.name}
                    onChange={onChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cardholder-name-error" : undefined}
                    autoComplete="cc-name"
                />
                {errors.name && (
                    <p id="cardholder-name-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Expiry and CVC */}
            <div className="checkout-card__form-row">
                <div className="checkout-card__form-col--half">
                    <label htmlFor="card-expiry" className="sr-only">
                        Expiry Date (MM/YY)
                    </label>
                    <input
                        id="card-expiry"
                        placeholder="Expiry (MM/YY)"
                        className="checkout-form-input p-3"
                        name="expiry"
                        value={cardInfo.expiry}
                        onChange={onChange}
                        maxLength={5}
                        aria-invalid={!!errors.expiry}
                        aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
                        autoComplete="cc-exp"
                    />
                    {errors.expiry && (
                        <p id="card-expiry-error" className="text-red-500 text-xs mt-1" role="alert">
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
                        onChange={onChange}
                        maxLength={4}
                        aria-invalid={!!errors.cvc}
                        aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
                        autoComplete="cc-csc"
                    />
                    {errors.cvc && (
                        <p id="card-cvc-error" className="text-red-500 text-xs mt-1" role="alert">
                            {errors.cvc}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CardForm;
