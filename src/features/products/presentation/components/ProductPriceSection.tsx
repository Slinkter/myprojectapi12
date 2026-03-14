interface ProductPriceSectionProps {
  price: number;
  discountPercentage?: number;
}

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
