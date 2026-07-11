/**
 * @file CardInputField.tsx
 * @description Campo de entrada reutilizable para el formulario de tarjeta con icono y validación.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
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
  /** Icono decorativo a la izquierda del input */
  icon: ReactNode;
  /** Slot opcional a la derecha del input (ej. indicador de tipo de tarjeta) */
  rightSlot?: ReactNode;
  /** Propiedades adicionales para el input nativo */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Componente que renderiza un campo de formulario estilizado para datos de tarjeta,
 * con icono, validación visual, mensajes de error y slot derecho opcional.
 *
 * @param {CardInputFieldProps} props - Propiedades del componente.
 * @returns {JSX.Element} Campo de entrada de tarjeta.
 */
const CardInputField = ({
  label,
  name,
  value,
  error,
  icon,
  rightSlot,
  inputProps,
}: CardInputFieldProps) => {
  useLogLifecycle("CardInputField");
  const inputId = `card-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1"
      >
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
          {icon}
        </div>
        <input
          id={inputId}
          name={name}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            (name === "number" || name === "expiry" || name === "cvc") && "font-mono tracking-wider",
            inputProps?.className
          )}
          {...inputProps}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>

      {error && (
        <div id={errorId} className="flex gap-1 items-center mt-1 text-red-600">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="text-xs font-bold">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default CardInputField;