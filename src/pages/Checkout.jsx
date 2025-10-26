import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Radio, Typography, Input } from "@material-tailwind/react";

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('visa');
    const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvc: '' });
    const [errors, setErrors] = useState({});
    const [cardType, setCardType] = useState('');
    const navigate = useNavigate();

    const validateCard = (cardInfo) => {
        const { number, name, expiry, cvc } = cardInfo;
        const newErrors = {};

        // Card number validation (Luhn algorithm)
        let sum = 0;
        let shouldDouble = false;
        for (let i = number.replace(/\s/g, '').length - 1; i >= 0; i--) {
            let digit = parseInt(number.replace(/\s/g, '').charAt(i));

            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }
        if (sum % 10 !== 0) {
            newErrors.number = 'Invalid card number';
        }

        if (number.startsWith('4')) {
            setCardType('visa');
        } else if (number.startsWith('5')) {
            setCardType('mastercard');
        } else {
            setCardType('');
        }

        // Name validation
        if (!name) {
            newErrors.name = 'Name is required';
        }

        // Expiry validation
        if (!expiry) {
            newErrors.expiry = 'Expiry date is required';
        } else {
            const [month, year] = expiry.split('/');
            const expiryDate = new Date(`20${year}`, month - 1);
            if (expiryDate < new Date()) {
                newErrors.expiry = 'Card has expired';
            }
        }

        // CVC validation
        if (!cvc) {
            newErrors.cvc = 'CVC is required';
        } else if (cvc.length < 3) {
            newErrors.cvc = 'CVC must be at least 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (paymentMethod === 'bitcoin') {
            setErrors({});
        } else {
            validateCard(cardInfo);
        }
    }, [paymentMethod, cardInfo]);

    const handlePayment = () => {
        if (validateCard(cardInfo)) {
            navigate('/checkout-success');
        }
    };

    const handleCardInfoChange = (e) => {
        let { name, value } = e.target;
        if (name === 'number') {
            value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        }
        if (name === 'expiry') {
            value = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim();
        }
        setCardInfo({ ...cardInfo, [name]: value });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md p-8">
                <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
                    Choose a payment method
                </Typography>
                <div className="flex flex-col space-y-4">
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
                    <div className="mt-8 flex flex-col space-y-4">
                        <div>
                            <Input label="Card Number" name="number" value={cardInfo.number} onChange={handleCardInfoChange} maxLength={19} error={!!errors.number} icon={cardType === 'visa' ? <i className="fab fa-cc-visa" /> : cardType === 'mastercard' ? <i className="fab fa-cc-mastercard" /> : null} />
                            {errors.number && <Typography color="red" variant="small">{errors.number}</Typography>}
                        </div>
                        <div>
                            <Input label="Cardholder Name" name="name" value={cardInfo.name} onChange={handleCardInfoChange} error={!!errors.name} />
                            {errors.name && <Typography color="red" variant="small">{errors.name}</Typography>}
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <Input label="Expiry (MM/YY)" name="expiry" value={cardInfo.expiry} onChange={handleCardInfoChange} maxLength={5} error={!!errors.expiry} />
                                {errors.expiry && <Typography color="red" variant="small">{errors.expiry}</Typography>}
                            </div>
                            <div className="w-1/2">
                                <Input label="CVC" name="cvc" value={cardInfo.cvc} onChange={handleCardInfoChange} maxLength={4} error={!!errors.cvc} />
                                {errors.cvc && <Typography color="red" variant="small">{errors.cvc}</Typography>}
                            </div>
                        </div>
                    </div>
                )}
                <Button onClick={handlePayment} variant="gradient" color="green" className="mt-8 w-full" disabled={Object.keys(errors).length > 0}>
                    Pay Now
                </Button>
            </Card>
        </div>
    );
};

export default Checkout;
