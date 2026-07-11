import { ChangeEvent } from "react";
import { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { User, Calendar, Lock } from "lucide-react";
import { HiOutlineCreditCard } from "react-icons/hi2";
import CardInputField from "./CardInputField";
import CardTypeIndicator from "./CardTypeIndicator";
import { useLogLifecycle } from "@/shared/hooks";

interface ICardFormProps {
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CardForm = ({ cardInfo, errors, cardType, onChange }: ICardFormProps) => {
  useLogLifecycle("CardForm");
  return (
    <div className="flex flex-col gap-4">
      {/* Card Number */}
      <CardInputField
        label="Número de tarjeta"
        name="number"
        value={cardInfo.number}
        error={errors.number}
        icon={<HiOutlineCreditCard />}
        rightSlot={<CardTypeIndicator cardType={cardType} />}
        inputProps={{
          placeholder: "1234 5678 9012 3456",
          maxLength: 19,
          onChange,
        }}
      />

      {/* Cardholder Name */}
      <CardInputField
        label="Nombre del titular"
        name="name"
        value={cardInfo.name}
        error={errors.name}
        icon={<User className="h-4 w-4" />}
        inputProps={{
          placeholder: "Juan Pérez",
          onChange,
        }}
      />

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-3">
        <CardInputField
          label="Vencimiento"
          name="expiry"
          value={cardInfo.expiry}
          error={errors.expiry}
          icon={<Calendar className="h-4 w-4" />}
          inputProps={{
            placeholder: "MM/YY",
            maxLength: 5,
            onChange,
          }}
        />

        <CardInputField
          label="CVC"
          name="cvc"
          value={cardInfo.cvc}
          error={errors.cvc}
          icon={<Lock className="h-4 w-4" />}
          inputProps={{
            placeholder: "123",
            type: "password",
            maxLength: 4,
            onChange,
          }}
        />
      </div>
    </div>
  );
};

export default CardForm;