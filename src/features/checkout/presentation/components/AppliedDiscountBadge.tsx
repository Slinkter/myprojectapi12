import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2'
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
    <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineCheck className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            {discount.code} (-{discount.type === 'percentage' ? `${discount.discount}%` : `$${discount.discount}`})
          </span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-success/20 rounded"
          aria-label="Eliminar descuento"
        >
          <HiOutlineXMark className="w-4 h-4 text-success" />
        </button>
      </div>
    </div>
  )
}
