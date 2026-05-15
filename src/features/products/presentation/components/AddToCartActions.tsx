import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import QuantityControl from "@/features/products/presentation/components/QuantityControl";
import { StockStatus } from "@/shared/lib/stockUtils";

interface AddToCartActionsProps {
  quantity: number;
  stock: number;
  stockStatus: StockStatus;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  onContinue: () => void;
}

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
          className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 group"
        >
          <HiOutlineShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
          Añadir al Carrito
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onContinue}
        className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground"
      >
        Continuar Comprando
      </Button>
    </div>
  );
};

export default AddToCartActions;
