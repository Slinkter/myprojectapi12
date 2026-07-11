import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";

interface IEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  style?: React.CSSProperties
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style
}: IEmptyStateProps) {
  useLogLifecycle("EmptyState");
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center"
      style={{ minHeight: "400px", ...style }}
    >
      {icon && (
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-200/50 text-slate-500 mb-4">
          {icon}
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4" style={{ maxWidth: "320px" }}>
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
