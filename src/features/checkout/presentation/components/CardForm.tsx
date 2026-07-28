/**
 * @file CardForm.tsx
 * @description Formulario completo de datos de tarjeta de crédito.
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
 * número, titular, vencimiento y CVC con sus respectivos iconos y validaciones.
 *
 * @param {ICardFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} Formulario de tarjeta.
 */
const CardForm = ({ cardInfo, errors, cardType, onChange }: ICardFormProps) => {
  useLogLifecycle("CardForm");
  return (
    <div className="flex flex-col gap-4">
      {/* Card Number */}
      <CardInputField
        label="Número de tarjeta"
        name="number"
        value={cardInfo.number}
        error={errors.number}
        icon={<HiOutlineCreditCard />}
        rightSlot={<CardTypeIndicator cardType={cardType} />}
        inputProps={{
          placeholder: "1234 5678 9012 3456",
          maxLength: 19,
          onChange,
        }}
      />

      {/* Cardholder Name */}
      <CardInputField
        label="Nombre del titular"
        name="name"
        value={cardInfo.name}
        error={errors.name}
        icon={<User className="h-4 w-4" />}
        inputProps={{
          placeholder: "Juan Pérez",
          onChange,
        }}
      />

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-3">
        <CardInputField
          label="Vencimiento"
          name="expiry"
          value={cardInfo.expiry}
          error={errors.expiry}
          icon={<Calendar className="h-4 w-4" />}
          inputProps={{
            placeholder: "MM/YY",
            maxLength: 5,
            onChange,
          }}
        />

        <CardInputField
          label="CVC"
          name="cvc"
          value={cardInfo.cvc}
          error={errors.cvc}
          icon={<Lock className="h-4 w-4" />}
          inputProps={{
            placeholder: "123",
            type: "password",
            maxLength: 4,
            onChange,
          }}
        />
      </div>
    </div>
  );
};

export default CardForm;