/**
 * @file CheckoutSuccess.tsx
 * @description Pantalla de confirmación de pago exitoso.
 * @architecture Capa de Presentación - Checkout
 */

import { Link } from "react-router-dom";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Componente que muestra la confirmación de un pago exitoso.
 * Incluye un icono de verificación, mensaje de éxito y enlace para continuar comprando.
 *
 * @returns {JSX.Element} Pantalla de éxito del checkout.
 */
const CheckoutSuccess: React.FC = () => {
  useLogLifecycle("CheckoutSuccess");
  return (
    <div className="flex items-center justify-center p-4 min-h-[70vh]">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-[400px] w-full text-center">
        <div
          aria-hidden="true"
          className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto mb-4"
        >
          <CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold mb-3">
          ¡Pago Exitoso!
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Tu pedido ha sido procesado correctamente.
        </p>
        <Link to="/" className="no-underline">
          <Button className="w-full h-11 rounded-xl font-semibold transition-colors">
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;