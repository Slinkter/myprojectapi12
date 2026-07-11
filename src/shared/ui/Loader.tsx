/**
 * @file Loader.tsx
 * @description Indicador de carga visual (Spinner).
 * Utilizado durante peticiones asíncronas o cargas diferidas.
 * @architecture Presentation Layer - Common Components
 */
import React from "react";
import { useLogLifecycle } from "@/shared/hooks";

interface ILoaderProps {
  text?: string;
}

/**
 * @component Loader
 * @description Un componente simple de spinner de carga.
 * 
 * @returns {JSX.Element} El spinner de carga.
 */
const Loader: React.FC<ILoaderProps> = ({ text }) => {
    useLogLifecycle("Loader");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                {text && <span className="text-sm text-muted-foreground">{text}</span>}
            </div>
        </div>
    );
};

export default Loader;
