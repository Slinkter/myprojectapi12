/**
 * @file Product.tsx
 * @description Componente de presentación para mostrar la tarjeta de un producto individual.
 * @architecture Presentation Layer - Componente de UI
 */

import React from "react";
import { cn } from "@/lib/utils";
import { useProductModalContext } from "../application/ProductModalContext";
import { Product as ProductInterface } from "../application/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Propiedades para el componente Product.
 */
interface ProductProps {
  /** Objeto con información detallada del producto. */
  product: ProductInterface;
}

/**
 * Componente de tarjeta de producto premium construido con shadcn UI.
 *
 * @remarks
 * Este componente muestra información clave del producto, incluyendo título, descripción,
 * precio y estado del stock. Cuenta con efectos de hover y un botón "Add to Cart"
 * que activa un modal a través de `ProductModalContext`.
 *
 * Está envuelto en `React.memo` para optimizar el rendimiento de renderizado en listas grandes.
 *
 * @param props - Propiedades del componente.
 * @returns El elemento de la tarjeta del producto o null si los datos del producto no son válidos.
 *
 * @example
 * ```tsx
 * <Product product={productData} />
 * ```
 */
const Product = React.memo(({ product }: ProductProps) => {
  const { handleOpenModal } = useProductModalContext();

  if (!product || !product.id) {
    console.error("Product component received invalid product:", product);
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
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-5 flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
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

Product.displayName = "Product";

export default Product;
