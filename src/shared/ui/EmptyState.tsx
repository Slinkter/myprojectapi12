import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";

/**
 * @interface IEmptyStateProps
 * @description Propiedades del componente EmptyState para estados vacíos.
 * @property {React.ReactNode} [icon] - Icono opcional a mostrar.
 * @property {string} title - Título del estado vacío.
 * @property {string} [description] - Descripción opcional del estado.
 * @property {string} [actionLabel] - Texto del botón de acción.
 * @property {() => void} [onAction] - Callback al hacer clic en el botón.
 * @property {React.CSSProperties} [style] - Estilos adicionales.
 */
interface IEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  style?: React.CSSProperties
  className?: string
}

/**
 * @component EmptyState
 * @description Componente para representar estados vacíos en la UI.
 * Muestra un icono, título, descripción y un botón de acción opcional.
 * @param {IEmptyStateProps} props - Propiedades del componente.
 * @returns {JSX.Element} Vista de estado vacío.
 */
export const EmptyState: React.FC<IEmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
  className,
}) => {
  useLogLifecycle("EmptyState");
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center text-muted-foreground ${className ?? ''}`}
      style={style}
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
        <p className="text-sm text-muted-foreground mb-4 max-w-[320px]">
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
