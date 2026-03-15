import { IoLockClosedOutline } from "react-icons/io5";
import { useLogLifecycle } from "@/shared/hooks";

const SecurityBadge = () => {
  useLogLifecycle("SecurityBadge");
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <IoLockClosedOutline className="w-3.5 h-3.5" />
      <span>Transacción segura encriptada</span>
    </div>
  );
};

export default SecurityBadge;
