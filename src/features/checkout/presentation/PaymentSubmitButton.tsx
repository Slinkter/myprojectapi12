import { Button } from "@/shared/ui/Button";
import { Loader2, Lock } from "lucide-react";
import type { PaymentMethod } from "./PaymentMethodSelector";
import { useLogLifecycle } from "@/shared/hooks";

interface PaymentSubmitButtonProps {
  isDisabled: boolean;
  isProcessing: boolean;
  method: PaymentMethod;
}

const PaymentSubmitButton = ({
  isDisabled,
  isProcessing,
  method,
}: PaymentSubmitButtonProps) => {
  useLogLifecycle("PaymentSubmitButton");
  return (
    <Button
      type="submit"
      disabled={isDisabled || isProcessing}
      className="w-full h-12 rounded-xl font-bold shadow-[0_4px_12px_rgba(5,150,105,0.15)]"
      aria-label={`Pagar ahora con ${method}`}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Procesando...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>Pagar Ahora</span>
          <Lock className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
};

export default PaymentSubmitButton;