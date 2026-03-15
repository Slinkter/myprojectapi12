import { Button } from "@/components/ui/button";
import { useLogLifecycle } from "@/shared/hooks";

interface CartFooterProps {
  totalPrice: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

export const CartFooter = ({
  totalPrice,
  onCheckout,
  onClearCart,
}: CartFooterProps) => {
  useLogLifecycle("CartFooter");
  return (
    <div className="border-t border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground">Total</span>
        <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onCheckout} className="w-full">
          Proceder al Pago
        </Button>
        <Button 
          variant="outline" 
          onClick={onClearCart}
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          Vaciar Carrito
        </Button>
      </div>
    </div>
  );
};
