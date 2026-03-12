import { ShoppingCart, Package, Truck } from 'lucide-react'
import type { CartItem } from '@/entities/cart/types/cart.types'
import { cn } from '@/shared/lib/cn'

interface OrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  className?: string
}

export function OrderSummary({ items, totalPrice, className }: OrderSummaryProps) {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const shipping = totalPrice >= 50 ? 0 : 9.99
  const finalTotal = totalPrice + shipping

  return (
    <div
      className={cn(
        'bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800',
        className
      )}
    >
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-amber-600" strokeWidth={2} />
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/50 rounded-xl"
          >
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {item.title}
              </p>
              <p className="text-xs text-slate-500">
                Cant: {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-bold text-sm text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Package className="w-4 h-4" strokeWidth={2} />
            Subtotal ({totalItems} productos)
          </span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Truck className="w-4 h-4" strokeWidth={2} />
            Envío
          </span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? (
              <span className="text-green-600">GRATIS</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
            ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
          </p>
        )}

        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-xl text-amber-600">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
