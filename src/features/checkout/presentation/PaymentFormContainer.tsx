/**
 * @file PaymentFormContainer.tsx
 * @description Contenedor del formulario de pago que muestra el formulario de tarjeta o la opción Bitcoin.
 * @architecture Capa de Presentación - Checkout
 */

import type { ChangeEvent } from "react";
import { FaBitcoin } from "react-icons/fa";
import CardForm from "@/features/checkout/presentation/components/CardForm";
import type { PaymentMethod } from "./PaymentMethodSelector";
import type { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CardFormProps
 * @description Propiedades del formulario de tarjeta dentro del contenedor.
 */
interface CardFormProps {
  /** Datos de la tarjeta ingresados por el usuario */
  cardInfo: ICardInfo;
  /** Errores de validación del formulario */
  errors: IValidationErrors;
  /** Tipo de tarjeta detectado */
  cardType: string;
  /** Manejador de cambios en los campos */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @interface PaymentFormContainerProps
 * @description Propiedades del componente PaymentFormContainer.
 */
interface PaymentFormContainerProps {
  /** Método de pago seleccionado */
  paymentMethod: PaymentMethod;
  /** Propiedades del formulario de tarjeta */
  cardProps: CardFormProps;
}

/**
 * Componente que renderiza el formulario de tarjeta o la opción de pago con Bitcoin
 * según el método de pago seleccionado.
 *
 * @param {PaymentFormContainerProps} props - Propiedades del componente.
 * @returns {JSX.Element} Formulario de pago condicional.
 */
const PaymentFormContainer = ({ paymentMethod, cardProps }: PaymentFormContainerProps) => {
  useLogLifecycle("PaymentFormContainer");
  const showCardForm = paymentMethod === "visa" || paymentMethod === "mastercard";

  if (!showCardForm) {
    return (
      <div
        className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-center"
      >
        <FaBitcoin className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Pagar con Bitcoin</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Serás redirigido a BitPay
        </p>
      </div>
    );
  }

  return (
    <CardForm
      cardInfo={cardProps.cardInfo}
      errors={cardProps.errors}
      cardType={cardProps.cardType}
      onChange={cardProps.onChange}
    />
  );
};

export default PaymentFormContainer;