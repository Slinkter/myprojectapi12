import { useLogLifecycle } from "@/shared/hooks";

interface PriceRowProps {
  label: React.ReactNode
  value: React.ReactNode
  variant?: 'default' | 'success' | 'highlight'
}

export function PriceRow({ label, value, variant = 'default' }: PriceRowProps) {
  useLogLifecycle("PriceRow");
  const variantClasses = {
    default: '',
    success: 'text-success',
    highlight: 'pt-2 border-t border-border font-bold text-lg text-foreground',
  }

  return (
    <div className={`flex justify-between text-sm ${variantClasses[variant]}`}>
      <span className="text-muted-foreground">
        {label}
      </span>
      <span className={variant === 'success' ? 'font-medium text-success' : variant === 'highlight' ? 'font-bold text-lg' : 'font-medium'}>
        {value}
      </span>
    </div>
  )
}
