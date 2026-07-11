import { Check } from 'lucide-react';
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

interface ICheckoutStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function CheckoutSteps({ steps, currentStep, className }: ICheckoutStepsProps) {
  useLogLifecycle("CheckoutSteps");
  return (
    <div className={cn("flex items-center justify-center gap-2 mb-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-300",
                isCompleted && "bg-emerald-600 text-white",
                isCurrent && "bg-emerald-600 text-white ring-4 ring-emerald-500/20 dark:ring-emerald-500/30",
                !isCompleted && !isCurrent && "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "ml-2 hidden sm:inline text-sm font-semibold transition-colors",
                isCompleted && "text-emerald-600 dark:text-emerald-400",
                isCurrent && "text-slate-900 dark:text-slate-100 font-bold",
                !isCompleted && !isCurrent && "text-slate-400 dark:text-slate-500"
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 w-12 h-0.5 transition-colors",
                  isCompleted ? "bg-emerald-600 dark:bg-emerald-500" : "bg-slate-200 dark:bg-slate-850"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}