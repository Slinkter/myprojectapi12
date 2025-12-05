import { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCardType, validateCardInfo } from '@/utils/validation';

const initialState = {
    paymentMethod: 'visa',
    cardInfo: { number: '', name: '', expiry: '', cvc: '' },
    errors: {},
    cardType: '',
};

function checkoutReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD_VALUE':
            return {
                ...state,
                cardInfo: {
                    ...state.cardInfo,
                    [action.payload.name]: action.payload.value,
                },
            };
        case 'SET_PAYMENT_METHOD':
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.payload,
            };
        case 'SET_CARD_TYPE':
            return {
                ...state,
                cardType: action.payload,
            };
        default:
            return state;
    }
}

export const useCheckout = () => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);
    const { paymentMethod, cardInfo, errors, cardType } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentMethod === 'bitcoin') {
            dispatch({ type: 'SET_ERRORS', payload: {} });
        } else {
            const validationErrors = validateCardInfo(cardInfo);
            dispatch({ type: 'SET_ERRORS', payload: validationErrors });
        }
        const newCardType = getCardType(cardInfo.number);
        if (newCardType !== cardType) {
            dispatch({ type: 'SET_CARD_TYPE', payload: newCardType });
        }
    }, [paymentMethod, cardInfo, cardType]);

    const handlePayment = () => {
        if (paymentMethod === 'bitcoin') {
            navigate('/checkout-success');
            return;
        }
        const validationErrors = validateCardInfo(cardInfo);
        dispatch({ type: 'SET_ERRORS', payload: validationErrors });
        if (Object.keys(validationErrors).length === 0) {
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
        dispatch({ type: 'SET_FIELD_VALUE', payload: { name, value } });
    };

    const setPaymentMethod = (method) => {
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
    };

    return {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handleCardInfoChange,
        setPaymentMethod,
    };
};
