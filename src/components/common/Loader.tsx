/**
 * @file Loader.tsx
 * @description Indicador de carga visual (Spinner).
 * Utilizado durante peticiones asíncronas o cargas diferidas.
 * @architecture Presentation Layer - Common Components
 */
import React from "react";
import clsx from 'clsx';

/**
 * Componente de spinner de carga.
 *
 * @component
 */
const Loader: React.FC = () => {
    return (
        <div className={clsx("loader")}>
            <div className={clsx("loader__spinner")}>
                <div className={clsx("animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600")}></div>
            </div>
        </div>
    );
};

export default Loader;
