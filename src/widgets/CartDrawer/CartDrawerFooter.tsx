import { Button } from '@/components/ui/button'

interface CartDrawerFooterProps {
  totalPrice: number
  onCheckout: () => void
  onClearCart: () => void
}

export function CartDrawerFooter({ totalPrice, onCheckout, onClearCart }: CartDrawerFooterProps) {
  return (
    <div className="border-t border-border pt-6 mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between px-2">
        <span className="font-medium text-muted-foreground">
          Total estimado
        </span>
        <div className="text-right">
          <span className="font-bold text-2xl text-foreground">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={onCheckout}
          variant="default"
          size="lg"
          className="w-full text-base font-bold shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Proceder al pago
        </Button>
        <Button
          onClick={onClearCart}
          variant="ghost"
          className="w-full font-semibold text-muted-foreground hover:text-destructive transition-colors"
        >
          Vaciar Carrito
        </Button>
      </div>
    </div>
  )
}
