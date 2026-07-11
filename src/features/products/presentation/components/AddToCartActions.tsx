import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import QuantityControl from "@/features/products/presentation/components/QuantityControl";
import { StockStatus } from "@/shared/lib/stockUtils";

/**
 * @interface AddToCartActionsProps
 * @description Propiedades del componente AddToCartActions.
 */
interface AddToCartActionsProps {
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
  /** Callback para continuar comprando (cerrar). */
  onContinue: () => void;
}

/**
 * Acciones del pie del modal de producto: selector de cantidad y botones.
 *
 * @remarks
 * Incluye `QuantityControl` para ajustar la cantidad, un botón principal
 * "Añadir al Carrito" (deshabilitado si stockStatus es 'out') y un botón
 * secundario "Continuar Comprando".
 *
 * @component
 * @param props.quantity - Cantidad seleccionada.
 * @param props.stock - Stock máximo del producto.
 * @param props.stockStatus - Estado del stock para deshabilitar la compra.
 * @param props.onIncrement - Aumentar cantidad.
 * @param props.onDecrement - Disminuir cantidad.
 * @param props.onAddToCart - Añadir al carrito.
 * @param props.onContinue - Continuar comprando.
 * @returns Elemento JSX con las acciones del carrito.
 */
const AddToCartActions = ({
  quantity,
  stock,
  stockStatus,
  onIncrement,
  onDecrement,
  onAddToCart,
  onContinue
}: AddToCartActionsProps) => {
  return (
    <div className="mt-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <QuantityControl
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          stock={stock}
        />

        <Button
          onClick={onAddToCart}
          disabled={stockStatus === "out"}
          size="lg"
          className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
        >
          <HiOutlineShoppingBag className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform duration-300" />
          Añadir al Carrito
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onContinue}
        className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
      >
        Continuar Comprando
      </Button>
    </div>
  );
};

export default AddToCartActions;
