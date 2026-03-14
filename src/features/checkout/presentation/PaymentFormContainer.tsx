import type { ChangeEvent } from "react";
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

  return (
    <div className="min-h-[300px] transition-all duration-300 ease-in-out">
      {showCardForm ? (
        <CardForm
          cardInfo={cardProps.cardInfo}
          errors={cardProps.errors}
          cardType={cardProps.cardType}
          onChange={cardProps.onChange}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-12 bg-background rounded-2xl border-2 border-dashed border-border animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mb-4 text-4xl text-warning shadow-inner">
            ₿
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Pagar con Bitcoin
          </h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs px-4">
            Será redirigido a nuestra pasarela de pago cripto segura de
            **BitPay**.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentFormContainer;
