/**
 * @file CheckoutSteps.tsx
 * @description Indicador visual de pasos del proceso de checkout con iconos e indicadores de estado.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { Check, ShoppingCart, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
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
 * Obtiene el icono representativo según el nombre o índice del paso.
 *
 * @param {string} stepName - Nombre del paso.
 * @param {number} index - Índice del paso.
 * @returns {JSX.Element} Icono del paso.
 */
function getStepIcon(stepName: string, index: number) {
  const normalized = stepName.toLowerCase();
  if (normalized.includes('carrit') || normalized.includes('cart')) {
    return <ShoppingCart className="h-4 w-4" />;
  }
  if (normalized.includes('enví') || normalized.includes('envio') || normalized.includes('ship')) {
    return <Truck className="h-4 w-4" />;
  }
  if (normalized.includes('pag') || normalized.includes('pay') || normalized.includes('tarjet')) {
    return <CreditCard className="h-4 w-4" />;
  }
  if (normalized.includes('confir') || normalized.includes('éxit') || normalized.includes('exito')) {
    return <CheckCircle2 className="h-4 w-4" />;
  }
  return <span className="text-xs font-bold">{index + 1}</span>;
}

/**
 * Componente que muestra una barra de progreso visual con los pasos del checkout (Carrito -> Envío -> Pago).
 * Los pasos completados se muestran con un check esmeralda, el actual con su icono activo y halo, y los futuros atenuados.
 *
 * @param {ICheckoutStepsProps} props - Propiedades del componente.
 * @returns {JSX.Element} Barra de progreso de pasos.
 */
export function CheckoutSteps({ steps, currentStep, className }: ICheckoutStepsProps) {
  useLogLifecycle("CheckoutSteps");

  return (
    <nav aria-label="Pasos del proceso de pago" className={cn("w-full py-2", className)}>
      <ol className="flex items-center justify-center max-w-xl mx-auto px-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li key={step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2.5">
                {/* Indicador circular del paso */}
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
                      "relative flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-all duration-300 shadow-sm",
                      isCompleted && "bg-emerald-600 text-white shadow-emerald-500/20",
                      isCurrent && "bg-emerald-600 text-white ring-4 ring-emerald-500/25 shadow-emerald-500/30 scale-105",
                      isUpcoming && "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                    )}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      getStepIcon(step, index)
                    )}
                  </div>
                </div>

                {/* Etiqueta de texto */}
                <div className="hidden sm:flex flex-col text-left">
                  <span
                    className={cn(
                      "text-xs uppercase tracking-wider font-semibold transition-colors",
                      isCompleted && "text-emerald-600 dark:text-emerald-400",
                      isCurrent && "text-emerald-600 dark:text-emerald-400 font-bold",
                      isUpcoming && "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    Paso {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors whitespace-nowrap",
                      isCompleted && "text-slate-700 dark:text-slate-300 font-medium",
                      isCurrent && "text-slate-900 dark:text-slate-100 font-bold",
                      isUpcoming && "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    {step}
                  </span>
                </div>
              </div>

              {/* Línea conectora entre pasos */}
              {index < steps.length - 1 && (
                <div
                  className="flex-1 mx-3 sm:mx-4 h-0.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isCompleted ? "bg-emerald-600 dark:bg-emerald-500 w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}