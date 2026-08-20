/**
 * @file CardInputField.tsx
 * @description Campo de entrada reutilizable para el formulario de tarjeta con icono, validación y soporte de máscara.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { ReactNode, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CardInputFieldProps
 * @description Propiedades del componente CardInputField.
 */
interface CardInputFieldProps {
  /** Etiqueta del campo */
  label: string;
  /** Nombre del campo (mapea a ICardInfo) */
  name: string;
  /** Valor actual del campo */
  value: string;
  /** Mensaje de error de validación */
  error?: string;
  /** Texto de ayuda opcional debajo del campo */
  helperText?: string;
  /** Icono decorativo a la izquierda del input */
  icon: ReactNode;
  /** Slot opcional a la derecha del input (ej. indicador de tipo de tarjeta) */
  rightSlot?: ReactNode;
  /** Propiedades adicionales para el input nativo */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Componente que renderiza un campo de formulario estilizado para datos de tarjeta,
 * con icono, validación visual, soporte de alternancia de máscara para CVV y slot derecho opcional.
 *
 * @param {CardInputFieldProps} props - Propiedades del componente.
 * @returns {JSX.Element} Campo de entrada de tarjeta.
 */
const CardInputField = ({
  label,
  name,
  value,
  error,
  helperText,
  icon,
  rightSlot,
  inputProps,
}: CardInputFieldProps) => {
  useLogLifecycle("CardInputField");
  const [showMaskedValue, setShowMaskedValue] = useState(false);
  const inputId = `card-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const isPasswordType = inputProps?.type === "password" || name === "cvc";
  const resolvedType = isPasswordType ? (showMaskedValue ? "text" : "password") : (inputProps?.type || "text");
  const isNumericField = name === "number" || name === "expiry" || name === "cvc";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
        {helperText && !error && (
          <span id={helperId} className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors">
          {icon}
        </div>

        <input
          id={inputId}
          name={name}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...inputProps}
          type={resolvedType}
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs",
            isNumericField && "font-mono tracking-wider tabular-nums",
            error && "border-red-500/80 dark:border-red-500/80 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20 dark:bg-red-950/10",
            (rightSlot || isPasswordType) && "pr-12",
            inputProps?.className
          )}
        />

        {/* Slot a la derecha: indicador de marca o botón para revelar/ocultar CVV */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
          {isPasswordType && value.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMaskedValue((prev) => !prev)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={showMaskedValue ? "Ocultar código de seguridad" : "Mostrar código de seguridad"}
              title={showMaskedValue ? "Ocultar CVV" : "Mostrar CVV"}
            >
              {showMaskedValue ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {rightSlot}
        </div>
      </div>

      {error && (
        <div id={errorId} className="flex gap-1.5 items-center mt-1.5 text-red-600 dark:text-red-400 animate-in fade-in duration-200" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs font-semibold">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default CardInputField;