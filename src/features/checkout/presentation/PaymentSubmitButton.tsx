import { Button } from "@/components/ui/button";
import { IoArrowBack, IoShieldCheckmarkOutline, IoSync } from "react-icons/io5";
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
      className="w-full mt-10 h-14 text-lg font-bold"
      size="lg"
      aria-label={`Pagar ahora con ${method}`}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <IoSync className="w-5 h-5 animate-spin" />
          Procesando...
        </span>
      ) : method === "bitcoin" ? (
        <span className="flex items-center gap-2">
          Proceder al Pago Cripto{" "}
          <IoArrowBack className="w-5 h-5 rotate-180" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Pagar Ahora <IoShieldCheckmarkOutline className="w-5 h-5" />
        </span>
      )}
    </Button>
  );
};

export default PaymentSubmitButton;
