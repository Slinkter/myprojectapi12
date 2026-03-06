import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * Propiedades para el componente Button.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Si es true, el botón renderizará a su hijo como el componente en lugar de un elemento <button>.
     */
    asChild?: boolean;
    /** Variante del botón para definir su estilo base */
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    /** Tamaño del botón */
    size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Un componente de botón versátil construido con Radix UI Slot y Tailwind CSS puro.
 *
 * @remarks
 * Los estilos se gestionan directamente con clases de Tailwind para evitar redundancia.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            asChild = false,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : "button";

        // Mapeo de estilos base y variantes (Tailwind Puro)
        const baseStyles =
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

        const variants = {
            default:
                "bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
            destructive: 
                "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
            outline:
                "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50",
            secondary:
                "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
            ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-foreground",
            link: "text-amber-600 underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "h-11 px-6",
            sm: "h-9 px-4 text-xs",
            lg: "h-13 px-8 text-base",
            icon: "h-11 w-11",
        };

        return (
            <Comp
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button };
