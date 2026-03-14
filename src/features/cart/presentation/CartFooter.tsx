import { Button } from "@/components/ui/button";

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
  return (
    <div className="border-t border-border pt-6 mt-6 space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="font-medium text-muted-foreground">
          Subtotal estimado
        </span>
        <span className="font-bold text-xl text-primary">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={onCheckout}
          variant="default"
          size="lg"
          className="w-full text-base font-bold shadow-primary/20"
        >
          Proceder al pago
        </Button>
        <Button
          onClick={onClearCart}
          variant="destructive"
          className="w-full font-semibold"
        >
          Vaciar Carrito
        </Button>
      </div>
    </div>
  );
};