/**
 * @file HomeHeader.tsx
 * @description Cabecera principal de la página de inicio con estilo neumórfico.
 * @architecture Presentation Layer - UI Component
 */

import React from 'react'
import { Button } from '@/shared/ui/Button'

/**
 * Componente que muestra el título y subtítulo de la tienda.
 * @returns {JSX.Element} El componente renderizado.
 */
const HomeHeader: React.FC = () => {
  return (
    <div className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden mb-12 rounded-[2rem] bg-card border border-border shadow-premium">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[80%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[80%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="h-[1px] w-8 bg-accent-foreground/40" />
          <span className="text-accent-foreground text-[10px] uppercase tracking-[0.5em] font-bold">The New Era of Catalog</span>
          <div className="h-[1px] w-8 bg-accent-foreground/40" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter text-foreground animate-fade-in-up leading-[0.9]">
          Modern <span className="text-primary italic">Twelve</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/40">Collections.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          Discover a meticulously curated selection of world-class products, designed for those who appreciate the <span className="text-foreground font-medium">art of refined living</span>.
        </p>

        <div className="flex items-center gap-4 mt-4 animate-fade-in-up">
          {/* Botón primario — usa el sistema Button para accesibilidad y coherencia */}
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
          >
            Explorar Ahora
          </Button>
          {/* Botón outline — misma variante que "Ver detalles" en las cards */}
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            Saber Más
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader

