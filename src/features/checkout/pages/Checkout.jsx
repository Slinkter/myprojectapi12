import { Button, Card, Radio, Typography, Input } from "@material-tailwind/react";
import { useCheckout } from '../hooks/useCheckout';

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

    const isPaymentDisabled = paymentMethod !== 'bitcoin' && Object.keys(errors).length > 0;

    return (
        <div className="checkout-page">
            <Card className="checkout-card">
                <Typography variant="h4" color="blue-gray" className="checkout-card__title">
                    Choose a payment method
                </Typography>
                <div className="checkout-card__payment-methods">
                    <Radio
                        id="visa"
                        name="paymentMethod"
                        label="Visa"
                        checked={paymentMethod === 'visa'}
                        onChange={() => setPaymentMethod('visa')}
                    />
                    <Radio
                        id="mastercard"
                        name="paymentMethod"
                        label="Mastercard"
                        checked={paymentMethod === 'mastercard'}
                        onChange={() => setPaymentMethod('mastercard')}
                    />
                    <Radio
                        id="bitcoin"
                        name="paymentMethod"
                        label="Bitcoin"
                        checked={paymentMethod === 'bitcoin'}
                        onChange={() => setPaymentMethod('bitcoin')}
                    />
                </div>
                {(paymentMethod === 'visa' || paymentMethod === 'mastercard') && (
                    <div className="checkout-card__form">
                        <div>
                            <Input label="Card Number" name="number" value={cardInfo.number} onChange={handleCardInfoChange} maxLength={19} error={!!errors.number} icon={cardType === 'visa' ? <i className="fab fa-cc-visa" /> : cardType === 'mastercard' ? <i className="fab fa-cc-mastercard" /> : null} />
                            {errors.number && <Typography color="red" variant="small">{errors.number}</Typography>}
                        </div>
                        <div>
                            <Input label="Cardholder Name" name="name" value={cardInfo.name} onChange={handleCardInfoChange} error={!!errors.name} />
                            {errors.name && <Typography color="red" variant="small">{errors.name}</Typography>}
                        </div>
                        <div className="checkout-card__form-row">
                            <div className="checkout-card__form-col--half">
                                <Input label="Expiry (MM/YY)" name="expiry" value={cardInfo.expiry} onChange={handleCardInfoChange} maxLength={5} error={!!errors.expiry} />
                                {errors.expiry && <Typography color="red" variant="small">{errors.expiry}</Typography>}
                            </div>
                            <div className="checkout-card__form-col--half">
                                <Input label="CVC" name="cvc" value={cardInfo.cvc} onChange={handleCardInfoChange} maxLength={4} error={!!errors.cvc} />
                                {errors.cvc && <Typography color="red" variant="small">{errors.cvc}</Typography>}
                            </div>
                        </div>
                    </div>
                )}
                <Button onClick={handlePayment} variant="gradient" color="green" className="checkout-card__pay-button" disabled={isPaymentDisabled}>
                    Pay Now
                </Button>
            </Card>
        </div>
    );
};

export default Checkout;