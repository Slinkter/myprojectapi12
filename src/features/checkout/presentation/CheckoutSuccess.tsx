/**
 * @file CheckoutSuccess.tsx
 * @description Página de confirmación de compra exitosa.
 * @architecture Presentation Layer - Checkout Feature
 */
import { Link } from "react-router-dom";
import React from "react";

/**
 * Componente de página de éxito.
 * Se muestra tras un pago validado correctamente.
 *
 * @component
 */
import { Button } from "@/components/ui/button";

/**
 * Componente de página de éxito.
 * Se muestra tras un pago validado correctamente.
 *
 * @component
 */
const CheckoutSuccess: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-10 text-center animate-in zoom-in-95 fade-in duration-700">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner border border-green-200 dark:border-green-900/40">
          ✓
        </div>
        <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
          ¡Pago Exitoso!
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 font-medium">
          Tu pedido ha sido procesado correctamente. Recibirás un correo con los
          detalles en breve.
        </p>
        <Link to="/" className="block">
          <Button className="w-full h-14 text-lg font-bold">
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
