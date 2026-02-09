/**
 * @file Product.tsx
 * @description Componente de presentación para mostrar la tarjeta de un producto individual.
 * @architecture Presentation Layer - Componente de UI
 */

import React from "react";
import { cn } from "@/lib/utils";
import { useProductModalContext } from "../application/ProductModalContext";
import { Product as ProductInterface } from "../application/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * @interface ProductProps
 * @description Propiedades para el componente Product.
 * @property {ProductInterface} product - Objeto con la información detallada del producto.
 */
interface ProductProps {
  product: ProductInterface;
}

/**
 * @component Product
 * @description Tarjeta de producto premium que utiliza shadcn UI.
 * Incluye efectos de hover, tipografía refinada y botones consistentes.
 * 
 * @param {ProductProps} props - Propiedades del componente.
 * @returns {JSX.Element | null} La tarjeta del producto o null si los datos son inválidos.
 */
const Product = React.memo(({ product }: ProductProps) => {
  const { handleOpenModal } = useProductModalContext();

  if (!product || !product.id) {
    console.error("Product component received invalid product:", product);
    return null;
  }

  return (
    <Card
      className="group relative h-full flex flex-col overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      role="article"
      aria-label={`Product: ${product?.title}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden bg-muted/30 p-6 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={`${product.title}`}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-5 flex flex-col">
        <div className="mb-2">
          <h3 className="font-semibold text-base leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</span>
            <span className="font-bold text-lg text-foreground">
              ${product.price}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Availability</span>
            <p className={cn(
              "text-xs font-semibold",
              product.stock > 10 ? "text-green-600 dark:text-green-500" : "text-amber-600 dark:text-amber-500"
            )}>
              {product.stock} left
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => handleOpenModal(product)}
          disabled={product.stock === 0}
          className="w-full font-semibold shadow-md active:scale-95 transition-all duration-200"
          variant={product.stock > 0 ? "default" : "secondary"}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
});

Product.displayName = "Product";

export default Product;