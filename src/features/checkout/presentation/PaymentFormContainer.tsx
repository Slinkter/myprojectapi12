import type { ChangeEvent } from "react";
import { FaBitcoin } from "react-icons/fa";
import { Flex, Heading, Text } from "@radix-ui/themes";
import CardForm from "@/features/checkout/presentation/components/CardForm";
import type { PaymentMethod } from "./PaymentMethodSelector";
import type { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { useLogLifecycle } from "@/shared/hooks";

interface CardFormProps {
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface PaymentFormContainerProps {
  paymentMethod: PaymentMethod;
  cardProps: CardFormProps;
}

const PaymentFormContainer = ({ paymentMethod, cardProps }: PaymentFormContainerProps) => {
  useLogLifecycle("PaymentFormContainer");
  const showCardForm = paymentMethod === "visa" || paymentMethod === "mastercard";

  if (!showCardForm) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        py="6"
        style={{
          backgroundColor: "var(--gray-2)",
          borderRadius: "var(--radius-3)",
          textAlign: "center",
        }}
      >
        <FaBitcoin style={{ width: 40, height: 40, color: "var(--orange-9)", marginBottom: "var(--space-3)" }} />
        <Heading size="3" weight="medium">Pagar con Bitcoin</Heading>
        <Text size="2" color="gray" mt="1" as="p">
          Serás redirigido a BitPay
        </Text>
      </Flex>
    );
  }

  return (
    <CardForm
      cardInfo={cardProps.cardInfo}
      errors={cardProps.errors}
      cardType={cardProps.cardType}
      onChange={cardProps.onChange}
    />
  );
};

export default PaymentFormContainer;
