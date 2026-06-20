import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useLogLifecycle } from "@/shared/hooks";

interface ILoadingProgressProps {
  isLoading: boolean
  className?: string
}

export function LoadingProgress({ isLoading, className }: ILoadingProgressProps) {
  useLogLifecycle("LoadingProgress");
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 100)
    } else {
      setIsVisible(false)
      setProgress(0)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-0 left-0 right-0 z-[9999] pointer-events-none ${className || ''}`}
        >
          <div className="shadow-lg">
            <div className="h-1 w-full bg-muted">
              <m.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>
            <div className="bg-primary text-primary-foreground text-xs font-medium py-1 text-center">
              Cargando productos...
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
