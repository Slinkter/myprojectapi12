import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

interface CardInputFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  icon: ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const inputClasses = (hasError: boolean) => {
  return `w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none
      focus:ring-2 focus:ring-primary/20 focus:border-primary
      ${
        hasError
          ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20 bg-destructive/5"
          : "border-border hover:border-border/80"
      }`;
};

const CardInputField = ({
  label,
  name,
  value,
  error,
  icon,
  inputProps,
}: CardInputFieldProps) => {
  const inputId = `card-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest"
      >
        {label}
      </label>
      <div className="relative group">
        <input
          id={inputId}
          className={cn(inputClasses(!!error), inputProps?.className || "")}
          name={name}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-destructive text-xs mt-1.5 flex items-center gap-1.5 font-bold">
          <HiOutlineExclamationCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CardInputField;
