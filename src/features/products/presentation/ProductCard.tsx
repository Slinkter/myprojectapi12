import React from "react";
import { cn } from "@/lib/utils";
import { useProductModalContext } from "@/features/products/application/useProductModalContext";
import { IProduct } from "@/features/products/application/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Interfaz para las propiedades del componente.
 * Define que el componente espera un objeto con una propiedad 'product'.
 */
interface IProductCardProps {
  product: IProduct;
}

/**
 * Componente de tarjeta de producto.
 * Recibe un objeto de props que contiene el producto.
 */
const ProductCard = React.memo(({ product }: IProductCardProps) => {
  const { handleOpenModal } = useProductModalContext();

  if (!product || !product.id) {
    console.error("ProductCard component received invalid product:", product);
    return null;
  }

  return (
    <Card
      className="group relative h-full flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 rounded-2xl"
      role="article"
      aria-label={`Producto: ${product.title}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-center">
          <img
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
          />
        </div>
      </CardHeader>

      <CardContent className=" p-5 flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 ">
            {product.description}
          </p>
        </div>

        <div className=" flex items-center justify-between border-t  border-slate-100 dark:border-slate-800  mt-auto pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Precio
            </span>
            <span className="font-bold text-lg text-foreground">
              ${product.price}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Stock
            </span>
            <p
              className={cn(
                "text-xs font-bold",
                product.stock > 10 ? "text-green-600" : "text-amber-600",
              )}
            >
              {product.stock} disponibles
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => handleOpenModal(product)}
          disabled={product.stock === 0}
          className="w-full"
          variant={product.stock > 0 ? "default" : "secondary"}
        >
          {product.stock > 0 ? "Ver detalles" : "Sin stock"}
        </Button>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
