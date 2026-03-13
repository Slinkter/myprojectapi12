import { HiOutlineCheck } from 'react-icons/hi2'
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
                isCompleted && 'bg-success text-success-foreground',
                isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                isPending && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <HiOutlineCheck className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'ml-2 text-sm font-medium hidden sm:inline',
                isCompleted && 'text-success',
                isCurrent && 'text-primary',
                isPending && 'text-muted-foreground'
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 sm:w-16 h-0.5 mx-2',
                  isCompleted ? 'bg-success' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
