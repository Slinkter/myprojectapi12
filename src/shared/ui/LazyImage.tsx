/**
 * @file LazyImage.tsx
 * @description Componente de imagen con blur-up effect y lazy loading.
 * Muestra un placeholder mientras la imagen carga, luego hace un transición suave.
 * @architecture Presentation Layer - UI Component
 */

import { useState, useCallback } from 'react'
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from '@/shared/lib/cn'

interface ILazyImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
  style?: React.CSSProperties
}

/**
 * @component LazyImage
 * @description Imagen con efecto blur-up: muestra un fondo difuminado mientras carga.
 * Optimiza la UX mostrando feedback inmediato.
 */
export function LazyImage({ src, alt, className, aspectRatio = 'aspect-[4/5]', style }: ILazyImageProps) {
  useLogLifecycle("LazyImage");
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setIsError(true)
    setIsLoaded(true)
  }, [])

  return (
    <div className={cn('relative overflow-hidden bg-muted/30', aspectRatio, className)} style={style}>
      {/* Placeholder con blur */}
      <div 
        className={cn(
          'absolute inset-0 bg-muted/50 transition-opacity duration-500',
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        {/* Gradient shimmer placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
      </div>

      {/* Imagen real */}
      <img
        src={isError ? '/placeholder-image.png' : src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-105'
        )}
      />

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Imagen no disponible</span>
        </div>
      )}
    </div>
  )
}

