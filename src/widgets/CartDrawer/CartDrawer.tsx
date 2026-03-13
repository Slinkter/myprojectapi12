import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoClose, IoTrashOutline } from 'react-icons/io5'
import { useCart } from '@/features/cart/application/useCart'
import type { ICartItem } from '@/features/cart/domain/cartTypes'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const cartRef = useRef<HTMLDivElement>(null)
  const prevLocationRef = useRef(location.pathname)

  // Close drawer on route change - only when actually navigating away
  useEffect(() => {
    if (prevLocationRef.current !== location.pathname && isCartOpen) {
      prevLocationRef.current = location.pathname
      closeCart()
    }
  }, [location.pathname, isCartOpen, closeCart])

  const handleCheckout = useCallback(() => {
    closeCart()
    navigate('/checkout')
  }, [closeCart, navigate])

  useEffect(() => {
    if (!isCartOpen) return

    cartRef.current?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isCartOpen, closeCart])

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        ref={cartRef}
        tabIndex={-1}
        className={cn(
          'fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out',
          isCartOpen
            ? 'translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.15)]'
            : 'translate-x-full',
          'w-full sm:max-w-md z-50'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!isCartOpen}
      >
        <div className="h-full flex flex-col p-6 bg-card border-l border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-xl sm:text-2xl text-foreground">
              Mi Carrito
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="rounded-full hover:rotate-90"
              aria-label="Cerrar carrito de compras"
            >
              <IoClose size={20} className="text-muted-foreground" />
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto px-1 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <IoClose className="text-muted-foreground" size={28} />
                </div>
                <p className="text-muted-foreground font-medium">
                  Tu carrito está vacío.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={closeCart}
                >
                  Seguir comprando
                </Button>
              </div>
            ) : (
              cart.map((item: ICartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background/50 transition-all hover:border-primary/50"
                  >
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-sm sm:text-base text-foreground truncate">
                      {item.title}
                    </h6>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium">
                        Cant: {item.quantity}
                      </span>
                      <span className="text-xs text-primary font-bold">
                        ${item.price.toFixed(2)} c/u
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-sm sm:text-base text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-destructive/10 rounded-full transition-colors text-destructive cursor-pointer"
                      aria-label={`Eliminar ${item.title} del carrito`}
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
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
                  onClick={handleCheckout}
                  variant="default"
                  size="lg"
                  className="w-full text-base font-bold shadow-primary/20"
                >
                  Proceder al pago
                </Button>
                <Button
                  onClick={clearCart}
                  variant="destructive"
                  className="w-full font-semibold"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
