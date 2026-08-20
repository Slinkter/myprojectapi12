/**
 * @file AddToCartActions.tsx
 * @description Acciones del modal para configurar cantidad y añadir al carrito.
 * @architecture Presentation Layer - Product Component
 */

import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import QuantityControl from "./QuantityControl";
import type { StockStatus } from "@/entities/product";

/**
 * @interface AddToCartActionsProps
 * @description Propiedades del componente AddToCartActions.
 */
export interface AddToCartActionsProps {
  /** Cantidad actual seleccionada. */
  quantity: number;
  /** Stock máximo disponible del producto. */
  stock: number;
  /** Estado del stock ('ok', 'low', 'out'). */
  stockStatus: StockStatus;
  /** Callback para incrementar la cantidad. */
  onIncrement: () => void;
  /** Callback para decrementar la cantidad. */
  onDecrement: () => void;
  /** Callback para añadir el producto al carrito. */
  onAddToCart: () => void;
  /** Callback para continuar comprando (cerrar modal). */
  onContinue: () => void;
}

/**
 * Acciones del pie del modal de producto: selector de cantidad y botones de compra.
 *
 * @remarks
 * Incluye `QuantityControl` para ajustar la cantidad respetando el stock disponible,
 * botón de alta conversión y alto contraste "Añadir al Carrito" y botón secundario "Continuar Comprando".
 *
 * @component
 * @param {AddToCartActionsProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con las acciones de compra.
 */
const AddToCartActions = ({
  quantity,
  stock,
  stockStatus,
  onIncrement,
  onDecrement,
  onAddToCart,
  onContinue,
}: AddToCartActionsProps) => {
  const isOutOfStock = stockStatus === "out";

  return (
    <div className="flex flex-col gap-3.5 mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Cantidad:
          </span>
          <QuantityControl
            quantity={quantity}
            stock={stock}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </div>

        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          size="lg"
          className="flex-1 h-11 md:h-12 text-sm md:text-base font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-[box-shadow,colors,transform] cursor-pointer"
        >
          <ShoppingBag className="mr-2" size={18} />
          {isOutOfStock ? "Sin Stock" : "Añadir al Carrito"}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onContinue}
        className="w-full h-10 text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
      >
        Continuar Comprando
      </Button>
    </div>
  );
};

export default AddToCartActions;

