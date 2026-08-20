/**
 * @file CardTypeIndicator.tsx
 * @description Indicador visual del tipo de tarjeta de crédito detectado (Visa/Mastercard).
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { CreditCard } from "lucide-react";

/**
 * @interface CardTypeIndicatorProps
 * @description Propiedades del componente CardTypeIndicator.
 */
interface CardTypeIndicatorProps {
  /** Tipo de tarjeta detectado ("visa", "mastercard" o "") */
  cardType: string;
}

/**
 * Componente que muestra un distintivo visual inmediato de la marca de la tarjeta de crédito detectada.
 *
 * @param {CardTypeIndicatorProps} props - Propiedades del componente.
 * @returns {JSX.Element} Indicador visual de tipo de tarjeta.
 */
const CardTypeIndicator = ({ cardType }: CardTypeIndicatorProps) => {
  const normalized = cardType.toLowerCase();

  return (
    <div
      role="img"
      aria-label={normalized ? `Tipo de tarjeta detectado: ${normalized}` : "Marca de tarjeta"}
      className="flex items-center justify-center transition-opacity duration-300 min-w-[36px]"
    >
      {normalized === "visa" && (
        <span
          className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-serif italic font-black text-sm tracking-tighter shadow-sm animate-in fade-in zoom-in-95 duration-200"
          aria-hidden="true"
        >
          VISA
        </span>
      )}
      {normalized === "mastercard" && (
        <div
          aria-hidden="true"
          className="flex -space-x-2 items-center px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="w-4 h-4 rounded-full bg-red-500/90 shadow-sm" />
          <div className="w-4 h-4 rounded-full bg-amber-500/90 shadow-sm opacity-90" />
        </div>
      )}
      {!normalized && (
        <CreditCard
          className="h-4 w-4 text-slate-300 dark:text-slate-600 transition-opacity"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CardTypeIndicator;


