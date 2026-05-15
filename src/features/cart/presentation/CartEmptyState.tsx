import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

interface CartEmptyStateProps {
  onContinue: () => void;
}

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
