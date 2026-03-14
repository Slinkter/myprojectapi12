import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  onClose: () => void;
}

export const CartHeader = ({ onClose }: CartHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="font-bold text-xl sm:text-2xl text-foreground">
        Mi Carrito
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full hover:rotate-90"
        aria-label="Cerrar carrito de compras"
      >
        <HiOutlineXMark size={24} className="text-muted-foreground" />
      </Button>
    </div>
  );
};