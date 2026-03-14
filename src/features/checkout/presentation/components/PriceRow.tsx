import { HiOutlineTruck } from 'react-icons/hi2'

interface PriceRowProps {
  label: React.ReactNode
  value: React.ReactNode
  variant?: 'default' | 'success' | 'highlight'
}

export function PriceRow({ label, value, variant = 'default' }: PriceRowProps) {
  const variantClasses = {
    default: '',
    success: 'text-success',
    highlight: 'pt-2 border-t border-border font-bold text-xl text-primary',
  }

  return (
    <div className={`flex justify-between text-sm ${variantClasses[variant]}`}>
      <span className="text-muted-foreground flex items-center gap-2">
        <HiOutlineTruck className="w-4 h-4" />
        {label}
      </span>
      <span className={variant === 'success' ? 'font-medium text-success' : 'font-medium'}>
        {value}
      </span>
    </div>
  )
}
