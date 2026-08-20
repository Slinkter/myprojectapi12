/**
 * @file CardForm.tsx
 * @description Formulario completo de datos de tarjeta de crédito con formateo inteligente y validación.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { ChangeEvent } from "react";
import { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { User, Calendar, Lock } from "lucide-react";
import { HiOutlineCreditCard } from "react-icons/hi2";
import CardInputField from "./CardInputField";
import CardTypeIndicator from "./CardTypeIndicator";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface ICardFormProps
 * @description Propiedades del componente CardForm.
 */
export interface ICardFormProps {
  /** Datos actuales de la tarjeta */
  cardInfo: ICardInfo;
  /** Errores de validación del formulario */
  errors: IValidationErrors;
  /** Tipo de tarjeta detectado para el indicador visual */
  cardType: string;
  /** Manejador de cambios en los campos del formulario */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente que renderiza el formulario completo de datos de tarjeta:
 * número con formateo automático (4-4-4-4) y detección de marca, titular, vencimiento (MM/AA) y CVC con alternancia de visibilidad.
 *
 * @param {ICardFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} Formulario de tarjeta de crédito.
 */
const CardForm = ({ cardInfo, errors, cardType, onChange }: ICardFormProps) => {
  useLogLifecycle("CardForm");

  return (
    <div className="flex flex-col gap-4">
      {/* Número de tarjeta con auto-spacing y detección inmediata de marca */}
      <CardInputField
        label="Número de tarjeta"
        name="number"
        value={cardInfo.number}
        error={errors.number}
        icon={<HiOutlineCreditCard className="h-5 w-5" />}
        rightSlot={<CardTypeIndicator cardType={cardType} />}
        inputProps={{
          placeholder: "1234 5678 9012 3456",
          maxLength: 19,
          inputMode: "numeric",
          autoComplete: "cc-number",
          onChange,
        }}
      />

      {/* Nombre del titular de la tarjeta */}
      <CardInputField
        label="Nombre del titular"
        name="name"
        value={cardInfo.name}
        error={errors.name}
        icon={<User className="h-4 w-4" />}
        inputProps={{
          placeholder: "Juan Pérez",
          autoComplete: "cc-name",
          onChange,
        }}
      />

      {/* Vencimiento y Código de seguridad (CVC/CVV) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardInputField
          label="Vencimiento"
          name="expiry"
          value={cardInfo.expiry}
          error={errors.expiry}
          helperText="MM/AA"
          icon={<Calendar className="h-4 w-4" />}
          inputProps={{
            placeholder: "MM/AA",
            maxLength: 5,
            inputMode: "numeric",
            autoComplete: "cc-exp",
            onChange,
          }}
        />

        <CardInputField
          label="Código CVV / CVC"
          name="cvc"
          value={cardInfo.cvc}
          error={errors.cvc}
          helperText="3 dígitos al reverso"
          icon={<Lock className="h-4 w-4" />}
          inputProps={{
            placeholder: "•••",
            type: "password",
            maxLength: 4,
            inputMode: "numeric",
            autoComplete: "cc-csc",
            onChange,
          }}
        />
      </div>
    </div>
  );
};

export default CardForm;