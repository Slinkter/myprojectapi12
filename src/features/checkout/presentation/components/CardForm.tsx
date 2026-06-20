import { ChangeEvent } from "react";
import { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { Grid, Flex } from "@radix-ui/themes";
import { PersonIcon, CalendarIcon, LockClosedIcon } from "@radix-ui/react-icons";
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
    <Flex direction="column" gap="4">
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
          style: { fontFamily: "var(--font-mono)" },
        }}
      />

      {/* Cardholder Name */}
      <CardInputField
        label="Nombre del titular"
        name="name"
        value={cardInfo.name}
        error={errors.name}
        icon={<PersonIcon />}
        inputProps={{
          placeholder: "Juan Pérez",
          onChange,
        }}
      />

      {/* Expiry and CVC */}
      <Grid columns="2" gap="3">
        <CardInputField
          label="Vencimiento"
          name="expiry"
          value={cardInfo.expiry}
          error={errors.expiry}
          icon={<CalendarIcon />}
          inputProps={{
            placeholder: "MM/YY",
            maxLength: 5,
            onChange,
            style: { fontFamily: "var(--font-mono)" },
          }}
        />

        <CardInputField
          label="CVC"
          name="cvc"
          value={cardInfo.cvc}
          error={errors.cvc}
          icon={<LockClosedIcon />}
          inputProps={{
            placeholder: "123",
            type: "password",
            maxLength: 4,
            onChange,
            style: { fontFamily: "var(--font-mono)" },
          }}
        />
      </Grid>
    </Flex>
  );
};

export default CardForm;
