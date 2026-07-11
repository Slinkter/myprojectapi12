/**
 * @interface ProductPriceSectionProps
 * @description Propiedades del componente ProductPriceSection.
 */
interface ProductPriceSectionProps {
  /** Precio actual del producto en USD. */
  price: number;
  /** Porcentaje de descuento opcional (ej. 10 para 10%). */
  discountPercentage?: number;
}

/**
 * Muestra el precio del producto con indicador de descuento.
 *
 * @remarks
 * Renderiza el precio en formato grande junto con un badge de
 * descuento si `discountPercentage` está presente.
 *
 * @component
 * @param props.price - Precio actual del producto.
 * @param props.discountPercentage - Porcentaje de descuento opcional.
 * @returns Elemento JSX con la sección de precio.
 */
const ProductPriceSection = ({ price, discountPercentage }: ProductPriceSectionProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Precio</span>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-foreground">${price}</span>
        {discountPercentage && (
          <span className="text-destructive font-bold">-{Math.round(discountPercentage)}%</span>
        )}
      </div>
    </div>
  );
};

export default ProductPriceSection;
