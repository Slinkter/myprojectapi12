/**
 * @file CartDrawer.tsx
 * @description Carrito de compras en formato drawer lateral.
 * Incluye optimizaciones UX: animaciones suaves, feedback visual, empty states mejorados.
 * @architecture Presentation Layer - Widget
 */

import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/features/cart/application/useCart'
import { cn } from '@/lib/utils'
import { CartDrawerHeader } from './CartDrawerHeader'
import { CartItemCard } from './CartItemCard'
import { CartDrawerFooter } from './CartDrawerFooter'
import { CartEmptyState } from './CartEmptyState'

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const cartRef = useRef<HTMLDivElement>(null)
  const prevLocationRef = useRef(location.pathname)

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
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

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
          <CartDrawerHeader itemCount={cart.length} onClose={closeCart} />

          <div className="flex-grow overflow-y-auto px-1 -mx-1">
            {cart.length === 0 ? (
              <CartEmptyState onContinueShopping={closeCart} />
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <CartDrawerFooter
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
            />
          )}
        </div>
      </div>
    </>
  )
}
