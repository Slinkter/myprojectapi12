/**
 * @file PaymentSubmitButton.tsx
 * @description Botón de envío del formulario de pago con estado de procesamiento.
 * @architecture Capa de Presentación - Checkout
 */

import { Button } from "@/shared/ui/Button";
import { Loader2, Lock } from "lucide-react";
import type { PaymentMethod } from "./PaymentMethodSelector";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface PaymentSubmitButtonProps
 * @description Propiedades del botón de pago.
 */
interface PaymentSubmitButtonProps {
  /** Indica si el botón debe estar deshabilitado */
  isDisabled: boolean;
  /** Indica si se está procesando el pago */
  isProcessing: boolean;
  /** Método de pago seleccionado para el label aria */
  method: PaymentMethod;
}

/**
 * Botón de envío que muestra estado de carga y un icono de candado.
 * Cambia su texto e icono según el estado de procesamiento.
 *
 * @param {PaymentSubmitButtonProps} props - Propiedades del componente.
 * @returns {JSX.Element} Botón de pago.
 */
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