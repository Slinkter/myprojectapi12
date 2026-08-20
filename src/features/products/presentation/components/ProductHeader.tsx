/**
 * @file ProductHeader.tsx
 * @description Cabecera informativa para el detalle de producto con marca, categoría, título, valoración y descripción.
 * @architecture Presentation Layer - Product Component
 */

import type { IProduct } from "@/features/products/domain/productTypes";

/**
 * @interface ProductHeaderProps
 * @description Propiedades del componente ProductHeader.
 */
export interface ProductHeaderProps {
  /** Producto del cual se mostrará la cabecera. */
  product: IProduct;
}

/**
 * Cabecera del detalle de producto con marca, categoría, título, valoración por estrellas y descripción.
 *
 * @remarks
 * Renderiza badges de marca y categoría, título prominente del producto,
 * valoración accesible por estrellas con puntaje numérico y descripción en texto secundario.
 *
 * @component
 * @param {ProductHeaderProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con la cabecera del producto.
 */
const ProductHeader = ({ product }: ProductHeaderProps) => {
  const rating = product.rating ?? 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        {product.brand && (
          <span className="inline-flex items-center rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            {product.brand}
          </span>
        )}
        {product.category && (
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
            {product.category}
          </span>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
        {product.title}
      </h2>

      {rating > 0 && (
        <div
          className="flex items-center gap-2"
          aria-label={`Valoración: ${rating.toFixed(1)} de 5 estrellas`}
        >
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 fill-current ${
                  i < Math.round(rating)
                    ? "text-amber-500"
                    : "text-slate-300 dark:text-slate-700"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {rating.toFixed(1)}
          </span>
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </p>
    </div>
  );
};

export default ProductHeader;

