/**
 * @file EmptyState.tsx
 * @description Componente reutilizable para estados vacíos con iconos y diseño mejorado.
 * @architecture Presentation Layer - UI Component
 */

import { cn } from '@/lib/utils'
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from '@/components/ui/button'

interface IEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

/**
 * @component EmptyState
 * @description Muestra un estado vacío con icono, título, descripción y acción opcional.
 * Mejora la UX con feedback visual claro.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: IEmptyStateProps) {
  useLogLifecycle("EmptyState");
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      className
    )}>
      {icon && (
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
