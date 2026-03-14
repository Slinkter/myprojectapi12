import { useState } from 'react'
import { HiOutlineShoppingBag, HiOutlineCube, HiOutlineTruck, HiOutlineTag, HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2'
import type { CartItem } from '@/entities/cart/types/cart.types'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

interface IDiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

const VALID_CODES: IDiscountCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE5', discount: 5, type: 'fixed' },
  { code: 'VIP20', discount: 20, type: 'percentage' },
]

interface IOrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  className?: string
}

export function OrderSummary({ items, totalPrice, className }: IOrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<IDiscountCode | null>(null)
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
        'bg-card rounded-2xl p-6 border border-border shadow-soft',
        className
      )}
    >
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <HiOutlineShoppingBag className="w-5 h-5 text-primary" />
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-background rounded-xl"
          >
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
              <p className="text-xs text-muted-foreground">
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
          <label htmlFor="discount-code" className="block text-xs font-medium text-muted-foreground mb-2">
            Código de descuento
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="discount-code"
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                placeholder="Ingresa tu código"
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            <p className="text-xs text-destructive mt-1">{discountError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Prueba: WELCOME10, SAVE5, VIP20
          </p>
        </div>
      )}

      {/* Descuento aplicado */}
      {appliedDiscount && (
        <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineCheck className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                {appliedDiscount.code} (-{appliedDiscount.type === 'percentage' ? `${appliedDiscount.discount}%` : `$${appliedDiscount.discount}`})
              </span>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="p-1 hover:bg-success/20 rounded"
              aria-label="Eliminar descuento"
            >
              <HiOutlineXMark className="w-4 h-4 text-success" />
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <HiOutlineCube className="w-4 h-4" />
            Subtotal ({totalItems} productos)
          </span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Descuento</span>
            <span className="font-medium">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <HiOutlineTruck className="w-4 h-4" />
            Envío
          </span>
          <span className={shipping === 0 ? 'text-success font-medium' : ''}>
            {shipping === 0 ? (
              <span className="text-success">GRATIS</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-warning bg-warning/10 p-2 rounded-lg">
            ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
          </p>
        )}

        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-xl text-primary">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
