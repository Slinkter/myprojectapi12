import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface CheckoutStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function CheckoutSteps({ steps, currentStep, className }: CheckoutStepsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 mb-8', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-300',
                isCompleted && 'bg-green-600 text-white',
                isCurrent && 'bg-amber-600 text-white ring-4 ring-amber-600/20',
                isPending && 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              )}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" strokeWidth={3} />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'ml-2 text-sm font-medium hidden sm:inline',
                isCompleted && 'text-green-600',
                isCurrent && 'text-amber-600',
                isPending && 'text-slate-400'
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 sm:w-16 h-0.5 mx-2',
                  isCompleted ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
