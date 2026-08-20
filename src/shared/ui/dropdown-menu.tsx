"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@/shared/lib/cn"

/* ─── Context ──────────────────────────────────────── */
/** Contexto interno del menú desplegable. Comparte estado, referencia del trigger y del contenido. */
interface IDropdownContext {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
}

const DropdownContext = React.createContext<IDropdownContext | null>(null)

/** Hook para consumir el contexto del menú desplegable. */
const useDropdown = () => {
  const ctx = React.useContext(DropdownContext)
  if (!ctx) throw new Error("Dropdown components must be used within DropdownMenu")
  return ctx
}

/* ─── Root ──────────────────────────────────────────── */
/** Raíz del menú desplegable. Controla apertura/cierre y cierre al hacer clic fuera o presionar Escape. */
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const value = React.useMemo(() => ({ open, setOpen, triggerRef, contentRef }), [open])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

/* ─── Trigger ──────────────────────────────────────── */
/** Botón que abre/cierra el menú desplegable al hacer clic. */
const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdown()
  return (
    <button
      type="button"
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }
      }}
      className={className}
      onClick={() => setOpen(!open)}
      aria-haspopup="menu"
      aria-expanded={open}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

/* ─── Content ──────────────────────────────────────── */
/** Panel flotante del menú, posicionado debajo del trigger. Renderizado mediante portal. */
const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const { open, triggerRef, contentRef } = useDropdown()
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + sideOffset,
        left: rect.left,
      })
    }
  }, [open, sideOffset, triggerRef])

  if (!open) return null

  return createPortal(
    <div
      ref={(node) => {
        contentRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      }}
      style={{ top: position.top, left: position.left, position: "fixed" }}
      className={cn(
        "z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 text-slate-950 dark:text-slate-50 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

/* ─── Item ─────────────────────────────────────────── */
/** Elemento individual del menú desplegable. */
const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitem"
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

/* ─── CheckboxItem ─────────────────────────────────── */
/** Elemento del menú con casilla de verificación. Soporta modo controlado y no controlado. */
const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean; onCheckedChange?: (v: boolean) => void }
>(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(false)
  const isChecked = checked !== undefined ? checked : internalChecked
  const setChecked = onCheckedChange || setInternalChecked

  return (
    <div
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={isChecked}
      onClick={() => setChecked(!isChecked)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isChecked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
})
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

/* ─── RadioItem ────────────────────────────────────── */
/** Elemento del menú con botón de opción (radio). */
const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitemradio"
    aria-checked={checked}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current"><circle cx="4" cy="4" r="4" /></svg>}
    </span>
    {children}
  </div>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

/* ─── Label ────────────────────────────────────────── */
/** Etiqueta dentro del menú desplegable, opcionalmente con sangría. */
const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

/* ─── Separator ────────────────────────────────────── */
/** Línea separadora horizontal dentro del menú. */
const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-800", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

/* ─── Shortcut ─────────────────────────────────────── */
/** Atajo de teclado mostrado dentro de un elemento del menú. */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

/* ─── Group ────────────────────────────────────────── */
/** Agrupador visual de elementos del menú. */
const DropdownMenuGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="group" {...props}>{children}</div>
)

/* ─── Portal ────────────────────────────────────────── */
/** Portal que renderiza el contenido del menú en `document.body`. */
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body)
}

/* ─── Sub ──────────────────────────────────────────── */
/** Contexto interno para submenús anidados. */
interface IDropdownSubContext {
  open: boolean
  setOpen: (v: boolean) => void
}

const DropdownSubContext = React.createContext<IDropdownSubContext | null>(null)

/** Hook para consumir el contexto del submenú. */
const useDropdownSub = () => {
  const ctx = React.useContext(DropdownSubContext)
  if (!ctx) throw new Error("DropdownMenuSub components must be within DropdownMenuSub")
  return ctx
}

/** Raíz de un submenú anidado dentro del menú desplegable. */
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  const value = React.useMemo(() => ({ open, setOpen }), [open])
  return (
    <DropdownSubContext.Provider value={value}>
      {children}
    </DropdownSubContext.Provider>
  )
}

/** Trigger que abre/cierra un submenú anidado. */
const DropdownMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => {
  const { setOpen, open } = useDropdownSub()
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-slate-100 dark:focus:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-none bg-transparent text-left",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </button>
  )
})
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

/** Contenido del submenú anidado. */
const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useDropdownSub()
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 text-slate-950 dark:text-slate-50 shadow-lg",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

/** Grupo de elementos de tipo radio dentro del menú. */
const DropdownMenuRadioGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="radiogroup" {...props}>{children}</div>
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
