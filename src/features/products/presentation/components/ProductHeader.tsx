import { IProduct } from "@/features/products/domain/productTypes";

/**
 * @interface ProductHeaderProps
 * @description Propiedades del componente ProductHeader.
 */
export interface ProductHeaderProps {
  /** Producto del cual se mostrará la cabecera. */
  product: IProduct;
}

/**
 * Cabecera del detalle de producto con marca, categoría, título y descripción.
 *
 * @remarks
 * Renderiza badges de marca y categoría (si existen), título del producto
 * en formato grande con fuente serif y descripción en texto secundario.
 *
 * @component
 * @param props.product - Producto con los datos a mostrar.
 * @returns Elemento JSX con la cabecera del producto.
 */
const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        {product.brand && (
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">
            {product.brand}
          </span>
        )}
        {product.category && (
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent-foreground bg-accent/20 px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black mb-4 text-foreground leading-tight">
        {product.title}
      </h2>
      
      <p className="text-lg text-muted-foreground mb-8 font-sans leading-relaxed">
        {product.description}
      </p>
    </div>
  );
};

export default ProductHeader;
