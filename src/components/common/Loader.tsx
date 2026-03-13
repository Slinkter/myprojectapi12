/**
 * @file Loader.tsx
 * @description Indicador de carga visual (Spinner).
 * Utilizado durante peticiones asíncronas o cargas diferidas.
 * @architecture Presentation Layer - Common Components
 */
import React from "react";
import { cn } from "@/lib/utils";

/**
 * @component Loader
 * @description Un componente simple de spinner de carga.
 * 
 * @returns {JSX.Element} El spinner de carga.
 */
const Loader: React.FC = () => {
    return (
        <div className={cn(
            "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        )}>
            <div className="flex flex-col items-center gap-3">
                <div className={cn("animate-spin rounded-full h-12 w-12 border-b-2 border-primary")}></div>
                <span className="text-sm text-muted-foreground">Cargando...</span>
            </div>
        </div>
    );
};

export default Loader;
