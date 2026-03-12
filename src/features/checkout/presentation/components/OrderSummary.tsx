import { useState } from 'react'
import { HiOutlineShoppingBag, HiOutlineCube, HiOutlineTruck, HiOutlineTag, HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2'
import type { CartItem } from '@/entities/cart/types/cart.types'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

interface DiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

const VALID_CODES: DiscountCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE5', discount: 5, type: 'fixed' },
  { code: 'VIP20', discount: 20, type: 'percentage' },
]

interface OrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  className?: string
}

export function OrderSummary({ items, totalPrice, className }: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [discountError, setDiscountError] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const shipping = totalPrice >= 50 ? 0 : 9.99
  
  const discountAmount = appliedDiscount 
    ? appliedDiscount.type === 'percentage'
      ? (totalPrice * appliedDiscount.discount) / 100
      : appliedDiscount.discount
    : 0
  
  const discountedSubtotal = totalPrice - discountAmount
  const finalTotal = discountedSubtotal + shipping

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return
    
    setIsApplying(true)
    setDiscountError('')
    
    setTimeout(() => {
      const found = VALID_CODES.find(
        (c) => c.code.toUpperCase() === discountCode.toUpperCase()
      )
      
      if (found) {
        setAppliedDiscount(found)
        setDiscountCode('')
      } else {
        setDiscountError('Código de descuento inválido')
      }
      setIsApplying(false)
    }, 500)
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountError('')
  }

  return (
    <div
      className={cn(
        'bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800',
        className
      )}
    >
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <HiOutlineShoppingBag className="w-5 h-5 text-amber-600" />
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

      {/* Código de descuento */}
      {!appliedDiscount && (
        <div className="mb-4">
          <label htmlFor="discount-code" className="block text-xs font-medium text-slate-500 mb-2">
            Código de descuento
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="discount-code"
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                placeholder="Ingresa tu código"
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <Button
              onClick={handleApplyDiscount}
              disabled={!discountCode.trim() || isApplying}
              variant="outline"
              size="sm"
            >
              {isApplying ? '...' : 'Aplicar'}
            </Button>
          </div>
          {discountError && (
            <p className="text-xs text-red-500 mt-1">{discountError}</p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Prueba: WELCOME10, SAVE5, VIP20
          </p>
        </div>
      )}

      {/* Descuento aplicado */}
      {appliedDiscount && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {appliedDiscount.code} (-{appliedDiscount.type === 'percentage' ? `${appliedDiscount.discount}%` : `$${appliedDiscount.discount}`})
              </span>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
              aria-label="Eliminar descuento"
            >
              <HiOutlineXMark className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <HiOutlineCube className="w-4 h-4" />
            Subtotal ({totalItems} productos)
          </span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Descuento</span>
            <span className="font-medium">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <HiOutlineTruck className="w-4 h-4" />
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
