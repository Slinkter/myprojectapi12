import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  onClose: () => void;
}

export const CartHeader = ({ onClose }: CartHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <h2 className="font-semibold text-lg">Mi Carrito</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full hover:rotate-90 h-10 w-10"
        aria-label="Cerrar carrito"
      >
        <HiOutlineXMark size={20} />
      </Button>
    </div>
  );
};
