/**
 * @file DiscountInput.tsx
 * @description Campo de entrada para código de descuento con botón de aplicar y sugerencias rápidas.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { Tag, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from '@/shared/ui/Button';

/**
 * @interface DiscountInputProps
 * @description Propiedades del componente DiscountInput.
 */
export interface DiscountInputProps {
  /** Código de descuento ingresado por el usuario */
  code: string;
  /** Indica si se está validando el código */
  isApplying: boolean;
  /** Mensaje de error si el código es inválido */
  error: string;
  /** Callback para aplicar el código de descuento */
  onApply: () => void;
  /** Callback al cambiar el valor del input */
  onChange: (code: string) => void;
}

/** Cupones de descuento disponibles como sugerencia rápida */
const SUGGESTED_COUPONS = [
  { code: "WELCOME10", label: "10% dto" },
  { code: "SAVE5", label: "$5 dto" },
  { code: "VIP20", label: "20% dto" },
];

/**
 * Componente que renderiza un campo de texto para ingresar un código de descuento
 * con un botón para aplicar, validación con feedback visual inmediato y chips de cupones sugeridos.
 *
 * @param {DiscountInputProps} props - Propiedades del componente.
 * @returns {JSX.Element} Input de código de descuento optimizado.
 */
export function DiscountInput({
  code,
  isApplying,
  error,
  onApply,
  onChange,
}: DiscountInputProps) {
  const errorId = "discount-error";

  const handleChipClick = (couponCode: string) => {
    onChange(couponCode);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="discount-code"
        className="block text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2"
      >
        Código de descuento
      </label>

      <div className="flex gap-2">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Tag className="h-4 w-4" />
          </div>
          <input
            id="discount-code"
            type="text"
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase().trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (code.trim() && !isApplying) onApply();
              }
            }}
            placeholder="Ej: WELCOME10"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`flex h-10 w-full rounded-xl border ${
              error
                ? "border-red-500/80 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20 dark:bg-red-950/10"
                : "border-slate-200 dark:border-slate-800 bg-background focus:ring-emerald-500/20 focus:border-emerald-500"
            } pl-10 pr-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 transition-all shadow-xs`}
          />
        </div>

        <Button
          type="button"
          onClick={onApply}
          disabled={!code.trim() || isApplying}
          variant="outline"
          className="h-10 px-4 rounded-xl font-semibold shrink-0"
        >
          {isApplying ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Validando...
            </span>
          ) : (
            'Aplicar'
          )}
        </Button>
      </div>

      {error && (
        <div id={errorId} className="flex items-center gap-1.5 mt-1.5 text-red-600 dark:text-red-400 animate-in fade-in duration-200" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* Sugerencias de cupones con un solo clic */}
      <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          Sugeridos:
        </span>
        {SUGGESTED_COUPONS.map((coupon) => (
          <button
            key={coupon.code}
            type="button"
            onClick={() => handleChipClick(coupon.code)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
            title={`Usar cupón ${coupon.code}`}
          >
            <span>{coupon.code}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">({coupon.label})</span>
          </button>
        ))}
      </div>
    </div>
  );
}