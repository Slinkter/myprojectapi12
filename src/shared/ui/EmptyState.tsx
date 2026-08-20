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
 * @property {string} [className] - Clases CSS adicionales.
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
 * Muestra un icono con estilo moderno, título, descripción y un botón de acción opcional.
 * @param {IEmptyStateProps} props - Propiedades del componente.
 * @returns {JSX.Element} Vista de estado vacío estilizada y accesible.
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
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center text-muted-foreground rounded-2xl border border-dashed border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 transition-colors ${className ?? ''}`}
      style={style}
    >
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 text-primary dark:bg-emerald-500/20 mb-4 ring-1 ring-emerald-500/20 shadow-xs">
          {icon}
        </div>
      )}
      
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h2>
      
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} variant="outline" className="rounded-xl">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
