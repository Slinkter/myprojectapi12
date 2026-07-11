/**
 * @file PaymentMethodSelector.tsx
 * @description Selector visual de método de pago (Visa, Mastercard, Bitcoin).
 * @architecture Capa de Presentación - Checkout
 */

import PaymentMethodRadio from "@/features/checkout/presentation/components/PaymentMethodRadio";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @type {PaymentMethod}
 * @description Métodos de pago disponibles en el selector.
 */
export type PaymentMethod = "visa" | "mastercard" | "bitcoin";

/**
 * @interface PaymentMethodSelectorProps
 * @description Propiedades del componente PaymentMethodSelector.
 */
interface PaymentMethodSelectorProps {
  /** Método de pago actualmente seleccionado */
  currentMethod: PaymentMethod;
  /** Callback al cambiar el método de pago */
  onMethodChange: (method: PaymentMethod) => void;
}

/**
 * Componente que renderiza un grupo de radios visuales para seleccionar el método de pago.
 *
 * @param {PaymentMethodSelectorProps} props - Propiedades del componente.
 * @returns {JSX.Element} Selector de método de pago.
 */
const PaymentMethodSelector = ({
  currentMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) => {
  useLogLifecycle("PaymentMethodSelector");
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