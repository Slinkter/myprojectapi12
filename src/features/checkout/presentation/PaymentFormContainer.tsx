/**
 * @file PaymentFormContainer.tsx
 * @description Contenedor del formulario de pago que muestra el formulario de tarjeta o la opción Bitcoin.
 * @architecture Capa de Presentación - Checkout
 */

import type { ChangeEvent } from "react";
import { FaBitcoin } from "react-icons/fa";
import { ExternalLink, ShieldCheck } from "lucide-react";
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
        className="flex flex-col items-center justify-center py-8 px-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 rounded-xl text-center animate-in fade-in duration-200"
      >
        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-3 text-amber-500 shadow-inner">
          <FaBitcoin className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Pago Seguro con Criptomonedas
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Al confirmar la orden serás redirigido a la pasarela segura de BitPay para completar la transacción.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Transacción cifrada en la blockchain</span>
          <ExternalLink className="h-3 w-3 ml-0.5 opacity-60" />
        </div>
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