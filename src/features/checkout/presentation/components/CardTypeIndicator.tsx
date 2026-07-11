/**
 * @file CardTypeIndicator.tsx
 * @description Indicador visual del tipo de tarjeta de crédito detectado (Visa/Mastercard).
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { cn } from "@/shared/lib/cn";

/**
 * @interface CardTypeIndicatorProps
 * @description Propiedades del componente CardTypeIndicator.
 */
interface CardTypeIndicatorProps {
  /** Tipo de tarjeta detectado ("visa", "mastercard" o "") */
  cardType: string;
}

/**
 * Componente que muestra un indicador visual del tipo de tarjeta.
 * Para Visa muestra el texto "VISA", para Mastercard muestra el ícono de círculos rojo y ámbar.
 *
 * @param {CardTypeIndicatorProps} props - Propiedades del componente.
 * @returns {JSX.Element} Indicador de tipo de tarjeta.
 */
const CardTypeIndicator = ({ cardType }: CardTypeIndicatorProps) => {
  return (
    <div
      role="img"
      aria-label={cardType ? `Tipo de tarjeta: ${cardType}` : undefined}
      aria-hidden={!cardType}
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300",
        cardType ? "opacity-100" : "opacity-0",
      )}
    >
      {cardType === "visa" && (
        <span aria-hidden="true" className="font-serif italic font-black text-blue-700 dark:text-blue-400 text-xl tracking-tighter">
          VISA
        </span>
      )}
      {cardType === "mastercard" && (
        <div aria-hidden="true" className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-red-500/90 shadow-sm border border-white/10"></div>
          <div className="w-6 h-6 rounded-full bg-amber-500/90 shadow-sm border border-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default CardTypeIndicator;


