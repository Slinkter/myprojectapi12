import { Check, X } from 'lucide-react'
import { useLogLifecycle } from "@/shared/hooks";

interface IDiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

interface AppliedDiscountBadgeProps {
  discount: IDiscountCode
  onRemove: () => void
}

export function AppliedDiscountBadge({ discount, onRemove }: AppliedDiscountBadgeProps) {
  useLogLifecycle("AppliedDiscountBadge");
  return (
    <div
      className="rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 mb-3 p-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          <span className="text-sm font-semibold">
            {discount.code} (-{discount.type === 'percentage' ? `${discount.discount}%` : `$${discount.discount}`})
          </span>
        </div>
         <button
          type="button"
          className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer border-none bg-transparent"
          onClick={onRemove}
          aria-label="Eliminar descuento"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}