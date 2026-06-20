import { Button } from "@/shared/ui/Button";
import { Spinner, Flex, Text } from "@radix-ui/themes";
import { LockClosedIcon } from "@radix-ui/react-icons";
import type { PaymentMethod } from "./PaymentMethodSelector";
import { useLogLifecycle } from "@/shared/hooks";

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
  useLogLifecycle("PaymentSubmitButton");
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isProcessing}
      style={{ width: "100%", height: 48 }}
      aria-label={`Pagar ahora con ${method}`}
    >
      {isProcessing ? (
        <Flex align="center" gap="2">
          <Spinner size="1" />
          <Text>Procesando...</Text>
        </Flex>
      ) : (
        <Flex align="center" gap="2">
          <Text>Pagar Ahora</Text>
          <LockClosedIcon />
        </Flex>
      )}
    </Button>
  );
};

export default PaymentSubmitButton;
