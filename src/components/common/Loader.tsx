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
 * @description A simple loading spinner component.
 * 
 * @returns {JSX.Element} The loading spinner.
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
