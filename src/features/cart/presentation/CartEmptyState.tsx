import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CartEmptyStateProps
 * @description Props del componente CartEmptyState.
 */
interface CartEmptyStateProps {
  /** Función para continuar comprando (cierra el drawer) */
  onContinue: () => void;
}

/**
 * @component CartEmptyState
 * @description Estado vacío del carrito de compras.
 * Muestra un icono de bolsa, mensaje informativo y botón
 * para seguir comprando.
 *
 * @param {CartEmptyStateProps} props - Propiedades del componente
 * @returns {JSX.Element} Vista de carrito vacío
 */
export const CartEmptyState = ({ onContinue }: CartEmptyStateProps) => {
  useLogLifecycle("CartEmptyState");
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <HiOutlineShoppingBag className="text-muted-foreground" size={36} />
      </div>
      <p className="text-muted-foreground font-medium text-lg">
        Tu carrito está vacío.
      </p>
      <Button 
        variant="secondary" 
        className="mt-4" 
        onClick={onContinue}
      >
        Seguir comprando
      </Button>
    </div>
  );
};
