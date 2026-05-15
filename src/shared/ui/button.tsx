import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { useLogLifecycle } from "@/shared/hooks";

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
        useLogLifecycle("Button");
        const Comp = asChild ? Slot : "button";

        // Mapeo de estilos base y variantes (Tailwind Puro)
        const baseStyles =
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

        const variants = {
            default:
                "bg-primary text-primary-foreground hover:opacity-90 shadow-soft",
            destructive:
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline:
                "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
            secondary:
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
            link: "text-primary underline-offset-4 hover:underline",
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
