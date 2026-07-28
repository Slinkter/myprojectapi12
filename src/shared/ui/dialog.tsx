import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/shared/lib/cn"
import { Button } from "@/shared/ui/Button"

/** Contexto interno del diálogo. Proporciona estado de apertura y controlador. */
interface IDialogContext {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<IDialogContext | null>(null)

/** Hook para consumir el contexto del diálogo. Lanza error si se usa fuera de `<Dialog>`. */
const useDialog = () => {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog components must be used within a Dialog")
  return ctx
}

/**
 * Raíz del diálogo. Maneja el estado controlado o no controlado de apertura.
 *
 * @param children - Contenido del diálogo.
 * @param open - Control externo del estado abierto/cerrado.
 * @param onOpenChange - Callback cuando cambia el estado de apertura.
 */
const Dialog = ({ children, open: controlledOpen, onOpenChange }: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  const value = React.useMemo(() => ({ open, onOpenChange: setOpen }), [open, setOpen])

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  )
}

/** Botón que abre el diálogo al hacer clic. */
const DialogTrigger = ({ children, ...props }: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = useDialog()
  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

/** Portal que renderiza el contenido del diálogo en `document.body`. */
const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body)
}

/** Fondo semitransparente detrás del diálogo. Cierra el diálogo al hacer clic. */
const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, onOpenChange } = useDialog()
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

/** Cuerpo principal del diálogo con overlay, botón de cierre y soporte para tecla Escape. */
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = useDialog()

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl text-slate-900 dark:text-slate-100 sm:rounded-xl transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </>,
    document.body
  )
})
DialogContent.displayName = "DialogContent"

/** Encabezado del diálogo con diseño en columna centrado en móvil y alineado a la izquierda en desktop. */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

/** Pie del diálogo con acciones apiladas en móvil y en fila en desktop. */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/** Título del diálogo con estilo semibold y tracking compacto. */
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

/** Descripción del diálogo con texto secundario. */
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

/** Botón que cierra el diálogo al hacer clic. */
const DialogClose = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = useDialog()
  return (
    <button type="button" onClick={() => onOpenChange(false)} {...props}>
      {children}
    </button>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
