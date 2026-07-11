import { useLogLifecycle } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

interface PriceRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  variant?: 'default' | 'success' | 'highlight';
}

export function PriceRow({ label, value, variant = 'default' }: PriceRowProps) {
  useLogLifecycle("PriceRow");

  const isSuccess = variant === 'success';
  const isHighlight = variant === 'highlight';

  return (
    <div
      className={cn(
        "flex justify-between items-center text-sm transition-colors",
        isHighlight && "text-lg font-bold border-t border-slate-200 dark:border-slate-800 pt-3 mt-2 text-slate-900 dark:text-slate-100",
        isSuccess && "text-emerald-600 dark:text-emerald-400 font-semibold"
      )}
    >
      <span className={cn(
        isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
      )}>
        {label}
      </span>
      <span className={cn(
        "font-semibold",
        isHighlight ? "text-lg" : "text-sm",
        isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"
      )}>
        {value}
      </span>
    </div>
  );
}