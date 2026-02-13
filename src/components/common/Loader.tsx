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
        <div className={cn("loader")}>
            <div className={cn("loader__spinner")}>
                <div className={cn("animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600")}></div>
            </div>
        </div>
    );
};

export default Loader;
