import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30',
        outline:
          'border border-slate-200 bg-transparent shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-foreground',
        link: 'text-amber-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
