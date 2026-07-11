import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

interface CartHeaderProps {
  onClose: () => void;
}

export const CartHeader = ({ onClose }: CartHeaderProps) => {
  useLogLifecycle("CartHeader");
  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
      <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Mi Carrito</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full hover:rotate-90 h-10 w-10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
        aria-label="Cerrar carrito"
      >
        <HiOutlineXMark size={20} />
      </Button>
    </div>
  );
};
