/**
 * @file ProductPriceSection.tsx
 * @description Sección de precio con descuento formateado para el detalle de producto.
 * @architecture Presentation Layer - Product Component
 */

/**
 * @interface ProductPriceSectionProps
 * @description Propiedades del componente ProductPriceSection.
 */
export interface ProductPriceSectionProps {
  /** Precio actual del producto en USD. */
  price: number;
  /** Porcentaje de descuento opcional (ej. 10 para 10%). */
  discountPercentage?: number;
}

/**
 * Muestra el precio del producto con indicador de descuento y precio original tachado.
 *
 * @remarks
 * Renderiza el precio con formateo monetario `tabular-nums` y un badge de
 * porcentaje de descuento si `discountPercentage` está presente.
 *
 * @component
 * @param {ProductPriceSectionProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con la sección de precio.
 */
const ProductPriceSection = ({ price, discountPercentage }: ProductPriceSectionProps) => {
  const hasDiscount = Boolean(discountPercentage && discountPercentage > 0);
  const originalPrice = hasDiscount
    ? price / (1 - (discountPercentage as number) / 100)
    : null;

  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        Precio
      </span>
      <div className="flex items-baseline gap-2.5 tabular-nums">
        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          ${price.toFixed(2)}
        </span>
        {hasDiscount && originalPrice && (
          <span className="text-sm sm:text-base text-muted-foreground line-through font-medium">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {hasDiscount && (
          <span className="inline-flex items-center rounded-full border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
            -{Math.round(discountPercentage as number)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductPriceSection;

