/**
 * @file CartDrawer.tsx
 * @description Carrito de compras en formato drawer lateral.
 * Incluye optimizaciones UX: animaciones suaves, feedback visual, empty states mejorados.
 * @architecture Presentation Layer - Widget
 */

import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoClose, IoTrashOutline, IoCartOutline } from 'react-icons/io5'
import { useCart } from '@/features/cart/application/useCart'
import type { ICartItem } from '@/features/cart/domain/cartTypes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const cartRef = useRef<HTMLDivElement>(null)
  const prevLocationRef = useRef(location.pathname)

  // Cerrar drawer al cambiar de ruta
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

  // Manejar teclado
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

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={cartRef}
        tabIndex={-1}
        className={cn(
          'fixed top-0 right-0 h-full transform transition-transform duration-300 ease-out',
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2">
              <span>Mi Carrito</span>
              {cart.length > 0 && (
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="rounded-full hover:rotate-90 transition-transform duration-300"
              aria-label="Cerrar carrito de compras"
            >
              <IoClose size={20} className="text-muted-foreground" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto px-1 -mx-1">
            {cart.length === 0 ? (
              <EmptyState
                icon={<IoCartOutline className="w-10 h-10" />}
                title="Tu carrito está vacío"
                description="Añade productos para comenzar a comprar"
                actionLabel="Seguir comprando"
                onAction={closeCart}
                className="min-h-[300px]"
              />
            ) : (
              <div className="space-y-3">
                {cart.map((item: ICartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/50 transition-all duration-300 hover:border-primary/30 hover:shadow-soft animate-in fade-in slide-in-from-right-2"
                  >
                    {/* Imagen thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h6 className="font-semibold text-sm text-foreground truncate">
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

                    {/* Precio + eliminar */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-sm text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 flex items-center justify-center hover:bg-destructive/10 rounded-full transition-colors text-destructive cursor-pointer hover:scale-110 active:scale-95"
                        aria-label={`Eliminar ${item.title} del carrito`}
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-border pt-6 mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {/* Total */}
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

              {/* Botones */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCheckout}
                  variant="default"
                  size="lg"
                  className="w-full text-base font-bold shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Proceder al pago
                </Button>
                <Button
                  onClick={clearCart}
                  variant="ghost"
                  className="w-full font-semibold text-muted-foreground hover:text-destructive transition-colors"
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
