import { Lock } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";

const SecurityBadge = () => {
  useLogLifecycle("SecurityBadge");
  return (
    <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
      <Lock className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">Transacción segura encriptada</span>
    </div>
  );
};

export default SecurityBadge;