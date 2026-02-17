/**
 * @file CardForm.tsx
 * @description Formulario para ingreso de datos de tarjeta de crédito.
 * Diseño limpio y espaciado con feedback de validación claro.
 * @architecture Presentation Layer - Checkout Components
 */
import { ChangeEvent } from "react";
import { CardInfo, ValidationErrors } from "../../application/types";
import { cn } from "@/lib/utils";
import { CreditCard, User, Calendar, Lock, AlertCircle } from "lucide-react";

/**
 * @interface CardFormProps
 * @property {CardInfo} cardInfo - Objeto con los datos de la tarjeta
 * @property {ValidationErrors} errors - Objeto con los errores de validación
 * @property {string} cardType - Tipo de tarjeta detectado para mostrar icono
 * @property {function} onChange - Handler para cambios en los inputs
 */
interface CardFormProps {
  cardInfo: CardInfo;
  errors: ValidationErrors;
  cardType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente de formulario para datos de tarjeta.
 * Renderiza inputs controlados para número, nombre, fecha y CVC.
 *
 * @component
 */
const CardForm = ({ cardInfo, errors, cardType, onChange }: CardFormProps) => {
  // Helper para clases de input
  const inputClasses = (hasError: boolean) => {
    return `w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 transition-all duration-200 outline-none
        focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
        ${
          hasError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/10"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        }`;
  };

  return (
    <form
      className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
      aria-label="Información de tarjeta de crédito"
    >
      {/* Card Number */}
      <div className="relative group">
        <label
          htmlFor="card-number"
          className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
        >
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            id="card-number"
            placeholder="0000 0000 0000 0000"
            className={`${inputClasses(!!errors.number)} font-mono tracking-wider pl-12`}
            name="number"
            value={cardInfo.number}
            onChange={onChange}
            maxLength={19}
            aria-invalid={!!errors.number}
            aria-describedby={errors.number ? "card-number-error" : undefined}
            autoComplete="cc-number"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <CreditCard className="w-5 h-5 transition-colors group-focus-within:text-amber-500" />
          </div>

          {/* Card Type Icon Indicator */}
          <div
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300",
              cardType ? "opacity-100" : "opacity-0",
            )}
          >
            {cardType === "visa" && (
              <span className="font-serif italic font-black text-blue-700 dark:text-blue-400 text-xl tracking-tighter">
                VISA
              </span>
            )}
            {cardType === "mastercard" && (
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-500/90 shadow-sm border border-white/10"></div>
                <div className="w-6 h-6 rounded-full bg-amber-500/90 shadow-sm border border-white/10"></div>
              </div>
            )}
          </div>
        </div>
        {errors.number && (
          <p
            id="card-number-error"
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-bold"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.number}
          </p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label
          htmlFor="cardholder-name"
          className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
        >
          Titular de la Tarjeta
        </label>
        <div className="relative group">
          <input
            id="cardholder-name"
            placeholder="NOMBRE COMPLETO"
            className={`${inputClasses(!!errors.name)} pl-12 uppercase`}
            name="name"
            value={cardInfo.name}
            onChange={onChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cardholder-name-error" : undefined}
            autoComplete="cc-name"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <User className="w-5 h-5 transition-colors group-focus-within:text-amber-500" />
          </div>
        </div>
        {errors.name && (
          <p
            id="cardholder-name-error"
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-bold"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-5">
        <div className="group">
          <label
            htmlFor="card-expiry"
            className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest"
          >
            Expira
          </label>
          <div className="relative">
            <input
              id="card-expiry"
              placeholder="MM / YY"
              className={`${inputClasses(!!errors.expiry)} pl-12 font-mono`}
              name="expiry"
              value={cardInfo.expiry}
              onChange={onChange}
              maxLength={5}
              aria-invalid={!!errors.expiry}
              aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
              autoComplete="cc-exp"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Calendar className="w-5 h-5 transition-colors group-focus-within:text-amber-500" />
            </div>
          </div>
          {errors.expiry && (
            <p
              id="card-expiry-error"
              className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-bold"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.expiry}
            </p>
          )}
        </div>
        <div className="group">
          <label
            htmlFor="card-cvc"
            className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest flex items-center justify-between"
          >
            CVC
            <span className="text-[9px] text-slate-300 font-medium normal-case tracking-normal">
              3-4 dígitos
            </span>
          </label>
          <div className="relative">
            <input
              id="card-cvc"
              placeholder="123"
              type="password"
              className={`${inputClasses(!!errors.cvc)} pl-12 font-mono`}
              name="cvc"
              value={cardInfo.cvc}
              onChange={onChange}
              maxLength={4}
              aria-invalid={!!errors.cvc}
              aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
              autoComplete="cc-csc"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock className="w-5 h-5 transition-colors group-focus-within:text-amber-500" />
            </div>
          </div>
          {errors.cvc && (
            <p
              id="card-cvc-error"
              className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-bold"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.cvc}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default CardForm;
