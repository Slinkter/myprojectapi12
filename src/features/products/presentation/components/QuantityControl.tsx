/**
 * @file QuantityControl.tsx
 * @description Selector de cantidad con botones +/- reutilizable.
 * @architecture Presentation Layer - Componente de Feature
 */

import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface IQuantityControlProps
 * @description Props del componente QuantityControl.
 */
export interface IQuantityControlProps {
  /** Cantidad actual seleccionada */
  quantity: number;
  /** Stock máximo disponible del producto */
  stock: number;
  /** Callback para incrementar la cantidad */
  onIncrement: () => void;
  /** Callback para decrementar la cantidad */
  onDecrement: () => void;
}

/**
 * @component QuantityControl
 * @description Control de cantidad reutilizable con botones + y -.
 * Respeta los límites de stock (máximo) y de unidades mínimas (mínimo: 1).
 */
const QuantityControl = ({
  quantity,
  stock,
  onIncrement,
  onDecrement,
}: IQuantityControlProps) => {
  useLogLifecycle("QuantityControl");
  return (
    <div className="flex items-center justify-between bg-secondary rounded-full px-1.5 py-1.5 w-full sm:w-auto min-w-[160px]">
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity === 1}
        aria-label="Disminuir cantidad"
        className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-full bg-background shadow-sm text-foreground transition-colors hover:bg-accent active:scale-95 disabled:opacity-50"
      >
        <HiOutlineMinus className="w-5 h-5" />
      </button>
      <span className="flex-1 text-center font-bold text-lg text-foreground font-mono">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= stock}
        aria-label="Aumentar cantidad"
        className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-full bg-background shadow-sm text-foreground transition-colors hover:bg-accent active:scale-95 disabled:opacity-50"
      >
        <HiOutlinePlus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuantityControl;
