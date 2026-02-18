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
                "bg-gradient-to-r from-green-600 to-green-600 text-white shadow-lg hover:from-blue-700 hover:to-blue-700 hover:shadow-xl hover:-translate-y-0.5 border-transparent",
            destructive: "bg-destructive text-white shadow-sm hover:bg-red-700",
            outline:
                "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800",
            secondary:
                "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300",
            ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
            link: "text-amber-600 underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "px-5 py-2.5",
            sm: "h-8 rounded-lg px-3 text-xs",
            lg: "h-12 rounded-xl px-10 text-base",
            icon: "h-10 w-10",
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
