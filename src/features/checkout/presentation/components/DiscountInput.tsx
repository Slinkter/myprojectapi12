import { HiOutlineTag } from 'react-icons/hi2'
import { Button } from '@/shared/ui/Button'

interface DiscountInputProps {
  code: string
  isApplying: boolean
  error: string
  onApply: () => void
  onChange: (code: string) => void
}

export function DiscountInput({
  code,
  isApplying,
  error,
  onApply,
  onChange,
}: DiscountInputProps) {
  return (
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
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
            placeholder="Ingresa tu código"
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button
          onClick={onApply}
          disabled={!code.trim() || isApplying}
          variant="outline"
          size="sm"
        >
          {isApplying ? '...' : 'Aplicar'}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Prueba: WELCOME10, SAVE5, VIP20
      </p>
    </div>
  )
}
