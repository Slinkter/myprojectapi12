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
    <div className="mb-8">
      <label
        htmlFor="payment-method"
        className="block text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest"
      >
        Seleccione Método de Pago
      </label>
      <fieldset
        id="payment-method"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <legend className="sr-only">Selección del método de pago</legend>

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
      </fieldset>
    </div>
  );
};

export default PaymentMethodSelector;
