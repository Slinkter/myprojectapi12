import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CartHeaderProps
 * @description Props del componente CartHeader.
 */
interface CartHeaderProps {
  /** Función para cerrar el drawer del carrito */
  onClose: () => void;
}

/**
 * @component CartHeader
 * @description Encabezado del drawer del carrito.
 * Muestra el título "Mi Carrito" y un botón de cierre con icono X.
 *
 * @param {CartHeaderProps} props - Propiedades del componente
 * @returns {JSX.Element} Encabezado del carrito
 */
export const CartHeader = ({ onClose }: CartHeaderProps) => {
  useLogLifecycle("CartHeader");
  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
      <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Mi Carrito</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full hover:rotate-90 h-10 w-10 transition-[transform,colors] duration-200 focus-ring"
        aria-label="Cerrar carrito"
      >
        <HiOutlineXMark size={20} />
      </Button>
    </div>
  );
};
