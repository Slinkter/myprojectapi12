/**
 * @file DiscountInput.tsx
 * @description Campo de entrada para código de descuento con botón de aplicar.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { Bookmark } from "lucide-react";
import { Button } from '@/shared/ui/Button';

/**
 * @interface DiscountInputProps
 * @description Propiedades del componente DiscountInput.
 */
export interface DiscountInputProps {
  /** Código de descuento ingresado por el usuario */
  code: string
  /** Indica si se está validando el código */
  isApplying: boolean
  /** Mensaje de error si el código es inválido */
  error: string
  /** Callback para aplicar el código de descuento */
  onApply: () => void
  /** Callback al cambiar el valor del input */
  onChange: (code: string) => void
}

/**
 * Componente que renderiza un campo de texto para ingresar un código de descuento
 * con un botón para aplicar, validación y mensajes de error.
 *
 * @param {DiscountInputProps} props - Propiedades del componente.
 * @returns {JSX.Element} Input de código de descuento.
 */
export function DiscountInput({
  code,
  isApplying,
  error,
  onApply,
  onChange,
}: DiscountInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor="discount-code" className="block text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
        Código de descuento
      </label>
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
            <Bookmark className="h-4 w-4" />
          </div>
          <input
            id="discount-code"
            type="text"
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
            placeholder="Ingresa tu código"
            className="flex h-9 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>
        <Button
          onClick={onApply}
          disabled={!code.trim() || isApplying}
          variant="outline"
          size="sm"
        >
          {isApplying ? '...' : 'Aplicar'}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
        Prueba: WELCOME10, SAVE5, VIP20
      </p>
    </div>
  )
}