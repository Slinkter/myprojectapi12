import { HiOutlineXMark } from "react-icons/hi2";
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
 * Botón de cierre para modales con icono "X".
 *
 * @remarks
 * Botón circular posicionado en la esquina superior derecha.
 * Incluye icono `HiOutlineXMark` de HeroIcons y efectos de hover.
 * Accesible mediante aria-label "Cerrar modal".
 *
 * @component
 * @param props.onClose - Callback al presionar el botón.
 * @returns Elemento JSX con el botón de cierre.
 */
const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => {
  return (
    <div className="absolute top-6 right-6 z-20">
      <Button
        variant="outline"
        size="icon"
        onClick={onClose}
        className="rounded-full bg-card/80 backdrop-blur-md border-border shadow-soft group hover:border-primary/30"
        aria-label="Cerrar modal"
      >
        <HiOutlineXMark
          className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
        />
      </Button>
    </div>
  );
};

export default ModalCloseButton;
