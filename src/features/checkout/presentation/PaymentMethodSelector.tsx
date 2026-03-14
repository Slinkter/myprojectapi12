import PaymentMethodRadio from "@/features/checkout/presentation/components/PaymentMethodRadio";

export type PaymentMethod = "visa" | "mastercard" | "bitcoin";

interface PaymentMethodSelectorProps {
  currentMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({
  currentMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <PaymentMethodRadio
        id="visa"
        label="Visa"
        checked={currentMethod === "visa"}
        onChange={() => onMethodChange("visa")}
      />

      <PaymentMethodRadio
        id="mastercard"
        label="Mastercard"
        checked={currentMethod === "mastercard"}
        onChange={() => onMethodChange("mastercard")}
      />

      <PaymentMethodRadio
        id="bitcoin"
        label="Bitcoin"
        checked={currentMethod === "bitcoin"}
        onChange={() => onMethodChange("bitcoin")}
      />
    </div>
  );
};

export default PaymentMethodSelector;
