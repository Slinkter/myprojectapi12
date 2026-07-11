import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CartFooterProps
 * @description Props del componente CartFooter.
 */
interface CartFooterProps {
  /** Precio total del carrito */
  totalPrice: number;
  /** Función para proceder al pago */
  onCheckout: () => void;
  /** Función para vaciar el carrito */
  onClearCart: () => void;
}

/**
 * @component CartFooter
 * @description Pie del drawer del carrito con resumen de total
 * y botones de acción: proceder al pago y vaciar carrito.
 *
 * @param {CartFooterProps} props - Propiedades del componente
 * @returns {JSX.Element} Pie del carrito con total y botones
 */
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
