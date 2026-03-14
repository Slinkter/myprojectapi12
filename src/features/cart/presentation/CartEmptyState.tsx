import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

interface CartEmptyStateProps {
  onContinue: () => void;
}

export const CartEmptyState = ({ onContinue }: CartEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <HiOutlineXMark className="text-muted-foreground" size={32} />
      </div>
      <p className="text-muted-foreground font-medium">
        Tu carrito está vacío.
      </p>
      <Button variant="secondary" className="mt-4" onClick={onContinue}>
        Seguir comprando
      </Button>
    </div>
  );
};