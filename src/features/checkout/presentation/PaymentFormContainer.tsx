import type { ChangeEvent } from "react";
import { FaBitcoin } from "react-icons/fa";
import CardForm from "@/features/checkout/presentation/components/CardForm";
import type { PaymentMethod } from "./PaymentMethodSelector";
import type { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";

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
  const showCardForm = paymentMethod === "visa" || paymentMethod === "mastercard";

  if (!showCardForm) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-xl">
        <FaBitcoin className="w-10 h-10 text-orange-500 mb-3" />
        <h3 className="font-medium">Pagar con Bitcoin</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Serás redirigido a BitPay
        </p>
      </div>
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
