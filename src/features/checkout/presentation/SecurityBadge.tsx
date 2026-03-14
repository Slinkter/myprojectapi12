import { IoLockClosedOutline } from "react-icons/io5";

const SecurityBadge = () => {
  return (
    <div className="flex flex-col items-center gap-2 mt-8 py-4 bg-background rounded-xl">
      <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2 uppercase tracking-widest">
        <IoLockClosedOutline className="w-3.5 h-3.5" />
        Transacción encriptada SSL de 256 bits
      </p>
    </div>
  );
};

export default SecurityBadge;
