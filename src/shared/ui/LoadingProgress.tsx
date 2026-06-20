import { useState, useEffect, useRef } from 'react'
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const prevIsLoadingRef = useRef(isLoading)

  // Sincronizar estado de forma inline durante el renderizado cuando cambia el prop isLoading a false
  if (isLoading !== prevIsLoadingRef.current) {
    prevIsLoadingRef.current = isLoading
    if (!isLoading) {
      setProgress(0)
      setIsVisible(false)
    }
  }

  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), 100)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
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
