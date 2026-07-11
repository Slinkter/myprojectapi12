import { Link } from "react-router-dom";
import React from "react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

const CheckoutSuccess: React.FC = () => {
  useLogLifecycle("CheckoutSuccess");
  return (
    <div className="flex items-center justify-center p-4 min-h-[70vh]">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-[400px] w-full text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
          <span className="text-4xl font-bold">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-3">
          ¡Pago Exitoso!
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Tu pedido ha sido procesado correctamente.
        </p>
        <Link to="/" className="no-underline">
          <Button className="w-full">
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;