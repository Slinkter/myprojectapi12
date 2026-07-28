/**
 * @file CheckoutSteps.tsx
 * @description Indicador visual de pasos del proceso de checkout.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { Check } from 'lucide-react';
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

/**
 * @interface ICheckoutStepsProps
 * @description Propiedades del componente CheckoutSteps.
 */
export interface ICheckoutStepsProps {
  /** Lista de nombres de los pasos */
  steps: string[];
  /** Índice del paso actual (0-based) */
  currentStep: number;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente que muestra una barra de progreso visual con los pasos del checkout.
 * Los pasos completados se muestran con un check, el actual resaltado y los futuros atenuados.
 *
 * @param {ICheckoutStepsProps} props - Propiedades del componente.
 * @returns {JSX.Element} Barra de progreso de pasos.
 */
export function CheckoutSteps({ steps, currentStep, className }: ICheckoutStepsProps) {
  useLogLifecycle("CheckoutSteps");
  return (
    <nav aria-label="Pasos del proceso de pago" className={cn("flex items-center justify-center gap-2 mb-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* 44px touch target wrapper around the 32px visual circle */}
            <div
              className="flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-current={isCurrent ? "step" : undefined}
              aria-label={
                isCompleted
                  ? `${step}: completado`
                  : isCurrent
                  ? `${step}: paso actual`
                  : `${step}: pendiente`
              }
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-300",
                  isCompleted && "bg-emerald-600 text-white",
                  isCurrent && "bg-emerald-600 text-white ring-4 ring-emerald-500/20 dark:ring-emerald-500/30",
                  !isCompleted && !isCurrent && "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                )}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
            <span
              className={cn(
                "ml-2 hidden sm:inline text-sm font-semibold transition-colors",
                isCompleted && "text-emerald-600 dark:text-emerald-400",
                isCurrent && "text-slate-900 dark:text-slate-100 font-bold",
                !isCompleted && !isCurrent && "text-slate-400 dark:text-slate-500"
              )}
              aria-hidden="true"
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 w-12 h-0.5 transition-colors",
                  isCompleted ? "bg-emerald-600 dark:bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}