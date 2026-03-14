/**
 * @file CardForm.tsx
 * @description Formulario para ingreso de datos de tarjeta de crédito.
 * Diseño limpio y espaciado con feedback de validación claro.
 * @architecture Presentation Layer - Checkout Components
 */
import { ChangeEvent } from "react";
import {
  ICardInfo,
  IValidationErrors,
} from "@/features/checkout/application/types";
import { 
  HiOutlineCreditCard, 
  HiOutlineUser, 
  HiOutlineCalendarDays, 
  HiOutlineLockClosed,
  HiOutlineExclamationCircle
} from "react-icons/hi2";
import CardInputField from "./CardInputField";
import CardTypeIndicator from "./CardTypeIndicator";

/**
 * @interface ICardFormProps
 * @property {ICardInfo} cardInfo - Objeto con los datos de la tarjeta
 * @property {IValidationErrors} errors - Objeto con los errores de validación
 * @property {string} cardType - Tipo de tarjeta detectado para mostrar icono
 * @property {function} onChange - Handler para cambios en los inputs
 */
interface ICardFormProps {
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente de formulario para datos de tarjeta.
 * Renderiza inputs controlados para número, nombre, fecha y CVC.
 *
 * @component
 */
const CardForm = ({ cardInfo, errors, cardType, onChange }: ICardFormProps) => {
  return (
    <form
      className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
      aria-label="Información de tarjeta de crédito"
    >
      {/* Card Number */}
      <div className="relative group">
        <label
          htmlFor="card-number"
          className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest"
        >
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            id="card-number"
            placeholder="0000 0000 0000 0000"
            className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none
              focus:ring-2 focus:ring-primary/20 focus:border-primary
              border-border hover:border-border/80 font-mono tracking-wider pl-12"
            name="number"
            value={cardInfo.number}
            onChange={onChange}
            maxLength={19}
            aria-invalid={!!errors.number}
            aria-describedby={errors.number ? "card-number-error" : undefined}
            autoComplete="cc-number"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <HiOutlineCreditCard className="w-5 h-5 transition-colors group-focus-within:text-primary" />
          </div>
          <CardTypeIndicator cardType={cardType} />
        </div>
        {errors.number && (
          <p
            id="card-number-error"
            className="text-destructive text-xs mt-1.5 flex items-center gap-1.5 font-bold"
          >
            <HiOutlineExclamationCircle className="w-4 h-4" />
            {errors.number}
          </p>
        )}
      </div>

      {/* Cardholder Name */}
      <CardInputField
        label="Titular de la Tarjeta"
        name="name"
        value={cardInfo.name}
        error={errors.name}
        icon={<HiOutlineUser className="w-5 h-5 transition-colors group-focus-within:text-primary" />}
        inputProps={{
          placeholder: "NOMBRE COMPLETO",
          className: "pl-12 uppercase",
          onChange,
          autoComplete: "cc-name",
        }}
      />

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-5">
        <CardInputField
          label="Expira"
          name="expiry"
          value={cardInfo.expiry}
          error={errors.expiry}
          icon={<HiOutlineCalendarDays className="w-5 h-5 transition-colors group-focus-within:text-primary" />}
          inputProps={{
            placeholder: "MM / YY",
            className: "pl-12 font-mono",
            onChange,
            maxLength: 5,
            autoComplete: "cc-exp",
          }}
        />
        <div className="group">
          <label
            htmlFor="card-cvc"
            className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center justify-between"
          >
            CVC
            <span className="text-[9px] text-muted-foreground/70 font-medium normal-case tracking-normal">
              3-4 dígitos
            </span>
          </label>
          <div className="relative">
            <input
              id="card-cvc"
              placeholder="123"
              type="password"
              className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                border-border hover:border-border/80 font-mono pl-12"
              name="cvc"
              value={cardInfo.cvc}
              onChange={onChange}
              maxLength={4}
              aria-invalid={!!errors.cvc}
              aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
              autoComplete="cc-csc"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <HiOutlineLockClosed className="w-5 h-5 transition-colors group-focus-within:text-primary" />
            </div>
          </div>
          {errors.cvc && (
            <p
              id="card-cvc-error"
              className="text-destructive text-xs mt-1.5 flex items-center gap-1.5 font-bold"
            >
              <HiOutlineExclamationCircle className="w-4 h-4" />
              {errors.cvc}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default CardForm;
