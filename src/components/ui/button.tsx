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
                "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
            destructive: 
                "bg-error text-error-foreground hover:bg-error/90",
            outline:
                "border border-neutral-300 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
            secondary:
                "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
            ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
            link: "text-neutral-900 dark:text-neutral-100 underline-offset-4 hover:underline",
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
