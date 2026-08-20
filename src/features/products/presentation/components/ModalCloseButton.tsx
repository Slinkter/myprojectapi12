/**
 * @file ModalCloseButton.tsx
 * @description Botón accesible de cierre para modales de diálogo.
 * @architecture Presentation Layer - Product Component
 */

import { X } from "lucide-react";
import { Button } from "@/shared/ui/Button";

/**
 * @interface ModalCloseButtonProps
 * @description Propiedades del componente ModalCloseButton.
 */
export interface ModalCloseButtonProps {
  /** Callback ejecutado al hacer clic en el botón de cerrar. */
  onClose: () => void;
}

/**
 * Botón de cierre para modales con icono "X" y accesibilidad optimizada.
 *
 * @remarks
 * Botón circular posicionado de forma absoluta en la esquina superior derecha.
 * Incluye foco visible accesible, hover suave y etiqueta aria descriptiva.
 *
 * @component
 * @param {ModalCloseButtonProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con el botón de cierre.
 */
const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => {
  return (
    <div className="absolute top-4 right-4 z-20">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full h-9 w-9 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 backdrop-blur-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        aria-label="Cerrar modal de producto"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ModalCloseButton;

