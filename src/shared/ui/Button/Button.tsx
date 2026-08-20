import { forwardRef } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

/** Variantes de estilo y tamaño para el botón. */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary-hover text-white shadow-sm border border-transparent active:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent dark:bg-red-600 dark:hover:bg-red-700",
        outline: "border border-slate-200/90 dark:border-slate-800 bg-background hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-700",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border border-transparent",
        ghost: "hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-transparent",
        link: "text-primary hover:text-primary-hover underline-offset-4 hover:underline border border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
        iconSm: "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/** Props del botón. Hereda atributos HTML de botón y variantes de estilo/tamaño. */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/** Botón reutilizable con variantes de estilo (default, destructive, outline, secondary, ghost, link) y tamaños. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
