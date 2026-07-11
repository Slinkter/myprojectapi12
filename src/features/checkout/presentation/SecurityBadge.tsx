import { Lock } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";

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