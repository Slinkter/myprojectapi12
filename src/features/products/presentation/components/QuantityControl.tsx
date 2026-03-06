/**
 * @file QuantityControl.tsx
 * @description Selector de cantidad con botones +/- reutilizable.
 * @architecture Presentation Layer - Componente de Feature
 */

/**
 * @interface IQuantityControlProps
 * @description Props del componente QuantityControl.
 */
interface IQuantityControlProps {
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
  return (
    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-full px-1.5 py-1.5 w-full sm:w-auto min-w-[160px]">
      <button
        onClick={onDecrement}
        disabled={quantity === 1}
        className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
      >
        <span className="text-xl font-medium mb-0.5">−</span>
      </button>
      <span className="flex-1 text-center font-bold text-lg text-foreground font-mono">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={quantity >= stock}
        className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
      >
        <span className="text-xl font-medium mb-0.5">+</span>
      </button>
    </div>
  );
};

export default QuantityControl;
