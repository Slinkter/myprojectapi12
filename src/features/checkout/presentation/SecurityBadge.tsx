/**
 * @file SecurityBadge.tsx
 * @description Distintivo de seguridad que indica transacción encriptada.
 * @architecture Capa de Presentación - Checkout
 */

import { Lock } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Componente que muestra un distintivo visual de "Transacción segura encriptada"
 * para transmitir confianza al usuario durante el checkout.
 *
 * @returns {JSX.Element} Distintivo de seguridad.
 */
const SecurityBadge = () => {
  useLogLifecycle("SecurityBadge");
  return (
    <div role="status" className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
      <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs font-medium">Transacción segura encriptada</span>
    </div>
  );
};

export default SecurityBadge;