import { cn } from "@/lib/utils";

interface CardTypeIndicatorProps {
  cardType: string;
}

const CardTypeIndicator = ({ cardType }: CardTypeIndicatorProps) => {
  return (
    <div
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300",
        cardType ? "opacity-100" : "opacity-0",
      )}
    >
      {cardType === "visa" && (
        <span className="font-serif italic font-black text-blue-700 dark:text-blue-400 text-xl tracking-tighter">
          VISA
        </span>
      )}
      {cardType === "mastercard" && (
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-red-500/90 shadow-sm border border-white/10"></div>
          <div className="w-6 h-6 rounded-full bg-amber-500/90 shadow-sm border border-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default CardTypeIndicator;
