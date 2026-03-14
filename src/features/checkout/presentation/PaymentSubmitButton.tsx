import { Button } from "@/components/ui/button";
import { IoShieldCheckmarkOutline, IoSync } from "react-icons/io5";
import type { PaymentMethod } from "./PaymentMethodSelector";

interface PaymentSubmitButtonProps {
  isDisabled: boolean;
  isProcessing: boolean;
  method: PaymentMethod;
  onClick: () => void;
}

const PaymentSubmitButton = ({
  isDisabled,
  isProcessing,
  method,
  onClick,
}: PaymentSubmitButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isProcessing}
      className="w-full h-12"
      aria-label={`Pagar ahora con ${method}`}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <IoSync className="w-4 h-4 animate-spin" />
          Procesando...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Pagar Ahora <IoShieldCheckmarkOutline className="w-4 h-4" />
        </span>
      )}
    </Button>
  );
};

export default PaymentSubmitButton;
