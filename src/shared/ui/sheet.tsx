"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/shared/lib/cn"
import { Button } from "@/shared/ui/Button"

/* ─── Context ──────────────────────────────────────── */
/** Contexto interno del sheet. Proporciona estado de apertura y controlador. */
interface ISheetContext {
  open: boolean
  onOpenChange: (v: boolean) => void
}

const SheetContext = React.createContext<ISheetContext | null>(null)

/** Hook para consumir el contexto del sheet. Lanza error si se usa fuera de `<Sheet>`. */
const useSheet = () => {
  const ctx = React.useContext(SheetContext)
  if (!ctx) throw new Error("Sheet components must be used within Sheet")
  return ctx
}

/**
 * Raíz del panel lateral (sheet). Maneja el estado controlado o no controlado de apertura.
 *
 * @param children - Contenido del sheet.
 * @param open - Control externo del estado abierto/cerrado.
 * @param onOpenChange - Callback cuando cambia el estado de apertura.
 */
const Sheet = ({ children, open: controlledOpen, onOpenChange }: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (v: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  const value = React.useMemo(() => ({ open, onOpenChange: setOpen }), [open, setOpen])

  return (
    <SheetContext.Provider value={value}>
      {children}
    </SheetContext.Provider>
  )
}

/** Botón que abre el sheet al hacer clic. */
const SheetTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
  const { onOpenChange } = useSheet()
  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

/** Botón que cierra el sheet al hacer clic. */
const SheetClose = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
  const { onOpenChange } = useSheet()
  return (
    <button type="button" onClick={() => onOpenChange(false)} {...props}>
      {children}
    </button>
  )
}

/** Portal que renderiza el contenido del sheet en `document.body`. */
const SheetPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body)
}

/** Fondo semitransparente detrás del sheet. Cierra el sheet al hacer clic. */
const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, onOpenChange } = useSheet()
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
SheetOverlay.displayName = "SheetOverlay"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white dark:bg-slate-950 p-6 shadow-xl transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-slate-200 dark:border-slate-800",
        bottom:
          "inset-x-0 bottom-0 border-t border-slate-200 dark:border-slate-800",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-slate-200 dark:border-slate-800 sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-slate-200 dark:border-slate-800 sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

/** Props del contenido del sheet, incluye variante de lado. */
interface ISheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {}

/** Panel lateral del sheet con overlay, botón de cierre y animación. Aparece desde el lado especificado. */
const SheetContent = React.forwardRef<
  HTMLDivElement,
  ISheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const { open, onOpenChange } = useSheet()

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
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </>,
    document.body
  )
})
SheetContent.displayName = "SheetContent"

/** Encabezado del sheet con diseño en columna centrado en móvil y alineado a la izquierda en desktop. */
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

/** Pie del sheet con acciones apiladas en móvil y en fila en desktop. */
const SheetFooter = ({
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
SheetFooter.displayName = "SheetFooter"

/** Título del sheet con estilo semibold. */
const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

/** Descripción del sheet con texto secundario. */
const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
