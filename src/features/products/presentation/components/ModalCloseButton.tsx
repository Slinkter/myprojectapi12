import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";

interface ModalCloseButtonProps {
  onClose: () => void;
}

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
