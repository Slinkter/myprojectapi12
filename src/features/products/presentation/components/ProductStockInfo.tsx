import { StockStatus } from "@/shared/lib/stockUtils";
import { cn } from "@/shared/lib/cn";

interface ProductStockInfoProps {
  stock: number;
  status: StockStatus;
}

const ProductStockInfo = ({ stock, status }: ProductStockInfoProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Disponibilidad</span>
      <span className={cn(
        "text-sm font-bold",
        status === "ok" ? "text-success" : "text-accent"
      )}>
        {status === "out" ? "Agotado" : `${stock} en stock`}
      </span>
    </div>
  );
};

export default ProductStockInfo;

