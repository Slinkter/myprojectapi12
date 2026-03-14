/**
 * @file CheckoutSuccess.tsx
 * @description Página de confirmación de compra exitosa.
 * @architecture Presentation Layer - Checkout Feature
 */
import { Link } from "react-router-dom";
import React from "react";
import { Button } from "@/components/ui/button";

const CheckoutSuccess: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background border border-border rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-success text-4xl font-bold">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          ¡Pago Exitoso!
        </h2>
        <p className="text-muted-foreground mb-6">
          Tu pedido ha sido procesado correctamente.
        </p>
        <Link to="/">
          <Button className="w-full">
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
