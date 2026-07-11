import { useState, useRef, type MouseEvent } from 'react'
import { HiOutlineMagnifyingGlassPlus, HiOutlineMagnifyingGlassMinus, HiOutlineArrowPath } from 'react-icons/hi2'
import { cn } from '@/shared/lib/cn'
import { useLogLifecycle } from "@/shared/hooks";

interface IImageZoomProps {
  src: string
  alt: string
  className?: string
}

export function ImageZoom({ src, alt, className }: IImageZoomProps) {
  useLogLifecycle("ImageZoom");
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || zoom <= 1) return

    if (isDragging) {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }))
      dragStart.current = { x: e.clientX, y: e.clientY }
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1))
  const resetZoom = () => {
    setZoom(1)
    setPosition({ x: 50, y: 50 })
  }

  return (
    <div className={cn('relative group', className)} ref={containerRef}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Zoom de imagen. Presiona Enter o Espacio para ampliar, o arrastra con el ratón cuando esté ampliado."
        className={cn(
          'overflow-hidden cursor-zoom-in rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none',
          zoom > 1 && 'cursor-grab',
          isDragging && 'cursor-grabbing'
        )}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (zoom > 1) {
              resetZoom()
            } else {
              zoomIn()
            }
          }
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${(50 - position.x) * (zoom - 1) / 50}%, ${(50 - position.y) * (zoom - 1) / 50}%)`,
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />
      </div>

      {zoom > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
          <button
            type="button"
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Alejar"
          >
            <HiOutlineMagnifyingGlassMinus className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-medium min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Acercar"
          >
            <HiOutlineMagnifyingGlassPlus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Restablecer"
          >
            <HiOutlineArrowPath className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-white/70 bg-black/50 px-2 py-1 rounded-full">
          {zoom > 1 ? 'Arrastra para mover' : 'Click para zoom'}
        </span>
      </div>
    </div>
  )
}
